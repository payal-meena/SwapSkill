const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
    const { bio, location, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user,
      { bio, location, email },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE PASSWORD */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user);

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
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
      imageUrl: req.file.path,
      user,
    });
  } catch (error) {
    console.error("Profile image update error:", error);
    res.status(500).json({ message: error.message });
  }
};

// controllers/userController.js


const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user; // JWT middleware se aata hai

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Cloudinary image delete yaha kar sakte ho

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getMyProfile,
  updateProfile,
  updatePassword,
  updateProfileImage,
  deleteMyAccount 
};
