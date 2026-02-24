import api from './api';

const assignmentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/assignments', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/assignments/categories');
    return response.data;
  }
};

export default assignmentService;
