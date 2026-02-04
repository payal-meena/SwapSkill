const uploadAny = require("../middleware/uploadAnyMiddleware");

// Simple controller that expects `file` field and returns uploaded URL
exports.uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // multer-storage-cloudinary sets `path` to the uploaded URL
    const url = req.file.path || req.file.location || req.file.secure_url;
    return res.status(200).json({ success: true, url });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
