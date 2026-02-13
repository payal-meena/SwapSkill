
const Chat = require("../models/Chat");
const Request=require("../models/Request")
const Message = require("../models/Message");

exports.createOrGetChat = async (req, res) => {
  try {
    const { requestId, otherUserId } = req.body;
    const userId = req.user;
    // Validation: Agar koi ID missing hai toh 500 ki jagah 400 bhejo
    if (!otherUserId) {
    return res.status(400).json({ message: "otherUserId is required" });
  }

  // Agar requestId diya hai to validate karo, warna skip
  let request = null;
  if (requestId) {
    request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });
    // Optional: check if request is accepted or pending as per your logic
  }

    let chat = await Chat.findOne({ request: requestId });

    if (!chat) {
      chat = await Chat.create({
        request: requestId||null,
        participants: [userId, otherUserId],
      });
    }

    res.status(200).json(chat);
  } catch (error) {
  
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

    res.status(200).json(chats);
  } catch (error) {
  
    res.status(500).json({ message: error.message });
  }
};

