import api from "../services/api";

const EvaluationService = {
  getStudentEvaluations: async () => {
    const res = await api.get("/evaluations");
    return res.data;
  },

  getTopInstructors: async () => {
    const res = await api.get("/top-instructors");
    return res.data;
  },

  /**
   * Fetch instructor distributions, optionally filtered by education level
   * @param {string|null} educationLevel
   * @returns {Promise<Array>}
   */
  getAllInstructorDistributions: async (educationLevel = null) => {
    const params = {};
    if (educationLevel && educationLevel !== 'All') {
      params.educationLevel = educationLevel;
    }

    const res = await api.get("/instructor-distributions", { params });
    return res.data.data;
  },

  getEvaluationSubmissionStats: async (schoolYear, semester) => {
    const params = {};
    if (schoolYear) params.school_year = schoolYear;
    if (semester) params.semester = semester;

    const res = await api.get("/evaluation-submission-stats", { params });
    return res.data.data;
  },

  getOverallEvaluationSubmissionStats: async (educationLevel = null) => {
    const params = {};
    if (educationLevel && educationLevel !== 'All') {
      params.educationLevel = educationLevel;
    }
  
    const res = await api.get("/evaluation-submission-overall", { params });
    return res.data;
  },

  getProgramEvaluationStats: async () => {
    const res = await api.get("/program-evaluation-stats");
    return res.data.data;
  },

  getCourseEvaluationSubmissionCounts: async () => {
    const res = await api.get("/course-evaluation-submission-counts");
    return res.data.data;
  },
};

export default EvaluationService;
