const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      default: "",
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ meal: 1, user: 1, order: 1 }, { unique: true });
reviewSchema.index({ meal: 1, createdAt: -1 });

reviewSchema.statics.calcAverageRating = async function (mealId) {
  const result = await this.aggregate([
    { $match: { meal: mealId } },
    { $group: { _id: null, avgRating: { $avg: "$rating" }, numReviews: { $sum: 1 } } },
  ]);
  const Meal = mongoose.model("Meal");
  if (result.length > 0) {
    await Meal.findByIdAndUpdate(mealId, {
      rating: Math.round(result[0].avgRating * 10) / 10,
      numReviews: result[0].numReviews,
    });
  } else {
    await Meal.findByIdAndUpdate(mealId, { rating: 0, numReviews: 0 });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRating(this.meal);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) await doc.constructor.calcAverageRating(doc.meal);
});

module.exports = mongoose.model("Review", reviewSchema);
