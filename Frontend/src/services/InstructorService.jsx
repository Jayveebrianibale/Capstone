import axios from "axios";

const API_URL = "http://localhost:8000/api/instructors";

const InstructorService = {
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  create: async (instructorData) => {
    const response = await axios.post(API_URL, instructorData);
    return response.data;
  },

  update: async (id, instructorData) => {
    const response = await axios.put(`${API_URL}/${id}`, instructorData);
    return response.data;
  },

  delete: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },

  assignPrograms: async (instructorId, programIds) => {
    const res = await axios.post(`${API_URL}/${instructorId}/assign-programs`, {
      program_ids: programIds,
    });
    return res.data;
  },
};

export default InstructorService;
