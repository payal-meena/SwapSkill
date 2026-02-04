// const Chat = require("../models/Chat");
// const Message = require("../models/Message");
// const User = require("../models/User");

// module.exports = (io) => {
//   io.on("connection", async (socket) => {
//     const userId = socket.handshake.query.userId;
//     console.log("User connected:", socket.id);
//     if (userId && userId !== "null") {
//       socket.join(userId); // User-specific room
//       // ✅ 1. User ko Online mark karo
//       await User.findByIdAndUpdate(userId, { isOnline: true });

//       // ✅ 2. Sabko batao ki ye banda Online aa gaya hai
//       socket.broadcast.emit("userStatusChanged", {
//         userId,
//         status: "online",
//       });
//     }


//     socket.on("joinChat", async ({ chatId, userId }) => {
//       try {
//         const chat = await Chat.findById(chatId);
//         if (!chat) {
//           console.log(`⚠️ Chat not found: ${chatId}`);
//           return;
//         }

//         // Check if user is a participant (handle both string and ObjectId)
//         const isParticipant = chat.participants.some(p => 
//           p.toString() === userId.toString()
//         );
        
//         if (!isParticipant) {
//           console.log(`⚠️ User ${userId} is not a participant of chat ${chatId}`);
//           return;
//         }

//         socket.join(chatId);
//         console.log(`✅ ${userId} joined chat ${chatId}`);
//       } catch (err) {
//         console.error("JoinChat Error:", err);
//       }
//     });

    
//     socket.on("sendMessage", async ({ chatId, senderId, text }) => {
//       try {
//         const chat = await Chat.findById(chatId);
//         if (!chat) return;

//         // 1. Message create karo
//         let message = await Message.create({
//           chat: chatId,
//           sender: senderId,
//           text,
//         });

//         // 2. YAHAN SUDHAAR HAI: Pehle populate karo
//         // Note: populate ke baad .execPopulate() ki zaroorat naye versions mein nahi hoti
//         // par await lagana zaroori hai
//         message = await Message.findById(message._id).populate("sender", "name profileImage");

//         // 3. Chat metadata update
//         chat.lastMessage = message._id;
//         chat.lastMessageAt = new Date();
//         await chat.save();

//         // 4. Add chat reference to message for frontend
//         const messageObj = message.toObject ? message.toObject() : message;
//         messageObj.chat = chatId;
        
//         console.log(`📤 Emitting message ${messageObj._id} to chat room and participants`);
        
//         // 5. Emit to everyone in the chat room
//         io.to(chatId.toString()).emit("messageReceived", messageObj);
//         console.log(`✉️ Message emitted to chat room ${chatId}:`, messageObj._id);

//         // 6. Also emit to each participant individually (ensure they receive even if not in room)
//         // if (chat.participants && chat.participants.length > 0) {
//         //   chat.participants.forEach(participant => {
//         //     const participantId = participant._id ? participant._id.toString() : participant.toString();
//         //     io.to(participantId).emit("messageReceived", messageObj);
//         //     console.log(`✉️ Message sent to participant room ${participantId}:`, messageObj._id);
//         //   });
//         // }
//         updatedChat.participants.forEach(participant => {
//   const pId = participant._id.toString();
//   // Sidebar update event ko generic rakho ya user-specific, lekin frontend listener se match hona chahiye
//   io.to(pId).emit("sidebarUpdate", updatedChat); 
// });

//         // 7. Sidebar update ke liye poora chat populate karo
//         const updatedChat = await Chat.findById(chatId)
//           .populate("participants", "name profileImage isOnline lastSeen")
//           .populate("lastMessage");

//         updatedChat.participants.forEach(participant => {
//           io.to(participant._id.toString()).emit(`sidebarUpdate`, updatedChat);
//         });
//       } catch (err) {
//         console.error("Socket SendMessage Error:", err);
//       }
//     });
//     socket.on("deleteMessage", async ({ messageId, chatId, type, userId }) => {
//       try {
//         const message = await Message.findById(messageId);
//         if (!message) return;

//         if (type === "everyone") {
//           // Check karo ki delete karne wala sender hi hai na?
//           if (message.sender.toString() !== userId.toString()) return;

//           message.isDeleted = true;
//           message.text = "This message was deleted";
//           await message.save();

//           // Sabko update bhej do
//           io.to(chatId).emit("messageDeleted", { messageId, type: "everyone" });
//         }
//         else if (type === "me") {
//           message.deletedFor.push(userId);
//           await message.save();

//           // Sirf usi user ko emit karo jisne delete kiya (ya sirf frontend se handle karlo)
//           socket.emit("messageDeleted", { messageId, type: "me" });
//         }
//       } catch (err) {
//         console.log("Delete error:", err);
//       }
//     });
//     // Backend Socket logic
//     socket.on("markAsRead", async ({ chatId, userId }) => {
//       await Message.updateMany(
//         { chat: chatId, sender: { $ne: userId }, isRead: false },
//         { $set: { isRead: true } }
//       );
//       // Optional: Doosre user ko notify karo ki message padh liya gaya hai
//       io.to(chatId).emit("messagesMarkedAsRead", { chatId });
//     });

