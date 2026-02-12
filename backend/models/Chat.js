
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: false,
      unique: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message" 
    },
    lastMessageAt: Date,
    mutedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    unreadCount: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      count: { type: Number, default: 0 }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
