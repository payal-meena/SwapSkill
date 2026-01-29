import api from './api';
export  const requestService ={
    // Send a GET request
    sendRequest : async (data) => {
  return api.post("/requests", data);
},

getMyRequests : async () => {
  const res = await api.get("/requests");
  return res.data; // ✅ yahin se { success, count, requests }
},
acceptRequest : async (requestId) => {
  const response = await api.post(`/requests/${requestId}/accept`);
  return response.data;},
rejectRequest : async (requestId) => {
  const response = await api.post(`/requests/${requestId}/reject`);
  return response.data;},

  completeRequest : async (requestId) => {
    const response = await api.post(`/requests/${requestId}/complete`);
    return response.data;}

}