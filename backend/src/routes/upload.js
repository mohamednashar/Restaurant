const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { upload, cloudinary } = require("../middleware/upload");

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
    });
  }
);

router.delete("/:publicId", protect, authorize("admin"), async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete image" });
  }
});

module.exports = router;
