
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const Notification = require("../models/notification");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    

    if (userId && userId !== "null") {
      socket.join(userId || userId.toString());
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
        

      } catch (err) {
        console.error("JoinChat Error:", err);
      }
    });

    // --- 2. Send Message (Real-time Fix) ---
    socket.on("sendMessage", async ({ chatId, senderId, text, file, replyTo, tempId }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          console.error('Chat not found:', chatId);
          return;
        }

        // Prepare payload: support text-only, file-only, or both
        const payload = {
          chat: chatId,
          sender: senderId,
          replyTo: replyTo || null
        };
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
        

        // Populate sender info
        message = await Message.findById(message._id).populate("sender", "name profileImage").populate({
          path: "replyTo",
          populate: { path: "sender", select: "name profileImage" }
        });

        // Update chat's last message
        chat.lastMessage = message._id;
        chat.lastMessageAt = new Date();


        // Prepare message object for emit
        const messageObj = message.toObject ? message.toObject() : message;
        messageObj.chat = chatId;

        
        if (tempId) messageObj.tempId = tempId;

        // Emit to everyone in the chat room
        io.to(chatId.toString()).emit("messageReceived", messageObj);
        


        const otherParticipantId = chat.participants.find(p => p.toString() !== senderId.toString());
        if (otherParticipantId) {
          const unreadEntry = chat.unreadCount.find(u => u.userId.toString() === otherParticipantId.toString());
          if (unreadEntry) {
            unreadEntry.count = (unreadEntry.count || 0) + 1;
          } else {
            chat.unreadCount.push({ userId: otherParticipantId, count: 1 });
          }
          await chat.save();
        
        }

        // Sidebar update ke liye poora chat populate karo
        const updatedChat = await Chat.findById(chatId)
          .populate("participants", "name profileImage isOnline lastSeen")
          .populate({
            path: 'lastMessage',
            populate: {
              path: 'replyTo',
              select: "text file sender createdAt",
              populate: { path: 'sender', select: 'name profileImage' }
            }
          });

        updatedChat.participants.forEach(participant => {
          const pId = participant._id.toString();
          io.to(pId).emit("sidebarUpdate", updatedChat);
        });

        // Send notification to other participant
        const otherParticipant = updatedChat.participants.find(p => p._id.toString() !== senderId.toString());
        if (otherParticipant) {
          try {
            const sender = await User.findById(senderId).select('name profileImage');
            const senderName = sender?.name || 'Someone';
            
            // Count unread messages from this sender
            const unreadEntry = chat.unreadCount.find(u => u.userId.toString() === otherParticipant._id.toString());
            const unreadCount = unreadEntry?.count || 1;

            // Emit grouped notification
            io.to(otherParticipant._id.toString()).emit('newNotification', {
              type: 'message',
              senderId: senderId.toString(),
              senderName: senderName,
              senderImage: sender?.profileImage,
              messageCount: unreadCount,
              chatId: chatId.toString(),
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
    // Clear chat (Hide messages only for the person who clicked clear)
    socket.on('clearChat', async ({ chatId, userId }) => {
      try {

        await Message.updateMany(
          { chat: chatId },
          { $addToSet: { deletedFor: userId } }
        );

        const chat = await Chat.findById(chatId);
        if (chat) {
          // Aap chahein toh sidebar update emit kar sakte hain empty state ke saath
          io.to(userId.toString()).emit("sidebarUpdate", { ...chat._doc, lastMessage: null });
        }
        socket.emit('chatCleared', { chatId, userId });

      
      } catch (err) {
        console.error('clearChat error:', err);
      }
    });

    // Delete chat (remove from list)
    // Delete chat (Sirf us user ke liye hide karna, database se delete nahi)
    socket.on('deleteChat', async ({ chatId, userId }) => {
      try {
        // 1. Chat document mein user ki ID add karein deletedBy array mein
        await Chat.findByIdAndUpdate(chatId, {
          $addToSet: { deletedBy: userId }
        });

        // 2. Us chat ke saare messages bhi us user ke liye hide kar dein
        await Message.updateMany(
          { chat: chatId },
          { $addToSet: { deletedFor: userId } }
        );

        // 3. Sirf us user ko emit karein
        socket.emit('chatDeleted', { chatId });

        
      } catch (err) {
        console.error('deleteChat error:', err);
      }
    });

    // Mute/Unmute chat
    socket.on('muteChat', async ({ chatId, userId, isMuted }) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return;

    let updatedMutedBy = chat.mutedBy || [];

    if (isMuted) {
      if (!updatedMutedBy.includes(userId)) {
        updatedMutedBy.push(userId);
      }
    } else {
      updatedMutedBy = updatedMutedBy.filter(id => id.toString() !== userId.toString());
    }

    chat.mutedBy = updatedMutedBy;
    await chat.save();

    // Broadcast to room
    io.to(chatId).emit('chatMuted', { chatId, userId, isMuted });
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
    // --- Connection Request Real-time logic ---
    socket.on("sendConnectionRequest", async ({ senderId, receiverId, requestData }) => {
      try {
        // 1. Receiver ko signal bhejo ki naya request aaya hai
        // Hum receiverId ke 'room' mein emit kar rahe hain (jo socket.join(userId) se banta hai)
        io.to(receiverId.toString()).emit("newIncomingRequest", {
          senderId,
          requestData,
          timestamp: new Date()
        });

      
      } catch (err) {
        console.error("Request Socket Error:", err);
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