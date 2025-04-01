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
      return axios.put(`${API_URL}/${id}`, programData);
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
  }
};

export default ProgramService;