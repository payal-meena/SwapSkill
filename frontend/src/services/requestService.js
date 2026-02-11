
import api from './api';

export const requestService = {
  sendRequest: async (data) => {
    return api.post("/requests", data);
  },

  getMyRequests: async () => {
    const res = await api.get("/requests");
    return res.data; 
  },
  markRequestsAsSeen: async () => {
  const res = await api.put("/requests/seen");
  return res.data;
},

  withdrawRequest: async (requestId) => {
    // Controller status 'cancelled' karta hai, isliye hum put request bhejenge
    const response = await api.put(`/requests/withdraw/${requestId}`);
    return response.data;
  },
  
  

  acceptRequest: async (requestId) => {
    const response = await api.put(`/requests/${requestId}/accept`);
    return response.data;
  },

  rejectRequest: async (requestId) => {
    const response = await api.put(`/requests/${requestId}/reject`);
    return response.data;
  },

  completeRequest: async (requestId) => {
    const response = await api.post(`/requests/${requestId}/complete`);
    return response.data;
  },

  unfriendUser: async (requestId) => {
    // Unfriend/cancel an accepted request
    const response = await api.put(`/requests/${requestId}/unfriend`);
    return response.data;
  }
};