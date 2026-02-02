import api from "./api";

export const getMyProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};


 export const deleteProfileImage = async()=>{
  const res = await api.delete("/users/profile-image");
  return res.data;
 }