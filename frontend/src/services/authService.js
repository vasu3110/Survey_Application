// src/services/authService.js
import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/current-user');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.patch('/auth/update-profile', { profileData });
    return response.data;
  }
};
