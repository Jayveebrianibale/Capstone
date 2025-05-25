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

  getAllInstructorDistributions: async () => {
    const res = await api.get("/instructor-distributions");
    return res.data.data;
  },

  getEvaluationSubmissionStats: async (schoolYear, semester) => {
    const params = {};
    if (schoolYear) params.school_year = schoolYear;
    if (semester) params.semester = semester;
  
    const res = await api.get("/evaluation-submission-stats", { params });
    return res.data.data;
  },

  getOverallEvaluationSubmissionStats: async () => {
    const res = await api.get("/evaluation-submission-overall");
    return res.data;
  },
  
};

export default EvaluationService;