//     // Manual logout signal from client -> immediately mark offline
//     socket.on('manualLogout', async ({ userId: logoutUserId }) => {
//       try {
//         if (!logoutUserId) return;
//         await User.findByIdAndUpdate(logoutUserId, { isOnline: false, lastSeen: new Date() });
//         io.emit('userStatusChanged', { userId: logoutUserId, status: 'offline', lastSeen: new Date() });
//         console.log(`User ${logoutUserId} manually logged out via socket.`);
//       } catch (err) {
//         console.error('manualLogout error:', err);
//       }
//     });

//     // Is block ko replace kar apne disconnect wale block se
//     socket.on("disconnect", async () => {
//       console.log("User disconnected attempt:", socket.id);

//       if (userId && userId !== "null") {
//         // 1. Foran offline mat karo, 5 second ka timer lagao
//         setTimeout(async () => {
//           // 2. Check karo ki kya user ne kisi dusre tab ya naye page se connect kiya hai?
//           const activeSockets = await io.in(userId).fetchSockets();

//           // Agar koi bhi active socket nahi mila, matlab user sach mein offline gaya hai
//           if (activeSockets.length === 0) {
//             await User.findByIdAndUpdate(userId, {
//               isOnline: false,
//               lastSeen: new Date()
//             });

//             // Sabko offline signal bhejo
//             io.emit("userStatusChanged", {
//               userId,
//               status: "offline",
//               lastSeen: new Date(),
//             });
//             console.log(`User ${userId} is now officially offline.`);
//           } else {
//             console.log(`User ${userId} reconnected on another page, skipping offline status.`);
//           }
//         }, 5000); // 5 second ka delay
//       }
//     });
//   });
// };
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", socket.id);

    if (userId && userId !== "null") {
      socket.join(userId); 
      await User.findByIdAndUpdate(userId, { isOnline: true });
      socket.broadcast.emit("userStatusChanged", {
        userId,
        status: "online",
      });
    }

    // --- 1. Join Chat ---
    socket.on("joinChat", async ({ chatId, userId }) => {
      try {
        socket.join(chatId.toString());
        // Check if user is a participant (handle both string and ObjectId)
        socket.join(userId.toString());
        console.log(`✅ ${userId} joined chat ${chatId}`);

      } catch (err) {
        console.error("JoinChat Error:", err);
      }
    });

    // --- 2. Send Message (Real-time Fix) ---
    socket.on("sendMessage", async ({ chatId, senderId, text, file }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return;

        // Prepare payload: support text-only, file-only, or both
        const payload = { chat: chatId, sender: senderId };
        if (file) {
          payload.file = {
            url: file.url,
            name: file.name,
            mimeType: file.mimeType,
            size: file.size,
          };
          // If no text provided, set text to filename for preview/lastMessage
          payload.text = file.name || '';
        } else {
          payload.text = text || '';
        }

        let message = await Message.create(payload);

        message = await Message.findById(message._id).populate("sender", "name profileImage");

        chat.lastMessage = message._id;
        chat.lastMessageAt = new Date();
        await chat.save();

        const messageObj = message.toObject ? message.toObject() : message;
        messageObj.chat = chatId;
        
        // Chat room mein message bhejo (Laptop B ko yahan se milega)
        io.to(chatId.toString()).emit("messageReceived", messageObj);

        // Sidebar update ke liye data taiyaar karo
        const updatedChat = await Chat.findById(chatId)
          .populate("participants", "name profileImage isOnline lastSeen")
          .populate({ path: 'lastMessage', select: 'text createdAt sender isDeleted file' });

        // Har participant ko sidebar update bhejo
        updatedChat.participants.forEach(participant => {
          const pId = participant._id.toString();
          io.to(pId).emit("sidebarUpdate", updatedChat);
        });
      } catch (err) {
        console.error("Socket SendMessage Error:", err);
      }
    });

    // --- 3. Delete Message (Purana Function) ---
    socket.on("deleteMessage", async ({ messageId, chatId, type, userId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        if (type === "everyone") {
          if (message.sender.toString() !== userId.toString()) return;
          message.isDeleted = true;
          message.text = "This message was deleted";
          await message.save();
          io.to(chatId).emit("messageDeleted", { messageId, type: "everyone" });
        } else if (type === "me") {
          message.deletedFor.push(userId);
          await message.save();
          socket.emit("messageDeleted", { messageId, type: "me" });
        }
      } catch (err) {
        console.log("Delete error:", err);
      }
    });

    // --- 4. Mark As Read (Purana Function) ---
    socket.on("markAsRead", async ({ chatId, userId }) => {
      await Message.updateMany(
        { chat: chatId, sender: { $ne: userId }, isRead: false },
        { $set: { isRead: true } }
      );
      io.to(chatId).emit("messagesMarkedAsRead", { chatId });
    });

    // --- 5. Disconnect Logic (With 5s Delay) ---
    socket.on("disconnect", async () => {
      if (userId && userId !== "null") {
        setTimeout(async () => {
          const activeSockets = await io.in(userId).fetchSockets();
          if (activeSockets.length === 0) {
            await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
            io.emit("userStatusChanged", {
              userId,
              status: "offline",
              lastSeen: new Date(),
            });
          }
        }, 5000);
      }
    });
  });
};