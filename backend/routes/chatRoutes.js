
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createOrGetChat,
  getChatHistory,
  getChatStatus,
  getMyChats,
} = require("../controllers/chatController");

// router.post("/create", protect, createOrGetChat);

// router.get("/:chatId/messages", protect, getChatHistory);

// router.get("/:chatId", protect, getChatStatus);

// router.get("/", protect, getMyChats);
router.post("/", protect, createOrGetChat); // URL: /api/chats/
router.get("/my-chats", protect, getMyChats); // URL: /api/chats/my-chats
router.get("/history/:chatId", protect, getChatHistory); // URL: /api/chats/history/:id
router.get("/status/:chatId", protect, getChatStatus);

module.exports = router;
