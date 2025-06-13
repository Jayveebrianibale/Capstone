import api from "../services/api";
import axios from "axios";

const InstructorService = {
  getAll: async (educationLevel = null) => {
    try {
      const params = {};
      if (educationLevel && educationLevel !== 'All') {
        params.educationLevel = educationLevel;
      }
      
      const response = await api.get("/instructors", { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
      throw error;
    }
  },
  getCount: async (educationLevel = null) => {
    try {
      const params = {};
      if (educationLevel && educationLevel !== 'All') {
        params.educationLevel = educationLevel;
      }
      
      const response = await api.get("/instructors", { params });
      return response.data.length;
    } catch (error) {
      console.error('Failed to fetch instructor count:', error);
      throw error;
    }
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
      // Log the incoming data
      console.log('Assigning programs:', {
        instructorId,
        programs
      });

      // Validate and format the programs data
      const validatedPrograms = programs.map(program => {
        // Ensure yearLevels is an array of integers
        const yearLevels = Array.isArray(program.yearLevels) 
          ? program.yearLevels.map(level => parseInt(level))
          : [parseInt(program.yearLevel)];

        // Validate year levels
        if (yearLevels.some(isNaN)) {
          throw new Error(`Invalid year level for program ${program.id}`);
        }

        return {
          id: program.id,
          yearLevels: yearLevels
        };
      });

      // Log the validated data
      console.log('Validated programs data:', validatedPrograms);

      const response = await api.post(`/instructors/${instructorId}/assign-programs`, {
        programs: validatedPrograms
      });

      // Log the response
      console.log('API Response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error in assignPrograms:', error);
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

  getInstructorsByProgramName: async (programName) => {
    try {
      const response = await api.get(`/instructors/program-name/${encodeURIComponent(programName)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructors by program name:', error);
      throw error;
    }
  },

  submitEvaluation: async (evaluationData) => {
    const token = localStorage.getItem('authToken');
    const response = await api.post(
      '/evaluations',
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

    return response.data;
  },

  getEvaluations: async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await api.get(
        '/evaluations',
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

  handleSendResult: async (instructorId, selectedComments = []) => {
    try {
      const response = await api.post(`/instructors/${instructorId}/send-result`, {
        selectedComments
      });
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  sendBulkResults: async (programCode, { instructorIds }) => {
      try {
          const response = await api.post(`/programs/${programCode}/send-bulk-results`, {
              instructorIds
          });
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
  },

  /**
   * Fetch all comments for an instructor, including the student names who left them.
   * @param {number|string} instructorId
   * @returns {Promise<Array<{comment: string, student_name: string}>>}
   */
  getInstructorCommentsWithStudentNames: async (instructorId) => {
    try {
      const response = await api.get(`/instructors/${instructorId}/comments-with-students`);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor comments with student names:', error.response?.data || error.message);
      throw error;
    }
  },

  getInstructorEvaluationResults: async (instructorId) => {
    try {
      const response = await api.get(`/instructor/${instructorId}/ratings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor evaluation results:', error.response?.data || error.message);
      throw error;
    }
  },

  removeProgram: async (instructorId, programId, yearLevel) => {
    try {
      const response = await api.delete(`/instructors/${instructorId}/programs/${programId}`, {
        params: { yearLevel }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing program:', error.response?.data || error.message);
      throw error;
    }
  },

  sendStudentEvaluationCompleteEmail: async (data) => {
    try {
      const response = await api.post('/instructors/send-student-evaluation-complete', data);
      return response.data;
    } catch (error) {
      console.error('Error sending student evaluation completion email:', error.response?.data || error.message);
      throw error;
    }
  },
};


export default InstructorService;
