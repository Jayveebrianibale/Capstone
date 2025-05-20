import axios from "axios";

const API_URL = "https://capstone-production-bf29.up.railway.app/api/programs";

const ProgramService = {
  async getAll() {
    try {
      const response = await axios.get(API_URL);
      return response.data; 
    } catch (error) {
      console.error("Error fetching programs:", error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      console.log("Sending Data:", JSON.stringify(data, null, 2));
      const response = await axios.post(API_URL, data);
      console.log("Program Created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating program:", error.response?.data || error.message);
      throw {
        ...error,
        response: {
          ...error.response,
          data: error.response?.data || { message: "Failed to create program" }
        }
      };
    }
  },

  async update(id, programData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, programData);
      return response.data;
    } catch (error) {
      console.error("Error updating program:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log(`Deleting Program ID ${id}`);
      const response = await axios.delete(`${API_URL}/${id}`);
      console.log("Program Deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting program:", error.response?.data || error.message);
      throw error;
    }
  },

  getInstructorsByProgramCode: async (programCode) => {
    try {
      const response = await axios.get(`${API_URL}/${programCode}/instructors`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch instructors for ${programCode}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getYearLevels: async (programId) => {
    try {
      const response = await axios.get(`${API_URL}/${programId}/year-levels`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch year levels for program ${programId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  async getInstructorResultsByProgram(code) {
    try {
      const response = await axios.get(`${API_URL}/${code}/instructor-results`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch instructor results for ${code}:`, error.response?.data || error.message);
      throw error;
    }
  },
  
}

export default ProgramService;
