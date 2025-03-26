import axios from "axios";

const API_URL = "http://localhost:8000/api/programs"; // Adjust as needed

const ProgramService = {
  getAll: async () => {
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
      console.log("Sending Data:", data);
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
      console.error("Error creating program:", error);
      throw error;
    }
  },


  
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting program:", error);
      throw error;
    }
  },
};

export default ProgramService;
