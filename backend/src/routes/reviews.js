const express = require("express");
const router = express.Router();
const { getMealReviews, createReview, deleteReview, getAllReviews } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth");

router.get("/meal/:mealId", getMealReviews);
router.post("/meal/:mealId", protect, createReview);
router.delete("/:id", protect, deleteReview);
router.get("/admin/all", protect, authorize("admin"), getAllReviews);

module.exports = router;
