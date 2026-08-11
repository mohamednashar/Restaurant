const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Promo code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: [0, "Discount cannot be negative"],
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

promoCodeSchema.index({ code: 1 });
promoCodeSchema.index({ isActive: 1 });

promoCodeSchema.methods.isValid = function () {
  if (!this.isActive) return { valid: false, message: "Promo code is inactive" };
  if (this.expiresAt && new Date() > this.expiresAt)
    return { valid: false, message: "Promo code has expired" };
  if (this.usageLimit && this.usedCount >= this.usageLimit)
    return { valid: false, message: "Promo code usage limit reached" };
  return { valid: true };
};

promoCodeSchema.methods.calculateDiscount = function (orderAmount) {
  if (orderAmount < this.minOrderAmount) {
    return { valid: false, message: `Minimum order amount is $${this.minOrderAmount}` };
  }
  let discount = 0;
  if (this.discountType === "percentage") {
    discount = (orderAmount * this.discountValue) / 100;
    if (this.maxDiscountAmount) {
      discount = Math.min(discount, this.maxDiscountAmount);
    }
  } else {
    discount = this.discountValue;
  }
  discount = Math.min(discount, orderAmount);
  return { valid: true, discount: Math.round(discount * 100) / 100 };
};

module.exports = mongoose.model("PromoCode", promoCodeSchema);
