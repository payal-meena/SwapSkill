import api from './api';

export const blockService = {
  // Block a user
  blockUser: async (userId) => {
    const res = await api.post(`/users/${userId}/block`);
    return res.data;
  },

  // Get list of blocked users
  getBlockedUsers: async () => {
    const res = await api.get('/users/me/blocked');
    return res.data;
  },

  // Unblock a user
  unblockUser: async (userId) => {
    const res = await api.delete(`/users/${userId}/block`);
    return res.data;
  },

  // Check if user is blocked
  isBlocked: async (userId) => {
    const res = await api.get(`/users/${userId}/block-status`);
    return res.data;
  }
};
