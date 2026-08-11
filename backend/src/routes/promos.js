const express = require("express");
const router = express.Router();
const { getAllPromos, validatePromo, createPromo, updatePromo, deletePromo, applyPromo } = require("../controllers/promoController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize("admin"), getAllPromos);
router.post("/validate", validatePromo);
router.post("/apply", protect, applyPromo);
router.post("/", protect, authorize("admin"), createPromo);
router.put("/:id", protect, authorize("admin"), updatePromo);
router.delete("/:id", protect, authorize("admin"), deletePromo);

module.exports = router;
