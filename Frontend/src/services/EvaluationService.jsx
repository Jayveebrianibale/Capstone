import axios from "axios";

const API_URL = "http://localhost:8000/api/evaluations";

const api = axios.create({
  baseURL: API_URL,
});

const EvaluationService = {
  getStudentEvaluations: async () => {
    const response = await api.get("/");
    return response.data;
  }
};

export default EvaluationService;
