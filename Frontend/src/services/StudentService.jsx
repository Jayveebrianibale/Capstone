import axios from 'axios';

const API_URL = 'https://capstone-production-bf29.up.railway.app/api/students';

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
