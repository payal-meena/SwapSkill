
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
//       const chat = await Chat.findById(chatId);
//       if (!chat) return;

//       if (!chat.participants.includes(userId)) return;

//       socket.join(chatId);
//       console.log(`${userId} joined chat ${chatId}`);
//     });

//     socket.on("sendMessage", async ({ chatId, senderId, text }) => {
//       const chat = await Chat.findById(chatId);
//       if (!chat) return;

//       const message = await Message.create({
//         chat: chatId,
//         sender: senderId,
//         text,
//       });
//       if (!chat.participants.some(p => p.toString() === senderId.toString())) return;

//       // ✅ Save message separately

//       // ✅ Update chat metadata
//       chat.lastMessage = message._id;
//       chat.lastMessageAt = new Date();
//       await chat.save();

//       // ✅ Emit message
//       io.to(chatId).emit("messageReceived", message);
//       const updatedChat = await Chat.findById(chatId)
//         .populate("participants", "name profileImage isOnline lastSeen")
//         .populate("lastMessage");

//       // Har participant ko batane ke liye
//       updatedChat.participants.forEach(participant => {
//         io.emit(`sidebarUpdate_${participant._id}`, updatedChat);
//       });


//     });
//     // ✅ Delete Message Event
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
const Notification = require("../models/notification");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", socket.id);
    if (userId && userId !== "null") {
      socket.join(userId); // User-specific room
      // ✅ 1. User ko Online mark karo
      await User.findByIdAndUpdate(userId, { isOnline: true });

      // ✅ 2. Sabko batao ki ye banda Online aa gaya hai
      socket.broadcast.emit("userStatusChanged", {
        userId,
        status: "online",
      });
    }


    socket.on("joinChat", async ({ chatId, userId }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          console.log(`⚠️ Chat not found: ${chatId}`);
          return;
        }

        // Check if user is a participant (handle both string and ObjectId)
        const isParticipant = chat.participants.some(p => 
          p.toString() === userId.toString()
        );
        
        if (!isParticipant) {
          console.log(`⚠️ User ${userId} is not a participant of chat ${chatId}`);
          return;
        }

        socket.join(chatId);
        console.log(`✅ ${userId} joined chat ${chatId}`);
      } catch (err) {
        console.error("JoinChat Error:", err);
      }
    });

    
    socket.on("sendMessage", async ({ chatId, senderId, text }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return;

        // 1. Message create karo
        let message = await Message.create({
          chat: chatId,
          sender: senderId,
          text,
        });

        // 2. YAHAN SUDHAAR HAI: Pehle populate karo
        // Note: populate ke baad .execPopulate() ki zaroorat naye versions mein nahi hoti
        // par await lagana zaroori hai
        message = await Message.findById(message._id).populate("sender", "name profileImage");

        // 3. Chat metadata update
        chat.lastMessage = message._id;
        chat.lastMessageAt = new Date();
        await chat.save();

        // 4. Add chat reference to message for frontend
        message = message.toObject ? message.toObject() : message;
        message.chat = chatId;
        
        // 5. Emit to everyone in the chat room
        io.to(chatId).emit("messageReceived", message);
        console.log(`✉️ Message emitted to room ${chatId}:`, message._id);

        // 6. Sidebar update ke liye poora chat populate karo
        const updatedChat = await Chat.findById(chatId)
          .populate("participants", "name profileImage isOnline lastSeen")
          .populate("lastMessage");

        updatedChat.participants.forEach(participant => {
          io.to(participant._id.toString()).emit(`sidebarUpdate`, updatedChat);
        });

        // 7. Send notification to other participant
        const otherParticipant = updatedChat.participants.find(p => p._id.toString() !== senderId.toString());
        if (otherParticipant) {
          try {
            await Notification.create({
              userId: senderId,
              type: 'message',
              title: 'New Message',
              message: `${message.sender.name}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
              receiverId: otherParticipant._id,
              senderId: senderId,
              relatedId: message._id,
              priority: 'normal'
            });

            // Emit real-time notification
            io.to(otherParticipant._id.toString()).emit('newNotification', {
              type: 'message',
              title: 'New Message',
              message: `${message.sender.name} sent you a message`,
              createdAt: new Date()
            });
          } catch (notifError) {
            console.log('Error sending message notification:', notifError);
          }
        }
      } catch (err) {
        console.error("Socket SendMessage Error:", err);
      }
    });
    socket.on("deleteMessage", async ({ messageId, chatId, type, userId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        if (type === "everyone") {
          // Check karo ki delete karne wala sender hi hai na?
          if (message.sender.toString() !== userId.toString()) return;

          message.isDeleted = true;
          message.text = "This message was deleted";
          await message.save();

          // Sabko update bhej do
          io.to(chatId).emit("messageDeleted", { messageId, type: "everyone" });
        }
        else if (type === "me") {
          message.deletedFor.push(userId);
          await message.save();

          // Sirf usi user ko emit karo jisne delete kiya (ya sirf frontend se handle karlo)
          socket.emit("messageDeleted", { messageId, type: "me" });
        }
      } catch (err) {
        console.log("Delete error:", err);
      }
    });
    // Backend Socket logic
    socket.on("markAsRead", async ({ chatId, userId }) => {
      await Message.updateMany(
        { chat: chatId, sender: { $ne: userId }, isRead: false },
        { $set: { isRead: true } }
      );
      // Optional: Doosre user ko notify karo ki message padh liya gaya hai
      io.to(chatId).emit("messagesMarkedAsRead", { chatId });
    });

    // Notification events
    socket.on("sendNotification", async (notificationData) => {
      try {
        const notification = await Notification.create(notificationData);
        const populatedNotification = await Notification.findById(notification._id)
          .populate('sender', 'name profilePicture')
          .populate('recipient', 'name');
        
        // Send to specific user
        io.to(notificationData.recipient).emit("newNotification", populatedNotification);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    });

    // Is block ko replace kar apne disconnect wale block se
    socket.on("disconnect", async () => {
      console.log("User disconnected attempt:", socket.id);

      if (userId && userId !== "null") {
        // 1. Foran offline mat karo, 5 second ka timer lagao
        setTimeout(async () => {
          // 2. Check karo ki kya user ne kisi dusre tab ya naye page se connect kiya hai?
          const activeSockets = await io.in(userId).fetchSockets();

          // Agar koi bhi active socket nahi mila, matlab user sach mein offline gaya hai
          if (activeSockets.length === 0) {
            await User.findByIdAndUpdate(userId, {
              isOnline: false,
              lastSeen: new Date()
            });

            // Sabko offline signal bhejo
            io.emit("userStatusChanged", {
              userId,
              status: "offline",
              lastSeen: new Date(),
            });
            console.log(`User ${userId} is now officially offline.`);
          } else {
            console.log(`User ${userId} reconnected on another page, skipping offline status.`);
          }
        }, 5000); // 5 second ka delay
      }
    });
  });
};