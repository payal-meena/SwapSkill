// controllers/uploadController.js
exports.uploadFile = (req, res) => {
  console.log("=== UPLOAD CONTROLLER START ===");
  console.log("req.file exists?", !!req.file);

  if (!req.file) {
    console.log("ERROR: No file in req.file");
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  // CloudinaryStorage ne already upload kar diya hai
  // req.file mein direct Cloudinary response hota hai
  console.log("Cloudinary response in req.file:", {
    path: req.file.path,
    secure_url: req.file.secure_url || req.file.location,
    public_id: req.file.filename || req.file.public_id,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });

  let url = req.file.secure_url || req.file.location || req.file.path;

  if (!url) {
    console.log("ERROR: No URL found after Cloudinary upload");
    return res.status(500).json({ success: false, message: "Upload succeeded but no URL returned" });
  }

  console.log("SUCCESS - Returning URL:", url);

  return res.status(200).json({
    success: true,
    url: url,
    secure_url: url,  // frontend mein secure_url expect kar raha tha
    public_id: req.file.filename || req.file.public_id,
    name: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size
  });
};