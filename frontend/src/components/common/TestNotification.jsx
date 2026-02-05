import React, { useState } from 'react';
import { notificationService } from '../../services/notificationService';

const TestNotification = () => {
  const [loading, setLoading] = useState(false);

  const sendTestNotification = async () => {
    console.log("=== FRONTEND: SENDING TEST NOTIFICATION ===");
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log("Token exists:", !!token);
      
      if (!token) {
        alert('Token not found. Please login again.');
        return;
      }
      
      // Extract userId from token
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;
      
      console.log("UserId from token:", userId);
      
      if (!userId) {
        alert('User ID not found in token. Please login again.');
        return;
      }
      
      const notificationData = {
        type: 'SYSTEM',
        title: 'Test Notification',
        message: 'This is a test notification from the system!',
        receiverId: userId,
        priority: 'normal'
      };
      
      console.log("Sending notification data:", notificationData);
      
      const response = await notificationService.createNotification(notificationData);
      
      console.log('Notification response:', response);
      
      // Refresh notifications after creating
      if (window.location.pathname.includes('dashboard')) {
        window.location.reload();
      }
      
      alert('Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      console.error('Error response:', error.response?.data);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      console.log("=== FRONTEND: TEST NOTIFICATION END ===");
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white mb-4">Test Notification System</h3>
      <button
        onClick={sendTestNotification}
        disabled={loading}
        className="bg-[#13ec5b] text-black px-4 py-2 rounded-lg hover:bg-[#13ec5bce] disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Test Notification'}
      </button>
    </div>
  );
};

export default TestNotification;