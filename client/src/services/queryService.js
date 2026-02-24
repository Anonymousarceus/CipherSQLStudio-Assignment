import api from './api';

const queryService = {
  execute: async (queryData) => {
    const response = await api.post('/queries/execute', queryData);
    return response.data;
  },

  validate: async (query) => {
    const response = await api.post('/queries/validate', { query });
    return response.data;
  },

  getHistory: async (assignmentId, params = {}) => {
    const response = await api.get(`/queries/history/${assignmentId}`, { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/queries/stats');
    return response.data;
  }
};

export default queryService;
