
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createOrGetChat,
  getChatHistory,
  getChatStatus,
  getMyChats,
} = require("../controllers/chatController");

router.post("/create", protect, createOrGetChat);

router.get("/:chatId/messages", protect, getChatHistory);

router.get("/:chatId", protect, getChatStatus);

router.get("/", protect, getMyChats);

module.exports = router;
