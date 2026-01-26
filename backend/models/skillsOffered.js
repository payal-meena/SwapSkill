const { required } = require("joi");
const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    type: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      required: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Design & Creative", "Development & IT", "Business & Marketing", "Languages", "Music & Arts", "Education"]
    }
    ,
    thumbnail: {
      type: String,
      required: true,


    },
    description: {
      type: String,
      required: false
    }

    ,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
