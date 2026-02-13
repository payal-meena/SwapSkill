const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

console.log("[MULTER] Starting setup...");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log("[MULTER] File:", file.originalname, file.mimetype);
    return {
      folder: "chat-media",
      // allowed_formats: ["jpg", "png", "jpeg", "gif", "pdf", "mp4"],
      resource_type: "auto",
      // Force secure URL
      secure: true
    };
  }
});

const uploadAny = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = uploadAny;