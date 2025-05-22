import api from "../services/api";

<<<<<<< HEAD
const API_URL = "https://capstone-production-bf29.up.railway.app/api/questions";

// Fetch all questions
export const fetchQuestions = async () => {
  try {
    const response = await axios.get(API_URL);
=======
const QuestionsService = {
  getAll: async () => {
    const response = await api.get("/questions");
>>>>>>> Jeibii
    return response.data;
  },

  saveMultiple: async (questions) => {
    const response = await api.post("/questions", { questions });
    return response.data;
  },

  save: async (question) => {
    // Always send as { questions: [...] }
    const response = await api.post("/questions", { questions: Array.isArray(question) ? question : [question] });
    return response.data;
  },

  update: async (id, updatedQuestion) => {
    const response = await api.put(`/questions/${id}`, updatedQuestion);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/questions/${id}`);
  },

  bulkUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post("/questions/bulk-upload", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },
};

export default QuestionsService;
