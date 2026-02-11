const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },


    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    text: {
      type: String,
      trim: true,
      default: ''
    },

    file: {
      url: { type: String },
      name: { type: String },
      mimeType: { type: String },
      size: { type: Number }
    },


    isRead: {
      type: Boolean,
      default: false,
    },
    // Whether the message content was edited by the sender
    isEdited: {
      type: Boolean,
      default: false,
    },
    // Whether the message was seen/read by the recipient
    seen: {
      type: Boolean,
      default: false,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null
    },
    isDeleted: {
      type: Boolean, default: false
    }, // Delete for Everyone
    deletedFor: [{
      type: mongoose.Schema.Types.ObjectId, ref: "User"
    }], // Delete for Specific Users

  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
