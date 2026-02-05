const Notification = require('../models/notification.js');

const createNotification = async (req, res) => {
    console.log("=== CREATE NOTIFICATION START ===");
    console.log("Notification model:", Notification);
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);
    console.log("receiverId:", req.body.receiverId);


    const allowedTypes = [
        "message",
        "CONNECTION_REQUEST",
        "CONNECTION_ACCEPTED",
        "SYSTEM"
    ];
    try {
        const userId = req.user; // middleware se direct id milti hai
        console.log("userId from middleware:", userId);

        const { type, title, message, senderId, relatedId, priority, redirectUrl } = req.body;
        const { receiverId } = req.body;

        console.log("Extracted data:", { type, title, message, receiverId, priority });

        if (!type || !title || !message) {
            console.log("Missing required fields:", { type, title, message });
            return res.status(400).json({
                message: "type,title and message are required fields",
                success: false,
            })
        }

        if (!receiverId) {
            console.log("receiverId missing");
            return res.status(400).json({
                message: "receiverId is required",
                success: false,
            })
        }
        if (!allowedTypes.includes(type)) {
            console.log("Invalid type:", type);
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
        
        console.log("Before sender/receiver check");
        if (senderId && senderId.toString() === receiverId.toString()) {
            console.log("Sender and receiver are same");
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
        
        console.log("Final notificationData:", notificationData);
        
        const notification = await Notification.create(notificationData);
        console.log("Notification created:", notification);
        
        // Populate notification for socket emission
        const populatedNotification = await Notification.findById(notification._id)
            .populate('senderId', 'name profilePicture')
            .populate('receiverId', 'name');
        console.log("Populated notification:", populatedNotification);
        
        // Emit real-time notification if socket is available
        if (req.io) {
            console.log("Emitting socket notification to:", receiverId.toString());
            req.io.to(receiverId.toString()).emit('newNotification', populatedNotification);
        } else {
            console.log("Socket IO not available");
        }
        
        console.log("Sending success response");
        res.status(201).json({
            success: true,
            message: "Notification created successfullly",
            notification,
        });
        console.log("=== CREATE NOTIFICATION END ===");
    }
    catch (error) {
        console.log("Error in createNotification:", error);
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}





const getMyNotifications = async (req, res) => {
    console.log("=== GET MY NOTIFICATIONS START ===");
    try {
        const userId = req.user;
        console.log("userId for fetching notifications:", userId);

        if (!userId) {
            console.log("No userId found");
            return res.status(400).json({
                message: "Unauthorized access",
                success: false,
            });
        }
        
        console.log("Searching notifications for receiverId:", userId);
        const notifications = await Notification.find({ receiverId: userId })
            .populate('senderId', 'name profilePicture')
            .sort({ createdAt: -1 });
            
        console.log("Found notifications:", notifications.length);
        console.log("Notifications data:", notifications);
            
        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
        });
        console.log("=== GET MY NOTIFICATIONS END ===");

    }
    catch (error) {
        console.log("Error in getMyNotifications:", error);
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
    console.log("=== MARK ALL NOTIFICATIONS AS READ START ===");
    try {
        const userId = req.user;
        console.log("userId for mark all as read:", userId);
        console.log("userId type:", typeof userId);
        
        if (!userId) {
            console.log("No userId found");
            return res.status(400).json({
                success: false,
                message: "User ID not found"
            });
        }
        
        console.log("About to update notifications...");
        const result = await Notification.updateMany(
            {
                receiverId: userId,
                isRead: false,
            }, {
            $set: { isRead: true }
        }
        );

        console.log("Update result:", result);
        console.log("Matched count:", result.matchedCount);
        console.log("Modified count:", result.modifiedCount);

        return res.status(200).json({
            success: true,
            message: result.matchedCount === 0 ? "No unread notifications found" : "All notifications marked as read",
            modifiedCount: result.modifiedCount
        });

    }
    catch (error) {
        console.log("Error in markAllNotificationsAsRead:", error);
        console.log("Error stack:", error.stack);
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}


const deleteNotification = async (req, res) => {
    console.log("=== DELETE NOTIFICATION START ===");
    try {
        const { notificationId } = req.params;
        const userId = req.user;
        
        console.log("notificationId:", notificationId);
        console.log("userId:", userId);

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
        console.log("Notification deleted successfully");

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });

    } catch (error) {
        console.log("Error in deleteNotification:", error);
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