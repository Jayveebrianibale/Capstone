import axios from "axios";

const API_URL = "https://capstone-production-bf29.up.railway.app/api/evaluations";

const api = axios.create({
  baseURL: API_URL,
});

const EvaluationService = {
  // ✅ Existing method
  getStudentEvaluations: async () => {
    const response = await api.get("/");
    return response.data;
  },

  // ✅ New method to get top 3 instructors
  getTopInstructors: async () => {
    const response = await axios.get("https://capstone-production-bf29.up.railway.app/api/top-instructors");
    return response.data;
  },

  // In EvaluationService.js
  getAllInstructorDistributions: async () => {
    const res = await axios.get('https://capstone-production-bf29.up.railway.app/api/instructor-distributions');
    return res.data.data;
  },

  
};

export default EvaluationService;
