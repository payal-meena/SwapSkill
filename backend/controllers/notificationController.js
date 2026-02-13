const Notification = require('../models/notification.js');

const createNotification = async (req, res) => {



    const allowedTypes = [
        "message",
        "CONNECTION_REQUEST",
        "CONNECTION_ACCEPTED",
        "SYSTEM"
    ];
    try {
        const userId = req.user; // middleware se direct id milti hai
       

        const { type, title, message, senderId, relatedId, priority, redirectUrl } = req.body;
        const { receiverId } = req.body;

       

        if (!type || !title || !message) {
            
            return res.status(400).json({
                message: "type,title and message are required fields",
                success: false,
            })
        }

        if (!receiverId) {
    
            return res.status(400).json({
                message: "receiverId is required",
                success: false,
            })
        }
        if (!allowedTypes.includes(type)) {
            
            return res.status(400).json({
                success: false,
                message: "Invalid notification type"
            });
        }
        const notificationData = {
            userId,
            type,
            title,
            message,
            isRead: false,
            priority: priority || "normal",
            createdAt: new Date()
        };
        
       
        if (senderId && senderId.toString() === receiverId.toString()) {
            
            return res.status(400).json({
                success: false,
                message: "Sender and receiver cannot be same"
            });
        }

        if (senderId) notificationData.senderId = senderId;
        if (relatedId) notificationData.relatedId = relatedId;
        if (priority) notificationData.priority = priority;
        if (redirectUrl) notificationData.redirectUrl = redirectUrl;
        if (receiverId) notificationData.receiverId = receiverId;
        
       
        
        const notification = await Notification.create(notificationData);
        
        
        // Populate notification for socket emission
        const populatedNotification = await Notification.findById(notification._id)
            .populate('senderId', 'name profilePicture')
            .populate('receiverId', 'name');
        
        
        // Emit real-time notification if socket is available
        if (req.io) {
        
            req.io.to(receiverId.toString()).emit('newNotification', populatedNotification);
        } else {
           
        }
        
      
        res.status(201).json({
            success: true,
            message: "Notification created successfullly",
            notification,
        });
       
    }
    catch (error) {
        
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}





const getMyNotifications = async (req, res) => {
  ;
    try {
        const userId = req.user;
       

        if (!userId) {
          
            return res.status(400).json({
                message: "Unauthorized access",
                success: false,
            });
        }
        
       
        const notifications = await Notification.find({ receiverId: userId })
            .populate('senderId', 'name profilePicture')
            .sort({ createdAt: -1 });
    
            
        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
        });
       

    }
    catch (error) {
      
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}


const markNotificationAsRead = async (req, res) => {
    try {

        const { notificationId } = req.params;


        const userId = req.user;

        if (!notificationId) {
            return res.status(400).json({
                success: false,
                message: "notificationId is required",
            });
        }


        const notification = await Notification.findOne({
            _id: notificationId,
            receiverId: userId,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }


        if (notification.isRead) {
            return res.status(200).json({
                success: true,
                message: "Notification already marked as read",
            });
        }


        notification.isRead = true;
        await notification.save();


        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};




const getUnreadNotificationCount = async (req, res) => {
    try {

    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}


const markAllNotificationsAsRead = async (req, res) => {
   
    try {
        const userId = req.user;
       
        
        if (!userId) {
           
            return res.status(400).json({
                success: false,
                message: "User ID not found"
            });
        }
        
      
        const result = await Notification.updateMany(
            {
                receiverId: userId,
                isRead: false,
            }, {
            $set: { isRead: true }
        }
        );

        

        return res.status(200).json({
            success: true,
            message: result.matchedCount === 0 ? "No unread notifications found" : "All notifications marked as read",
            modifiedCount: result.modifiedCount
        });

    }
    catch (error) {
       
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}


const deleteNotification = async (req, res) => {
   
    try {
        const { notificationId } = req.params;
        const userId = req.user;
        
       

        if (!notificationId) {
            return res.status(400).json({
                success: false,
                message: "notificationId is required",
            });
        }

        const notification = await Notification.findOne({
            _id: notificationId,
            receiverId: userId,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        await Notification.findByIdAndDelete(notificationId);
        
        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });

    } catch (error) {
        
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}


module.exports = {
    createNotification,
    getMyNotifications,
    markNotificationAsRead,
    getUnreadNotificationCount,
    deleteNotification,
    markAllNotificationsAsRead,
}