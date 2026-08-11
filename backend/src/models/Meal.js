const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Meal name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    options: [
      {
        title: { type: String, required: true },
        additionalPrice: { type: Number, default: 0 },
      },
    ],
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
    preparationTime: {
      type: Number,
      default: 15,
      min: [1, "Preparation time must be at least 1 minute"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    nutritionalInfo: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },
    allergens: [
      {
        type: String,
        trim: true,
      },
    ],
    dietaryLabels: [
      {
        type: String,
        enum: ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free", "spicy", "halal"],
      },
    ],
  },
  { timestamps: true }
);

mealSchema.index({ category: 1 });
mealSchema.index({ name: "text", description: "text" });
mealSchema.index({ isFeatured: 1 });
mealSchema.index({ isAvailable: 1 });
mealSchema.index({ price: 1 });

module.exports = mongoose.model("Meal", mealSchema);
