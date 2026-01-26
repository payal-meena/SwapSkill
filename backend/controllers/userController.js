const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

/* GET MY PROFILE */
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE PROFILE */
const updateProfile = async (req, res) => {
  try {
    const { bio, location, } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user,
      { bio, location},
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: req.file.path },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile image updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  updateProfileImage
 
};
