const Chat = require("../models/Chat");
const Message = require("../models/Message");

exports.createOrGetChat = async (req, res) => {
  try {
    const { requestId, otherUserId } = req.body;
    const userId = req.user._id;

    let chat = await Chat.findOne({ request: requestId });

    if (!chat) {
      chat = await Chat.create({
        request: requestId,
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
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name")
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
      .populate("participants", "name");

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
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "name")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
