import api from './api';

const hintService = {
  getInitialHint: async (assignmentId) => {
    const response = await api.get(`/hints/${assignmentId}`);
    return response.data;
  },

  generateHint: async (hintData) => {
    const response = await api.post('/hints/generate', hintData);
    return response.data;
  }
};

export default hintService;
