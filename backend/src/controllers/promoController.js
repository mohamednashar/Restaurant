const PromoCode = require("../models/PromoCode");

exports.getAllPromos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const promos = await PromoCode.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await PromoCode.countDocuments();
    res.json({ success: true, promos, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.validatePromo = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promo) {
      return res.status(404).json({ success: false, message: "Invalid promo code" });
    }
    const validity = promo.isValid();
    if (!validity.valid) {
      return res.status(400).json({ success: false, message: validity.message });
    }
    const discountResult = promo.calculateDiscount(orderAmount);
    if (!discountResult.valid) {
      return res.status(400).json({ success: false, message: discountResult.message });
    }
    res.json({
      success: true,
      promo: { code: promo.code, description: promo.description, discountType: promo.discountType, discountValue: promo.discountValue },
      discount: discountResult.discount,
    });
  } catch (error) {
    next(error);
  }
};

exports.createPromo = async (req, res, next) => {
  try {
    const existing = await PromoCode.findOne({ code: req.body.code?.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Promo code already exists" });
    }
    if (req.body.code) req.body.code = req.body.code.toUpperCase();
    if (req.body.discountValue) req.body.discountValue = parseFloat(req.body.discountValue);
    if (req.body.minOrderAmount) req.body.minOrderAmount = parseFloat(req.body.minOrderAmount);
    if (req.body.maxDiscountAmount) req.body.maxDiscountAmount = parseFloat(req.body.maxDiscountAmount);
    if (req.body.usageLimit) req.body.usageLimit = parseInt(req.body.usageLimit);
    if (req.body.isActive !== undefined) req.body.isActive = req.body.isActive === "true" || req.body.isActive === true;

    const promo = await PromoCode.create(req.body);
    res.status(201).json({ success: true, promo });
  } catch (error) {
    next(error);
  }
};

exports.updatePromo = async (req, res, next) => {
  try {
    const promo = await PromoCode.findById(req.params.id);
    if (!promo) {
      return res.status(404).json({ success: false, message: "Promo code not found" });
    }
    if (req.body.code) req.body.code = req.body.code.toUpperCase();
    if (req.body.discountValue) req.body.discountValue = parseFloat(req.body.discountValue);
    if (req.body.minOrderAmount) req.body.minOrderAmount = parseFloat(req.body.minOrderAmount);
    if (req.body.maxDiscountAmount) req.body.maxDiscountAmount = parseFloat(req.body.maxDiscountAmount);
    if (req.body.usageLimit) req.body.usageLimit = parseInt(req.body.usageLimit);
    if (req.body.isActive !== undefined) req.body.isActive = req.body.isActive === "true" || req.body.isActive === true;

    const updated = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, promo: updated });
  } catch (error) {
    next(error);
  }
};

exports.deletePromo = async (req, res, next) => {
  try {
    const promo = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promo) {
      return res.status(404).json({ success: false, message: "Promo code not found" });
    }
    res.json({ success: true, message: "Promo code deleted" });
  } catch (error) {
    next(error);
  }
};

exports.applyPromo = async (req, res, next) => {
  try {
    const promo = await PromoCode.findOne({ code: req.body.code?.toUpperCase() });
    if (!promo) {
      return res.status(404).json({ success: false, message: "Invalid promo code" });
    }
    const validity = promo.isValid();
    if (!validity.valid) {
      return res.status(400).json({ success: false, message: validity.message });
    }
    const discountResult = promo.calculateDiscount(req.body.orderAmount);
    if (!discountResult.valid) {
      return res.status(400).json({ success: false, message: discountResult.message });
    }
    promo.usedCount += 1;
    await promo.save();
    res.json({ success: true, discount: discountResult.discount, code: promo.code });
  } catch (error) {
    next(error);
  }
};
