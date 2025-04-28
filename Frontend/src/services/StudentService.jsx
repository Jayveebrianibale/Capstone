import axios from 'axios';

const API_URL = 'http://localhost:8000/api/students';

const StudentService = {
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw error;
    }
  }
};

export default StudentService;
