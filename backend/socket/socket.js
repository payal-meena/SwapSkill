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
const Notification = require("../models/notification");

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
        if (!chat) {
          console.error('Chat not found:', chatId);
          return;
        }

        // Prepare payload: support text-only, file-only, or both
        const payload = { chat: chatId, sender: senderId };
        if (file && file.url) {
          payload.file = {
            url: file.url,
            name: file.name || 'file',
            mimeType: file.mimeType || '',
            size: file.size || 0,
          };
          // Set text to filename for display
          payload.text = file.name || '';
        } else {
          payload.text = text || '';
        }

        // Create message in database
        let message = await Message.create(payload);
        console.log('💾 Message created:', message._id, 'with file:', !!file);

        // Populate sender info
        message = await Message.findById(message._id).populate("sender", "name profileImage");

        // Update chat's last message
        chat.lastMessage = message._id;
        chat.lastMessageAt = new Date();
        await chat.save();

        // Prepare message object for emit
        const messageObj = message.toObject ? message.toObject() : message;
        messageObj.chat = chatId;
        
        console.log(`📤 Emitting message ${messageObj._id} to chat room`);
        
        // Emit to everyone in the chat room
        io.to(chatId.toString()).emit("messageReceived", messageObj);
        console.log(`✉️ Message emitted to chat room ${chatId}:`, messageObj._id);

        // Also emit directly to each participant's personal room so clients
        // receive the message even if they haven't joined the chat room yet.
        if (chat.participants && chat.participants.length > 0) {
          chat.participants.forEach(participant => {
            const pId = participant._id ? participant._id.toString() : participant.toString();
            io.to(pId).emit('messageReceived', messageObj);
            console.log(`✉️ Message also emitted to participant room ${pId}:`, messageObj._id);
          });
        }

        // Increment unreadCount for the other participant(s)
        const otherParticipantId = chat.participants.find(p => p.toString() !== senderId.toString());
        if (otherParticipantId) {
          const unreadEntry = chat.unreadCount.find(u => u.userId.toString() === otherParticipantId.toString());
          if (unreadEntry) {
            unreadEntry.count = (unreadEntry.count || 0) + 1;
          } else {
            chat.unreadCount.push({ userId: otherParticipantId, count: 1 });
          }
          await chat.save();
          console.log(`📬 Unread count incremented for user ${otherParticipantId} in chat ${chatId}`);
        }

        // Sidebar update ke liye poora chat populate karo
        const updatedChat = await Chat.findById(chatId)
          .populate("participants", "name profileImage isOnline lastSeen")
          .populate({ path: 'lastMessage', select: 'text file createdAt sender isDeleted' });

        updatedChat.participants.forEach(participant => {
          const pId = participant._id.toString();
          io.to(pId).emit("sidebarUpdate", updatedChat);
        });

        // Send notification to other participant
        const otherParticipant = updatedChat.participants.find(p => p._id.toString() !== senderId.toString());
        if (otherParticipant) {
          try {
            const msgPreview = file ? `📁 ${file.name}` : text.substring(0, 50);
            await Notification.create({
              userId: senderId,
              type: 'message',
              title: 'New Message',
              message: `New message: ${msgPreview}${text.length > 50 ? '...' : ''}`,
              receiverId: otherParticipant._id,
              senderId: senderId,
              relatedId: message._id,
              priority: 'normal'
            });

            // Emit real-time notification
            io.to(otherParticipant._id.toString()).emit('newNotification', {
              type: 'message',
              title: 'New Message',
              message: file ? `📁 ${file.name} sent` : `Message received`,
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

    // --- 3.1 Edit Message (new) ---
    socket.on('editMessage', async ({ messageId, newText, chatId, userId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;
        // Only sender can edit their message
        if (message.sender.toString() !== userId.toString()) return;

        message.text = newText;
        message.isEdited = true;
        message.updatedAt = new Date();
        await message.save();

        // Populate sender for frontend
        const populated = await Message.findById(message._id).populate('sender', 'name profileImage');
        const msgObj = populated.toObject ? populated.toObject() : populated;
        msgObj.chat = chatId;

        // Emit updated message to chat room and each participant personal room
        io.to(chatId.toString()).emit('messageUpdated', msgObj);
        const chat = await Chat.findById(chatId).populate('participants', '_id');
        if (chat && chat.participants) {
          chat.participants.forEach(p => {
            const pId = p._id ? p._id.toString() : p.toString();
            io.to(pId).emit('messageUpdated', msgObj);
          });
        }

        // Update lastMessage if this was the lastMessage
        const fullChat = await Chat.findById(chatId).populate({ path: 'lastMessage', select: 'text file createdAt sender isDeleted seen isEdited' }).populate('participants', 'name profileImage isOnline lastSeen');
        if (fullChat) {
          fullChat.participants.forEach(participant => {
            io.to(participant._id.toString()).emit('sidebarUpdate', fullChat);
          });
        }
      } catch (err) {
        console.error('editMessage handler error', err);
      }
    });

    // --- 4. Mark As Read (Updated to clear unreadCount) ---
    // socket.on("markAsRead", async ({ chatId, userId }) => {
    //   try {
    //     // Mark all messages as read
    //     await Message.updateMany(
    //       { chat: chatId, sender: { $ne: userId }, isRead: false },
    //       { $set: { isRead: true } }
    //     );
        
    //     // Clear unreadCount for this user in this chat
    //     const chat = await Chat.findById(chatId);
    //     if (chat) {
    //       const unreadEntry = chat.unreadCount.find(u => u.userId.toString() === userId.toString());
    //       if (unreadEntry) {
    //         unreadEntry.count = 0;
    //       } else {
    //         chat.unreadCount.push({ userId, count: 0 });
    //       }
    //       await chat.save();
    //       console.log(`✅ Chat ${chatId} marked as read for user ${userId}`);
    //     }
        
    //     io.to(chatId).emit("messagesMarkedAsRead", { chatId, userId });
    //     io.to(userId).emit('unreadCountUpdated', { chatId, count: 0 });
    //   } catch (err) {
    //     console.error('markAsRead error:', err);
    //   }
    // });
    socket.on("markAsRead", async ({ chatId, userId }) => {
  try {
    // 1. Messages read mark
    await Message.updateMany(
      { chat: chatId, sender: { $ne: userId }, isRead: false },
      { $set: { isRead: true } }
    );

    // 2. Unread count reset
    const chat = await Chat.findById(chatId);
    if (!chat) return;

    const unread = chat.unreadCount.find(
      u => u.userId.toString() === userId.toString()
    );

    if (unread) unread.count = 0;
    else chat.unreadCount.push({ userId, count: 0 });

    await chat.save();

    // 3. 🔥 SIDEBAR REAL-TIME UPDATE
    const updatedChat = await Chat.findById(chatId)
      .populate("participants", "name profileImage isOnline lastSeen");

    io.to(userId.toString()).emit("sidebarUpdate", updatedChat);

    // optional (agar chat open hai)
    io.to(chatId.toString()).emit("messagesMarkedAsRead", { chatId, userId });

  } catch (err) {
    console.error("markAsRead error:", err);
  }
});


    // --- Message Seen (read receipt) ---
    socket.on('messageSeen', async ({ messageId, chatId, userId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;
        // Mark this message as seen
        message.seen = true;
        await message.save();

        // Notify sender that message was seen
        const senderId = message.sender.toString();
        io.to(senderId).emit('messageSeen', { messageId, chatId, seenBy: userId });

        // If this was the lastMessage, emit sidebar update so UI shows seen state
        const chat = await Chat.findById(chatId);
        if (chat && chat.lastMessage && chat.lastMessage.toString() === messageId.toString()) {
          const updatedChat = await Chat.findById(chatId)
            .populate("participants", "name profileImage isOnline lastSeen")
            .populate({ path: 'lastMessage', select: 'text file createdAt sender isDeleted seen' });
          updatedChat.participants.forEach(participant => {
            io.to(participant._id.toString()).emit("sidebarUpdate", updatedChat);
          });
        }
      } catch (err) {
        console.error('messageSeen handler error', err);
      }
    });

    // Clear chat (delete messages, keep chat)
    socket.on('clearChat', async ({ chatId, userId }) => {
      try {
        await Message.deleteMany({ chat: chatId });
        io.to(chatId).emit('chatCleared', { chatId, userId });
        console.log(`Chat ${chatId} cleared by ${userId}`);
      } catch (err) {
        console.error('clearChat error:', err);
      }
    });

    // Delete chat (remove from list)
    socket.on('deleteChat', async ({ chatId, userId }) => {
      try {
        await Chat.findByIdAndDelete(chatId);
        io.to(userId).emit('chatDeleted', { chatId });
        console.log(`Chat ${chatId} deleted by ${userId}`);
      } catch (err) {
        console.error('deleteChat error:', err);
      }
    });

    // Mute/Unmute chat
    socket.on('muteChat', async ({ chatId, userId, isMuted }) => {
      try {
        const update = isMuted 
          ? { $addToSet: { mutedBy: userId } }
          : { $pull: { mutedBy: userId } };
        await Chat.findByIdAndUpdate(chatId, update);
        io.to(userId).emit('chatMuted', { chatId, isMuted });
        console.log(`Chat ${chatId} ${isMuted ? 'muted' : 'unmuted'} by ${userId}`);
      } catch (err) {
        console.error('muteChat error:', err);
      }
    });

    // Update unread count
    socket.on('updateUnreadCount', async ({ chatId, userId, increment }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return;
        
        const unread = chat.unreadCount.find(u => u.userId.toString() === userId.toString());
        if (unread) {
          unread.count = Math.max(0, unread.count + increment);
        } else {
          chat.unreadCount.push({ userId, count: Math.max(0, increment) });
        }
        await chat.save();
        io.to(userId).emit('unreadCountUpdated', { chatId, count: unread?.count || 0 });
      } catch (err) {
        console.error('updateUnreadCount error:', err);
      }
    });

    // --- 5. Disconnect Logic (With 5s Delay) ---
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