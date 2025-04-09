import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/programs";

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
      throw error;
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
      const response = await axios.get(`/api/programs/${programCode}/instructors`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch instructors for ${programCode}`);
    }
}
}

export default ProgramService;
