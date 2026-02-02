import api from './api';

export const skillService = {
  // ✅ Add new skill (FormData already received)
  addSkill: async (formData) => {
    const response = await api.post('/skills', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMySkills: async () => {
    const response = await api.get('/skills/my');
    return response.data;
  },
 getUserSkills: async (userId) => {
    const response = await api.get(`/skills/user/${userId}`);
    return response.data;
  },
  deleteSkill: async (skillId) => {
    const response = await api.delete(`/skills/${skillId}`);
    return response.data;
  },

  addWantedSkill: async (skillData) => {
    const response = await api.post('/skills/wanted', skillData);
    return response.data;
  },

  getMyWantedSkills: async () => {
    const response = await api.get('/skills/wanted/my');
    return response.data;
  },

  deleteWantedSkill: async (skillId) => {
    const response = await api.delete(`/skills/wanted/${skillId}`);
    return response.data;
  },

  editOfferedSkill: async (skillId, skillData) => {
    const formData = new FormData();
    Object.keys(skillData).forEach(key => {
      formData.append(key, skillData[key]);
    });

    const response = await api.put(`/skills/${skillId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  },

  editWantedSkill: async (skillId, skillData) => {
    const response = await api.put(`/skills/wanted/${skillId}`, skillData);
    return response.data;
  }
};
