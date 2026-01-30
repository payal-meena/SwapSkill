const mongoose = require("mongoose");

const skillsToLearnSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
  },
  leval: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Expert"]
  },
  description: {
    type: String,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
      type: Boolean,
      default: true,
    }

}, { timestamps: true });

module.exports = mongoose.model("SkillsToLearn", skillsToLearnSchema);