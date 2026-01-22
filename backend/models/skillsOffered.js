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
      enum: ["Offer", "Learn"],
      required: true,
    },
    experience: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    catogory: {
      type: String,
      required: true,
      enum: ["IT & Software", "Business", "Finance & Accounting", "Marketing", "Health & Fitness", "Livestyle", "Photography", "Music", "Teaching & Academics"]

    }
    ,
    thumbnail: {
      type: String,
      required: true,


    },
    description: {
      type: String,
      required: true,

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
