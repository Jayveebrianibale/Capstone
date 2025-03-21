import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/questions";

// Fetch all questions
export const fetchQuestions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

// Save multiple questions
export const saveQuestions = async (questions) => {
  try {
    const response = await axios.post(API_URL, { questions });
    return response.data;
  } catch (error) {
    console.error("Error saving questions:", error);
    throw error;
  }
};

// Update a question
export const updateQuestion = async (id, updatedQuestion) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedQuestion);
    return response.data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

// Delete a question
export const deleteQuestion = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};
