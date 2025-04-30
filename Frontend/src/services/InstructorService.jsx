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

  assignPrograms: async (instructorId, programs) => {
    const res = await axios.post(`${API_URL}/${instructorId}/assign-programs`, {
      programs: programs,
    });
    return res.data;
  },
  
  getInstructorsByProgramAndYear: async (programId, yearLevel) => {
    try {
      const response = await axios.get(`${API_URL}/${programId}/${yearLevel}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  },

  submitEvaluation: async (evaluationData) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      'http://localhost:8000/api/evaluations',
      evaluationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  },

  checkIfEvaluated: async (instructorId) => {
    try {
      const response = await axios.get(`/api/check-evaluation/${instructorId}`);
      return response.data.message;
    } catch (error) {
      throw new Error('Error checking evaluation status');
    }
  }
};

export default InstructorService;
