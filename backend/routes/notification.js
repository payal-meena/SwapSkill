const express = require('express');
const router = express.Router();
const { createNotification, getMyNotifications,markNotificationAsRead,markAllNotificationsAsRead, deleteNotification} = require('../controllers/notificationController.js');
const protect = require('../middleware/authMiddleware.js');

router.post('/', protect, createNotification)
router.get('/', protect, getMyNotifications)
router.put('/all/read', protect, markAllNotificationsAsRead)
router.put('/:notificationId/read', protect, markNotificationAsRead)
router.delete('/:notificationId', protect, deleteNotification)

module.exports=router;