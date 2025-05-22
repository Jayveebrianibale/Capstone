<<<<<<< HEAD
import axios from "axios";

const API_URL = "https://capstone-production-bf29.up.railway.app/api/instructors";
=======
import api from "../services/api";
>>>>>>> Jeibii

const InstructorService = {
  getAll: async () => {
    const response = await api.get("/instructors");
    return response.data;
  },

  create: async (instructorData) => {
    const response = await api.post("/instructors", instructorData);
    return response.data;
  },

  update: async (id, instructorData) => {
    const response = await api.put(`/instructors/${id}`, instructorData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/instructors/${id}`);
  },

  assignPrograms: async (instructorId, programs) => {
    try {
      const validatedPrograms = programs.map(program => ({
        ...program,
        yearLevel: parseInt(program.yearLevel, 10)
      }));

      const response = await api.post(`/instructors/${instructorId}/assign-programs`, {
        programs: validatedPrograms
      });

      return response.data;
    } catch (error) {
      console.error('Error assigning programs:', error.response?.data || error.message);
      throw error;
    }
  },

  getInstructorsByProgramAndYear: async (programId, yearLevel) => {
    try {
      const response = await api.get(`/instructors/program/${programId}/year/${yearLevel}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  },

  submitEvaluation: async (evaluationData) => {
    const token = localStorage.getItem('authToken');
<<<<<<< HEAD
    const response = await axios.post(
      'https://capstone-production-bf29.up.railway.app/api/evaluations',
=======
    const response = await api.post(
      '/evaluations',
>>>>>>> Jeibii
      evaluationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  },

  submitAllEvaluations: async (payload) => {
<<<<<<< HEAD
  const token = localStorage.getItem('authToken');
  const response = await axios.post(
    'https://capstone-production-bf29.up.railway.app/api/evaluations/submit-all',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
=======
    const token = localStorage.getItem('authToken');
    const response = await api.post(
      '/evaluations/submit-all',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
>>>>>>> Jeibii

    return response.data;
  },

  getEvaluations: async () => {
    const token = localStorage.getItem('authToken');
    try {
<<<<<<< HEAD
      const response = await axios.get(
        'https://capstone-production-bf29.up.railway.app/api/evaluations',
=======
      const response = await api.get(
        '/evaluations',
>>>>>>> Jeibii
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      throw error;
    }
  },

  handleSendResult: async (instructorId) => {
    try {
<<<<<<< HEAD
      const response = await axios.post(
        `https://capstone-production-bf29.up.railway.app/api/instructors/${instructorId}/send-result`
      );
=======
      const response = await api.post(`/instructors/${instructorId}/send-result`);
>>>>>>> Jeibii
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  checkProgramAssignment: async (instructorId, programId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.post(
        `/instructors/${instructorId}/check-assignment`,
        { program_id: programId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  fetchAssignedPrograms: async (instructorId) => {
    try {
      const response = await api.get(`/instructors/${instructorId}/programs`);
      if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
        throw new Error('Server returned HTML instead of JSON');
      }
      return response.data.programs || response.data;
    } catch (error) {
      console.error("Error fetching assigned programs:", {
        error,
        response: error.response?.data
      });
      throw error;
    }
  },

  bulkUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await api.post(`/instructors/bulk-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Bulk upload failed' };
    }
  }
};

export default InstructorService;
