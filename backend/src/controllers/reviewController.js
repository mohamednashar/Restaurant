const Review = require("../models/Review");

exports.getMealReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ meal: req.params.mealId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ meal: req.params.mealId });

    res.json({
      success: true,
      reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const { rating, comment, orderId } = req.body;

    const existing = await Review.findOne({
      user: req.user._id,
      meal: mealId,
      order: orderId,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this meal for this order",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      meal: mealId,
      order: orderId,
      rating,
      comment,
    });

    await review.populate("user", "name avatar");
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    await Review.findOneAndDelete({ _id: req.params.id });
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    next(error);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("meal", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Review.countDocuments();
    res.json({ success: true, reviews, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};
