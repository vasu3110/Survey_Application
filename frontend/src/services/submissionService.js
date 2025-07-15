// src/services/submissionService.js
import api from './api';

export const submissionService = {
  createSubmission: async (submissionData) => {
    const response = await api.post('/submissions/create', submissionData);
    return response.data;
  },

  getSubmissions: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/submissions?${params}`);
    return response.data;
  },

  getMySubmissions: async () => {
    const response = await api.get('/submissions/my-submissions');
    return response.data;
  },

  updateSubmissionStatus: async (submissionId, status) => {
    const response = await api.patch(`/submissions/${submissionId}/status`, { status });
    return response.data;
  },

  getSubmissionById: async (submissionId) => {
    const response = await api.get(`/submissions/${submissionId}`);
    return response.data;
  }
};
