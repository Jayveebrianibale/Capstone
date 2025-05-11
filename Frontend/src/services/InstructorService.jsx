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

  submitAllEvaluations: async (payload) => {
  const token = localStorage.getItem('authToken');
  const response = await axios.post(
    'http://localhost:8000/api/evaluations/submit-all',
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
        'http://localhost:8000/api/evaluations',
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
};

export default InstructorService;
