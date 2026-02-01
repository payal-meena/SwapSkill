const Skill = require("../models/skillsOffered.js");
// const SkillsToLearn = require("../models/skillsToLearn.js");
const SkillsToLearn = require("../models/skillsToLearn.js");
const User = require("../models/User.js");

const addSkill = async (req, res) => {
  try {
    const { skillName, level, type, experience, category, description } = req.body;
    const userId = req.user;

    // Validate required fields
    if (!skillName || !level || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: skillName, level, and category are required"
      });
    }
    const existingSkill = await Skill.findOne({
      userId,
      skillName: { $regex: `^${skillName}$`, $options: "i" }, // case-insensitive
      isActive: true
    });

    if (existingSkill) {
      return res.status(409).json({
        success: false,
        message: "You have already added this skill"
      });
    }
    const skill = await Skill.create({
      skillName,
      level,
      type: type || "",
      experience: experience || "",
      userId,
      category,
      thumbnail: req.file ? req.file.path : "https://via.placeholder.com/300",
      description: description || ""
    });

    res.status(201).json({
      success: true,
      message: "Skill added successfully",
      skill
    });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

const getMySkills = async (req, res) => {
  try {
    const userId = req.user;
    const skills = await Skill.find({ userId, isActive: true });

    res.json({
      success: true,
      skills
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserSkills = async (req, res) => {
  try {
    const { userId } = req.params;
    const skills = await Skill.find({ userId, isActive: true }).populate('userId', 'name email profileImage');

    res.json({
      success: true,
      skills
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const skill = await Skill.findOne({ _id: id, userId });
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    skill.isActive = false;
    await skill.save();

    res.json({
      success: true,
      message: "Skill deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addWantedSkill = async (req, res) => {
  try {
    const { skillName, level, description } = req.body;
    const userId = req.user;

    if (!skillName || !level) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: skillName and level are required"
      });
    }

    const wantedSkill = await SkillsToLearn.create({
      skillName,
      leval: level,
      description: description || "",
      userId
    });

    res.status(201).json({
      success: true,
      message: "Wanted skill added successfully",
      skill: wantedSkill
    });
  } catch (error) {
    console.error('Error adding wanted skill:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

const getMyWantedSkills = async (req, res) => {
  try {
    const userId = req.user;
    const wantedSkills = await SkillsToLearn.find({ userId , isActive: true  });

    res.json({
      success: true,
      skills: wantedSkills
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteWantedSkill = async (req, res) => {

  try {

    const { id } = req.params;
    const userId = req.user;

    const skill = await SkillsToLearn.findOne({ _id: id, userId });
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    skill.isActive = false;
    await skill.save();

    res.json({
      success: true,
      message: "Skill deleted successfully"
    });
  } 

  catch (error) {
  res.status(500).json({ message: error.message });


}
}
const editOfferedSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const {
      skillName,
      level,
      category,
      experience,
      description,
      type
    } = req.body;

    const skill = await Skill.findOne({ _id: id, userId, isActive: true });

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    skill.skillName = skillName ?? skill.skillName;
    skill.level = level ?? skill.level;
    skill.category = category ?? skill.category;
    skill.experience = experience ?? skill.experience;
    skill.description = description ?? skill.description;
    skill.type = type ?? skill.type;

    if (req.file) {
      skill.thumbnail = req.file.path;
    }

    await skill.save();

    res.json({
      success: true,
      message: "Skill updated successfully",
      skill
    });

  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const editWantedSkill = async(req, res)=>{
  try{
    const {id}= req.params;
    const userId =req.user;
    const {skillName, level, description}= req.body;
    const wantedSkill = await SkillsToLearn.findOne({_id:id, userId,isActive:true});
    if(!wantedSkill){
      return res.status(404).json({success:false, message:"Wanted skill not found"});
    }
    wantedSkill.skillName = skillName ?? wantedSkill.skillName;
    wantedSkill.leval = level ?? wantedSkill.leval;
    wantedSkill.description =  description ?? wantedSkill.description;
    await wantedSkill.save();
    res.json({
      success:true,
      message:"Wanted skill updated successfully",
      wantedSkill 
    })



  }
  catch(error){
    console.error("Error updating wanted skill:", error);
    res.status(500).json({ success: false, message: error.message });

  }
}

module.exports = {
  addSkill,
  getMySkills,
  getUserSkills,
  deleteSkill,
  addWantedSkill,
  getMyWantedSkills,
  deleteWantedSkill,
  editOfferedSkill,
  editWantedSkill
};
