import axios from "axios";

const API_URL = "http://localhost:8000/api/evaluations";

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
    const response = await axios.get("http://localhost:8000/api/top-instructors");
    return response.data;
  },

  // In EvaluationService.js
  getTopInstructorDistributions: async () => {
    const res = await axios.get('http://localhost:8000/api/top-instructors/distribution');
    return res.data.data;
  },

  
};

export default EvaluationService;
