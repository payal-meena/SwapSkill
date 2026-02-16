
const Chat = require("../models/Chat");
const Request=require("../models/Request")
const Message = require("../models/Message");

exports.createOrGetChat = async (req, res) => {
  try {
    const { requestId, otherUserId } = req.body;
    const userId = req.user;
    
    // Validation
    if (!otherUserId) {
      return res.status(400).json({ message: "otherUserId is required" });
    }

    // Ensure both are valid ObjectIds (strings)
    if (typeof otherUserId !== 'string' || otherUserId.trim() === '') {
      return res.status(400).json({ message: "Invalid otherUserId format" });
    }

    // Validate request if provided
    let request = null;
    if (requestId && requestId !== 'null' && requestId !== '') {
      request = await Request.findById(requestId);
      if (!request) return res.status(404).json({ message: "Request not found" });
    }

    // Search for existing chat - use both requestId and participants
    let chat;
    
    if (requestId && requestId !== 'null' && requestId !== '') {
      // If requestId provided, search by requestId
      chat = await Chat.findOne({ request: requestId });
    } else {
      // If no requestId, search by both participants (normalized)
      chat = await Chat.findOne({
        participants: { 
          $all: [
            String(userId).trim(), 
            String(otherUserId).trim()
          ] 
        }
      });
    }

    // If chat doesn't exist, create new one
    if (!chat) {
      chat = await Chat.create({
        request: (requestId && requestId !== 'null') ? requestId : null,
        participants: [String(userId).trim(), String(otherUserId).trim()],
        unreadCount: [
          { userId: String(userId).trim(), count: 0 },
          { userId: String(otherUserId).trim(), count: 0 }
        ]
      });
    }

    // Always populate before returning
    chat = await Chat.findById(chat._id)
      .populate("participants", "name profileImage isOnline lastSeen")
      .populate({
        path: "lastMessage",
        select: "text createdAt sender isDeleted file"
      });

    res.status(200).json(chat);
  } catch (error) {
    console.error('createOrGetChat error:', error.message);
    res.status(500).json({ message: error.message });
  }
};


exports.getChatHistory = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user;

    const messages = await Message.find({ 
      chat: chatId,
      deletedFor: { $ne: userId } // $ne matlab: Jin messages mein meri ID deletedFor mein NAHI hai
    })
    .populate("sender", "name profileImage")
    .populate({
      path: "replyTo",
      populate: {
        path: "sender",
        select: "name profileImage"
      }})
    .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChatStatus = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId)
      .populate("participants", "name profileImage");

    if (!chat || !chat.participants.some(p => p._id.equals(userId))) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyChats = async (req, res) => {
  try {
    const userId = req.user;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name profileImage isOnline lastSeen")
      .populate({
        path: "lastMessage",
        model: "Message",
        select: "text createdAt sender isDeleted file"
      })
      .sort({ updatedAt: -1 });

    // Filter out invalid chats (those without valid participants)
    const validChats = chats.filter(chat => 
      chat.participants && 
      chat.participants.length === 2 && 
      chat.participants.every(p => p && p._id)
    );

    res.status(200).json(validChats);
  } catch (error) {
    console.error('getMyChats error:', error);
    res.status(500).json({ message: error.message });
  }
};

