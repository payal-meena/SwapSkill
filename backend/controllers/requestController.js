const Request = require("../models/Request");
const Notification = require("../models/notification");
const Chat = require("../models/Chat");
const User = require("../models/User");


const sendRequest = async (req, res) => {
  console.log("REQ.USER =", req.user);

  try {
    const { receiver, offeredSkill, requestedSkill } = req.body;
    const requester = req.user;

    // Receiver mandatory
    if (!receiver) {
      return res.status(400).json({
        success: false,
        message: "receiver is required",
      });
    }

    if (requester === receiver) {
      return res.status(400).json({
        success: false,
        message: "You cannot send request to yourself",
      });
    }

    // Optional skills check
    const existingRequestQuery = {
      requester,
      receiver,
      status: "pending",
    };

    if (offeredSkill?.name) existingRequestQuery["offeredSkill.name"] = offeredSkill.name;
    if (requestedSkill?.name) existingRequestQuery["requestedSkill.name"] = requestedSkill.name;

    const existingRequest = await Request.findOne(existingRequestQuery);

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request already sent",
      });
    }

    const requestData = {
      requester,
      receiver,
    };

    // Only add skills if present
    if (offeredSkill) requestData.offeredSkill = offeredSkill;
    if (requestedSkill) requestData.requestedSkill = requestedSkill;

    const request = await Request.create(requestData);

    // Send notification to receiver
    try {
      await Notification.create({
        userId: requester,
        type: 'CONNECTION_REQUEST',
        title: 'New Connection Request',
        message: `Someone wants to connect with you for skill exchange!`,
        receiverId: receiver,
        senderId: requester,
        relatedId: request._id,
        priority: 'normal'
      });

      // Emit real-time notification if socket is available
      if (req.io) {
        req.io.to(receiver.toString()).emit('newNotification', {
          type: 'CONNECTION_REQUEST',
          title: 'New Connection Request',
          message: 'Someone wants to connect with you!',
          createdAt: new Date()
        });
      }
    } catch (notifError) {
      console.log('Error sending notification:', notifError);
    }
    
    // Emit request update to both parties so frontend can refresh without reload
    try {
      if (req.io) {
        const populated = await Request.findById(request._id)
          .populate("requester", "name email profileImage")
          .populate("receiver", "name email profileImage");

        req.io.to(receiver.toString()).emit('requestUpdated', populated);
        req.io.to(requester.toString()).emit('requestUpdated', populated);
      }
    } catch (emitErr) {
      console.log('Error emitting request update:', emitErr);
    }

    res.status(201).json({
      success: true,
      message: "Skill request sent successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



 const getMyRequests = async (req, res) => {
  try {
    const userId = req.user;

    const requests = await Request.find({
      $or: [{ requester: userId }, { receiver: userId }],
    })
      .populate("requester", "name email profileImage")
      .populate("receiver", "name email profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      currentUser: userId,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


 const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

  
    if (request.receiver.toString() !== req.user) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept this request",
      });
    }

    request.status = "accepted";
    request.receiverAccepted = true;

    await request.save();

    // Create Chat if doesn't exist
    let chat;
    try {
      chat = await Chat.findOne({ request: request._id });
      if (!chat) {
        chat = await Chat.create({
          request: request._id,
          participants: [request.requester, request.receiver],
          unreadCount: [
            { userId: request.requester, count: 0 },
            { userId: request.receiver, count: 0 }
          ]
        });
        // Populate participants
        chat = await Chat.findById(chat._id)
          .populate('participants', 'name profileImage')
          .populate('lastMessage');
      }
    } catch (chatErr) {
      console.log('Error creating/finding chat:', chatErr);
    }

    // Send notification to requester
    try {
      await Notification.create({
        userId: req.user,
        type: 'CONNECTION_ACCEPTED',
        title: 'Request Accepted!',
        message: `Your connection request has been accepted!`,
        receiverId: request.requester,
        senderId: req.user,
        relatedId: request._id,
        priority: 'high'
      });

      // Emit real-time notification
      if (req.io) {
        req.io.to(request.requester.toString()).emit('newNotification', {
          type: 'CONNECTION_ACCEPTED',
          title: 'Request Accepted!',
          message: 'Your connection request has been accepted!',
          createdAt: new Date()
        });
      }
    } catch (notifError) {
      console.log('Error sending notification:', notifError);
    }

    // Emit new chat created event to both users
    try {
      if (req.io && chat) {
        const chatWithPopulated = {
          ...chat.toObject(),
          isNew: true // Flag to show visual indicator
        };
        req.io.to(request.requester.toString()).emit('chatCreated', chatWithPopulated);
        req.io.to(request.receiver.toString()).emit('chatCreated', chatWithPopulated);
      }
    } catch (emitErr) {
      console.log('Error emitting chatCreated:', emitErr);
    }

    res.status(200).json({
      success: true,
      message: "Request accepted",
      request,
      chat
    });

    // Emit requestUpdated to both parties
    try {
      if (req.io) {
        const populated = await Request.findById(request._id)
          .populate("requester", "name email profileImage")
          .populate("receiver", "name email profileImage");

        req.io.to(populated.requester._id.toString()).emit('requestUpdated', populated);
        req.io.to(populated.receiver._id.toString()).emit('requestUpdated', populated);
      }
    } catch (emitErr) {
      console.log('Error emitting request update (accept):', emitErr);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const withdrawRequest = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Sirf requester withdraw kare
    if (request.requester.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to withdraw this request",
      });
    }

    // Sirf pending request withdraw ho sakti hai
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be withdrawn",
      });
    }

    request.status = "cancelled";
    await request.save();

    // Emit requestUpdated to both parties
    try {
      if (req.io) {
        const populated = await Request.findById(request._id)
          .populate("requester", "name email profileImage")
          .populate("receiver", "name email profileImage");

        req.io.to(populated.requester._id.toString()).emit('requestUpdated', populated);
        req.io.to(populated.receiver._id.toString()).emit('requestUpdated', populated);
      }
    } catch (emitErr) {
      console.log('Error emitting request update (withdraw):', emitErr);
    }
    res.status(200).json({
      success: true,
      message: "Request withdrawn successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unfriend/Cancel an accepted request
const unfriendUser = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Either requester or receiver can unfriend
    if (request.requester.toString() !== userId && request.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to unfriend this user",
      });
    }

    // Only accepted requests can be unfriended
    if (request.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted requests can be unfriended",
      });
    }

    request.status = "cancelled";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Unfriended successfully",
    });
    // Emit requestUpdated to both parties
    try {
      if (req.io) {
        const populated = await Request.findById(request._id)
          .populate("requester", "name email profileImage")
          .populate("receiver", "name email profileImage");

        req.io.to(populated.requester._id.toString()).emit('requestUpdated', populated);
        req.io.to(populated.receiver._id.toString()).emit('requestUpdated', populated);
      }
    } catch (emitErr) {
      console.log('Error emitting request update (unfriend):', emitErr);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


 const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.receiver.toString() !== req.user) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reject this request",
      });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Request rejected",
    });
    // Emit requestUpdated to both parties
    try {
      if (req.io) {
        const populated = await Request.findById(request._id)
          .populate("requester", "name email profileImage")
          .populate("receiver", "name email profileImage");

        req.io.to(populated.requester._id.toString()).emit('requestUpdated', populated);
        req.io.to(populated.receiver._id.toString()).emit('requestUpdated', populated);
      }
    } catch (emitErr) {
      console.log('Error emitting request update (reject):', emitErr);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


 const completeRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const userId = req.user;

    if (request.requester.toString() === userId) {
      request.requesterCompleted = true;
    }

    if (request.receiver.toString() === userId) {
      request.receiverCompleted = true;
    }

  
    if (request.requesterCompleted && request.receiverCompleted) {
      request.status = "completed";
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request marked as completed",
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  sendRequest,
  getMyRequests,
  acceptRequest,
  rejectRequest,
  completeRequest,
  withdrawRequest,
  unfriendUser,
};