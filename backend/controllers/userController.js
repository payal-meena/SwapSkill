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
    const { bio, location, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user,
      { bio, location, profileImage },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getMyProfile,
  updateProfile,
 
};
