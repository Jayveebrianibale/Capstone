<<<<<<< HEAD
import axios from 'axios';

const API_URL = 'https://capstone-production-bf29.up.railway.app/api/students';
=======
import api from '../services/api';
>>>>>>> Jeibii

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
