// backend/controllers/exploreController.js
const User = require("../models/User");
const Skill = require("../models/skillsOffered");
const SkillsToLearn = require("../models/skillsToLearn");


const getAllMentors = async (req, res) => {
  try {
    const users = await User.find({ isBlocked: false }).select(
      "name profileImage rating totalReviews"
    );

    const mentors = await Promise.all(
      users.map(async (user) => {
        const offeredSkills = await Skill.find({ userId: user._id, isActive: true });
        const wantedSkills = await SkillsToLearn.find({ userId: user._id, isActive: true });

        return {
          _id: user._id,
          name: user.name,
          rating: user.rating.toFixed(1),
          reviews: user.totalReviews,
          img: user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
          
          // Skills ko objects ki list bana di
          offeredSkills: offeredSkills.map(s => ({
            name: s.skillName,
            level: s.level
          })),
          
          wantedSkills: wantedSkills.map(s => ({
            name: s.skillName,
            level: s.leval // 'leval' tere schema ki spelling hai
          }))
        };
      })
    );

    res.status(200).json(mentors);
  } catch (error) {
    console.error("Explore fetch error:", error);
    res.status(500).json({ message: "Failed to fetch mentors" });
  }
};
module.exports = { getAllMentors };
