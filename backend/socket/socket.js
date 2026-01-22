
const Chat = require("../models/Chat");
const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChat", async ({ chatId, userId }) => {
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      if (!chat.participants.includes(userId)) return;

      socket.join(chatId);
      console.log(`${userId} joined chat ${chatId}`);
    });

    socket.on("sendMessage", async ({ chatId, senderId, text }) => {
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      if (!chat.participants.includes(senderId)) return;

      // ✅ Save message separately
      const message = await Message.create({
        chat: chatId,
        sender: senderId,
        text,
      });

      // ✅ Update chat metadata
      chat.lastMessage = text;
      chat.lastMessageAt = new Date();
      await chat.save();

      // ✅ Emit message
      io.to(chatId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

