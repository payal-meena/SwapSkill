const Skill = require("../models/Skill");


exports.addSkill = async (req, res) => {
  try {
    const { skillName, level, type } = req.body;

    if (!skillName || !level || !type) {
      return res.status(400).json({ message: "All fields required" });
    }

    const skill = await Skill.create({
      skillName,
      level,
      type,
      userId: req.user._id,
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user._id });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUserSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.params.userId })
      .populate("userId", "name email");

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await skill.deleteOne();
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
