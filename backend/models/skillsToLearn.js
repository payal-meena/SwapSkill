const mongoose = require("mongoose");

const skillsToLearnSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
  },
 leval:{
  type:String,
  required:true,
  enum:["Beginner","Intermediate","Advanced"]
 }
 ,
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("SkillsToLearn", skillsToLearnSchema);