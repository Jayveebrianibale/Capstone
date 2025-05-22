import api from "../services/api";

const QuestionsService = {
  getAll: async () => {
    const response = await api.get("/questions");
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
