import api from '../services/api';

const StudentService = {
  getAll: async () => {
    try {
      const response = await api.get('/students');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw error;
    }
  },

  getCount: async () => {
    try {
      const response = await api.get('/students');
      return response.data.length;
    } catch (error) {
      console.error('Failed to fetch student count:', error);
      throw error;
    }
  }
};

export default StudentService;
