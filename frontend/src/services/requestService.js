// import api from './api';
// export const requestService = {
//   // Send a GET request

//   sendRequest: async (data) => {
//   return api.post("/requests", data);
// },

//   getMyRequests: async () => {
//     const res = await api.get("/requests");
//     return res.data; // ✅ yahin se { success, count, requests }
//   },
//   acceptRequest: async (requestId) => {
//     const response = await api.put(`/requests/${requestId}/accept`);
//     return response.data;
//   },
//   rejectRequest: async (requestId) => {
//     const response = await api.put(`/requests/${requestId}/reject`);
//     return response.data;
//   },

//   completeRequest: async (requestId) => {
//     const response = await api.post(`/requests/${requestId}/complete`);
//     return response.data;
//   },
//    withdrawRequest: async (requestId) => {
//     const res = await api.delete(`/requests/withdraw/${requestId}`);
//     return res.data;
//   },
// // services/requestService.js mein ye function add karein

//   deleteRequest: async (requestId) => {
//     try {
//       const response = await api.delete(`/requests/${requestId}`, {
//         headers: { 
//           Authorization: `Bearer ${localStorage.getItem('token')}` 
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },


// }
import api from './api';

export const requestService = {
  sendRequest: async (data) => {
    return api.post("/requests", data);
  },

  getMyRequests: async () => {
    const res = await api.get("/requests");
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
  }
};