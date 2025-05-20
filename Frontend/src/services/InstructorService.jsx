import axios from "axios";

const API_URL = "https://capstone-production-bf29.up.railway.app/api/instructors";

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
    try {
      console.log('Sending programs data:', {
        instructorId,
        programs
      });

      const validatedPrograms = programs.map(program => ({
        ...program,
        yearLevel: parseInt(program.yearLevel, 10)
      }));

      const response = await axios.post(`${API_URL}/${instructorId}/assign-programs`, {
        programs: validatedPrograms
      });

      console.log('Program assignment response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error assigning programs:', error.response?.data || error.message);
      throw error;
    }
  },
  
  getInstructorsByProgramAndYear: async (programId, yearLevel) => {
    try {
      const response = await axios.get(`${API_URL}/program/${programId}/year/${yearLevel}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  },

  submitEvaluation: async (evaluationData) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      'https://capstone-production-bf29.up.railway.app/api/evaluations',
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

  return response.data;
},

  getEvaluations: async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(
        'https://capstone-production-bf29.up.railway.app/api/evaluations',
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
      const response = await axios.post(
        `https://capstone-production-bf29.up.railway.app/api/instructors/${instructorId}/send-result`
      );
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  checkProgramAssignment: async (instructorId, programId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_URL}/${instructorId}/check-assignment`,
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
      const response = await axios.get(`${API_URL}/${instructorId}/programs`);
      // Check if response is HTML (indicating an error)
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
  
};

export default InstructorService;
