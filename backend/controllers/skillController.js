const User = require("../models/User.js");
const jwt = require("jsonwebtoken");


const addSkill = async (req, res) => {
  try {
    const { name, type } = req.body; // offered | learn

    if (!["offered", "learn"].includes(type)) {
      return res.status(400).json({ message: "Invalid skill type" });
    }

    const field = type === "offered" ? "skillsOffered" : "skillsToLearn";

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent duplicate skill
    if (user[field].some((s) => s.name === name)) {
      return res.status(400).json({ message: "Skill already exists" });
    }

    user[field].push({ name });
    await user.save();

    res.json(user[field]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* REMOVE SKILL */
const removeSkill = async (req, res) => {
  try {
    const { skillName, type } = req.params;

    if (!["offered", "learn"].includes(type)) {
      return res.status(400).json({ message: "Invalid skill type" });
    }

    const field = type === "offered" ? "skillsOffered" : "skillsToLearn";

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user[field] = user[field].filter((s) => s.name !== skillName);
    await user.save();

    res.json(user[field]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSkill,
  removeSkill,
};