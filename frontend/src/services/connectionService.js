import api from './api';

export const connectionService = {
  // Get my connections
  getMyConnections: async () => {
    try {
      const response = await api.get('/users/me/connections');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Follow a user
  followUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Unfollow a user
  unfollowUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/unfollow`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Block a user
  blockUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/block`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get connection status with a user
  getConnectionStatus: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/connection-status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
