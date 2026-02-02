// const Chat = require("../models/Chat");
// const Message = require("../models/Message");

// exports.createOrGetChat = async (req, res) => {
//   try {
//     const { requestId, otherUserId } = req.body;
//     const userId = req.user;
//     // Validation: Agar koi ID missing hai toh 500 ki jagah 400 bhejo
//     if (!requestId || !otherUserId) {
//       return res.status(400).json({ message: "RequestId and otherUserId are required" });
//     }

//     let chat = await Chat.findOne({ request: requestId });

//     if (!chat) {
//       chat = await Chat.create({
//         request: requestId,
//         participants: [userId, otherUserId],
//       });
//     }

//     res.status(200).json(chat);
//   } catch (error) {
//     console.error("Chat Error:", error); // Terminal mein error dekhne ke liye
//     res.status(500).json({ message: error.message });
//   }
// };


// exports.getChatHistory = async (req, res) => {
//   try {
//     const { chatId } = req.params;
//    const userId = req.user;

//     const chat = await Chat.findById(chatId);
//    if (!chat || !chat.participants.some(p => p.toString() === userId.toString())) {
//    return res.status(403).json({ message: "Access denied" });
// }

//     const messages = await Message.find({ chat: chatId })
//       .populate("sender", "name profileImage")
//       .sort({ createdAt: 1 });

//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// exports.getChatStatus = async (req, res) => {
//   try {
//     const { chatId } = req.params;
//     const userId = req.user._id;

//     const chat = await Chat.findById(chatId)
//       .populate("participants", "name profileImage");

//     if (!chat || !chat.participants.some(p => p._id.equals(userId))) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     res.status(200).json(chat);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// exports.getMyChats = async (req, res) => {
//   try {
//     const userId = req.user;

//     const chats = await Chat.find({
//       participants: userId,
//     })
//       .populate("participants", "name profileImage")
//       .populate("lastMessage")
//       .sort({ updatedAt: -1 });

//     res.status(200).json(chats);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const Chat = require("../models/Chat");
const Message = require("../models/Message");

exports.createOrGetChat = async (req, res) => {
  try {
    const { requestId, otherUserId } = req.body;
    const userId = req.user;
    // Validation: Agar koi ID missing hai toh 500 ki jagah 400 bhejo
    if (!requestId || !otherUserId) {
      return res.status(400).json({ message: "RequestId and otherUserId are required" });
    }

    let chat = await Chat.findOne({ request: requestId });

    if (!chat) {
      chat = await Chat.create({
        request: requestId,
        participants: [userId, otherUserId],
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Chat Error:", error); // Terminal mein error dekhne ke liye
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

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "name profileImage isOnline lastSeen")
      .populate({
        path: "lastMessage",
        model: "Message", // Explicitly model name dena safe hota hai
        select: "text createdAt sender isDeleted"
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("getMyChats Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// exports.getMyChats = async (req, res) => {
//   try {
//     const userId = req.user;

//     const chats = await Chat.find({
//       participants: userId,
//     })
//       .populate("participants", "name profileImage")
//       .populate("lastMessage")
//       .sort({ updatedAt: -1 });

//     res.status(200).json(chats);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };