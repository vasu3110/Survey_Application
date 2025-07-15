// src/services/surveyService.js
import api from './api';

export const surveyService = {
  getAllSurveys: async () => {
    const response = await api.get('/surveys');
    return response.data;
  },

  getSurveyByType: async (formType) => {
    const response = await api.get(`/surveys/${formType}`);
    return response.data;
  },

  createSurvey: async (surveyData) => {
    const response = await api.post('/surveys/create', surveyData);
    return response.data;
  }
};
