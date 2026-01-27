import api from './api';

export const skillService = {
  // Add new skill
  addSkill: async (skillData) => {
    const formData = new FormData();
    Object.keys(skillData).forEach(key => {
      formData.append(key, skillData[key]);
    });
    
    const response = await api.post('/skills', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get my skills
  getMySkills: async () => {
    const response = await api.get('/skills/my');
    return response.data;
  },

  // Get user skills by ID
  getUserSkills: async (userId) => {
    const response = await api.get(`/skills/user/${userId}`);
    return response.data;
  },

  // Delete skill
  deleteSkill: async (skillId) => {
    const response = await api.delete(`/skills/${skillId}`);
    return response.data;
  },

  // Add wanted skill
  addWantedSkill: async (skillData) => {
    const response = await api.post('/skills/wanted', skillData);
    return response.data;
  },

  // Get my wanted skills
  getMyWantedSkills: async () => {
    const response = await api.get('/skills/wanted/my');
    return response.data;
  },
  // Delete wanted skill
  deleteWantedSkill: async (skillId) => {
    const response = await api.delete(`/skills/wanted/${skillId}`);
    return response.data;
  },
};