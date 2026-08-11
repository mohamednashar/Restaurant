const Meal = require("../models/Meal");
const { cloudinary } = require("../middleware/upload");

exports.getAllMeals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.isAvailable !== undefined) {
      query.isAvailable = req.query.isAvailable === "true";
    }

    if (req.query.isFeatured !== undefined) {
      query.isFeatured = req.query.isFeatured === "true";
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    let sort = { createdAt: -1 };
    if (req.query.sort === "price_asc") sort = { price: 1 };
    if (req.query.sort === "price_desc") sort = { price: -1 };
    if (req.query.sort === "name") sort = { name: 1 };
    if (req.query.sort === "rating") sort = { rating: -1 };

    const total = await Meal.countDocuments(query);
    const meals = await Meal.find(query)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      meals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMealById = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id).populate(
      "category",
      "name slug"
    );
    if (!meal) {
      return res
        .status(404)
        .json({ success: false, message: "Meal not found" });
    }
    res.json({ success: true, meal });
  } catch (error) {
    next(error);
  }
};

exports.createMeal = async (req, res, next) => {
  try {
    const mealData = { ...req.body };

    if (req.file) {
      mealData.image = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    if (mealData.options && typeof mealData.options === "string") {
      mealData.options = JSON.parse(mealData.options);
    }

    if (mealData.ingredients && typeof mealData.ingredients === "string") {
      mealData.ingredients = JSON.parse(mealData.ingredients);
    }

    if (mealData.price) mealData.price = parseFloat(mealData.price);
    if (mealData.preparationTime)
      mealData.preparationTime = parseInt(mealData.preparationTime);
    if (mealData.isAvailable !== undefined)
      mealData.isAvailable = mealData.isAvailable === "true" || mealData.isAvailable === true;
    if (mealData.isFeatured !== undefined)
      mealData.isFeatured = mealData.isFeatured === "true" || mealData.isFeatured === true;

    const meal = await Meal.create(mealData);
    await meal.populate("category", "name slug");

    res.status(201).json({ success: true, meal });
  } catch (error) {
    next(error);
  }
};

exports.updateMeal = async (req, res, next) => {
  try {
    let meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res
        .status(404)
        .json({ success: false, message: "Meal not found" });
    }

    const updateData = { ...req.body };

    if (req.file) {
      if (meal.image && meal.image.publicId) {
        await cloudinary.uploader.destroy(meal.image.publicId);
      }
      updateData.image = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    if (updateData.options && typeof updateData.options === "string") {
      updateData.options = JSON.parse(updateData.options);
    }

    if (updateData.ingredients && typeof updateData.ingredients === "string") {
      updateData.ingredients = JSON.parse(updateData.ingredients);
    }

    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.preparationTime)
      updateData.preparationTime = parseInt(updateData.preparationTime);
    if (updateData.isAvailable !== undefined)
      updateData.isAvailable = updateData.isAvailable === "true" || updateData.isAvailable === true;
    if (updateData.isFeatured !== undefined)
      updateData.isFeatured = updateData.isFeatured === "true" || updateData.isFeatured === true;

    meal = await Meal.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    res.json({ success: true, meal });
  } catch (error) {
    next(error);
  }
};

exports.deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res
        .status(404)
        .json({ success: false, message: "Meal not found" });
    }

    if (meal.image && meal.image.publicId) {
      await cloudinary.uploader.destroy(meal.image.publicId);
    }

    await Meal.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Meal deleted" });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedMeals = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const meals = await Meal.find({ isFeatured: true, isAvailable: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, meals });
  } catch (error) {
    next(error);
  }
};

exports.getMealStats = async (req, res, next) => {
  try {
    const totalMeals = await Meal.countDocuments();
    const availableMeals = await Meal.countDocuments({ isAvailable: true });
    const featuredMeals = await Meal.countDocuments({ isFeatured: true });

    const categoryStats = await Meal.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          name: "$category.name",
          count: 1,
          avgPrice: { $round: ["$avgPrice", 2] },
        },
      },
    ]);

    res.json({
      success: true,
      stats: { totalMeals, availableMeals, featuredMeals, categoryStats },
    });
  } catch (error) {
    next(error);
  }
};
