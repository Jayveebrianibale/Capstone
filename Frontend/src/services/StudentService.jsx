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
  }
};

export default StudentService;
