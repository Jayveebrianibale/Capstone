<<<<<<< HEAD
import axios from "axios";

const API_URL = "https://capstone-production-bf29.up.railway.app/api/evaluations";

const api = axios.create({
  baseURL: API_URL,
});
=======
import api from "../services/api";
>>>>>>> Jeibii

const EvaluationService = {
  getStudentEvaluations: async () => {
    const res = await api.get("/evaluations");
    return res.data;
  },

  getTopInstructors: async () => {
<<<<<<< HEAD
    const response = await axios.get("https://capstone-production-bf29.up.railway.app/api/top-instructors");
    return response.data;
=======
    const res = await api.get("/top-instructors");
    return res.data;
>>>>>>> Jeibii
  },

  getAllInstructorDistributions: async () => {
<<<<<<< HEAD
    const res = await axios.get('https://capstone-production-bf29.up.railway.app/api/instructor-distributions');
=======
    const res = await api.get("/instructor-distributions");
>>>>>>> Jeibii
    return res.data.data;
  },
};

export default EvaluationService;
