const express = require("express");
const router = express.Router();
const {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  getFeaturedMeals,
  getMealStats,
} = require("../controllers/mealController");
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

router.get("/featured", getFeaturedMeals);
router.get("/stats", protect, authorize("admin"), getMealStats);

router.get("/", getAllMeals);
router.get("/:id", getMealById);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  createMeal
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  updateMeal
);

router.delete("/:id", protect, authorize("admin"), deleteMeal);

module.exports = router;
