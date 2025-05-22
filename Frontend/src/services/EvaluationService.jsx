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
};

export default EvaluationService;
