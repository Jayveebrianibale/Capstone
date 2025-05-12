import axios from "axios";

const API_URL = "http://localhost:8000/api/grade-levels";

const GradeLevelService = {
  // Get all grade levels
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching grade levels:", error);
      throw error;
    }
  },

  // Create a new grade level
  create: async (data) => {
    try {
      console.log("Creating Grade Level:", JSON.stringify(data, null, 2));
      const response = await axios.post(API_URL, data);
      console.log("Grade Level Created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating grade level:", error.response?.data || error.message);
      throw error;
    }
  },

  // Update a grade level
  update: async (id, data) => {
    try {
      console.log(`Updating Grade Level ${id}:`, JSON.stringify(data, null, 2));
      const response = await axios.put(`${API_URL}/${id}`, data);
      console.log("Grade Level Updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating grade level:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a grade level
  delete: async (id) => {
    try {
      console.log(`Deleting Grade Level ${id}`);
      const response = await axios.delete(`${API_URL}/${id}`);
      console.log("Grade Level Deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting grade level:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get grade levels by program
  getByProgram: async (programId) => {
    try {
      const response = await axios.get(`${API_URL}?program_id=${programId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching grade levels for program:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get grade levels by category (SHS, JHS, Intermediate)
  getByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_URL}/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching grade levels for ${category}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Get grade levels with their programs
  getWithPrograms: async () => {
    try {
      const response = await axios.get(`${API_URL}/with-programs`);
      return response.data;
    } catch (error) {
      console.error("Error fetching grade levels with programs:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get grade levels by strand (for SHS)
  getByStrand: async (strand) => {
    try {
      const response = await axios.get(`${API_URL}/strand/${strand}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching grade levels for strand ${strand}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Get grade levels with instructor assignments
  getWithInstructors: async (programId) => {
    try {
      const response = await axios.get(`${API_URL}/${programId}/instructors`);
      return response.data;
    } catch (error) {
      console.error("Error fetching grade levels with instructors:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get grade levels with student counts
  getWithStudentCounts: async (programId) => {
    try {
      const response = await axios.get(`${API_URL}/${programId}/student-counts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching grade levels with student counts:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get grade levels with evaluation statistics
  getWithEvaluationStats: async (programId) => {
    try {
      const response = await axios.get(`${API_URL}/${programId}/evaluation-stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching grade levels with evaluation stats:", error.response?.data || error.message);
      throw error;
    }
  },

  // Bulk create grade levels
  bulkCreate: async (gradeLevels) => {
    try {
      console.log("Bulk Creating Grade Levels:", JSON.stringify(gradeLevels, null, 2));
      const response = await axios.post(`${API_URL}/bulk`, { gradeLevels });
      console.log("Grade Levels Created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error bulk creating grade levels:", error.response?.data || error.message);
      throw error;
    }
  },

  // Bulk update grade levels
  bulkUpdate: async (updates) => {
    try {
      console.log("Bulk Updating Grade Levels:", JSON.stringify(updates, null, 2));
      const response = await axios.put(`${API_URL}/bulk`, { updates });
      console.log("Grade Levels Updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error bulk updating grade levels:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default GradeLevelService; 