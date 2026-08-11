const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  toggleFavorite,
  getFavorites,
  getAllUsers,
  deleteUser,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

router.get("/favorites", protect, getFavorites);
router.post("/favorites/:mealId", protect, toggleFavorite);

router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
