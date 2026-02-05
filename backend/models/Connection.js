const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["connected", "blocked"],
      default: "connected",
    },
  },
  { timestamps: true }
);

// Ensure unique follow relationship
connectionSchema.index({ follower: 1, following: 1 }, { unique: true });

const Connection = mongoose.model("Connection", connectionSchema);
module.exports = Connection;
