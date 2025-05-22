<<<<<<< HEAD
import axios from "axios";

const API_URL = "https://capstone-production-bf29.up.railway.app/api/grade-levels";
=======
import api from '../services/api';
>>>>>>> Jeibii

const GradeLevelService = {
  // Get all grade levels
  getAll: async () => {
    try {
      const response = await api.get('/grade-levels');
      return response.data;
    } catch (error) {
      console.error('Error fetching grade levels:', error);
      throw error;
    }
  },

  // Create a new grade level
  create: async (data) => {
    try {
      console.log('Creating Grade Level:', JSON.stringify(data, null, 2));
      const response = await api.post('/grade-levels', data);
      console.log('Grade Level Created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating grade level:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update a grade level
  update: async (id, data) => {
    try {
      console.log(`Updating Grade Level ${id}:`, JSON.stringify(data, null, 2));
      const response = await api.put(`/grade-levels/${id}`, data);
      console.log('Grade Level Updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating grade level:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a grade level
  delete: async (id) => {
    try {
      console.log(`Deleting Grade Level ${id}`);
      const response = await api.delete(`/grade-levels/${id}`);
      console.log('Grade Level Deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting grade level:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default GradeLevelService;
