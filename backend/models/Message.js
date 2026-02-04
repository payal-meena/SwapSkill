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
    isDeleted: {
       type: Boolean, default: false 
      }, // Delete for Everyone
    deletedFor: [{
       type: mongoose.Schema.Types.ObjectId, ref: "User" 
      }] , // Delete for Specific Users

  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
