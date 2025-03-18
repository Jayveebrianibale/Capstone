import axios from "axios";

const API_URL = "http://localhost:8000/api/instructors";

export const fetchInstructors = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw error;
  }
};

export const saveInstructor = async (instructor) => {
  try {
    console.log("Saving instructor:", instructor);
    const response = await axios.post(API_URL, instructor);
    return response.data;
  } catch (error) {
    console.error("Error saving instructor:", error.response?.data);
    throw error;
  }
};

export const updateInstructor = async (id, instructor) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, instructor);
    return response.data;
  } catch (error) {
    console.error("Error updating instructor:", error);
    throw error;
  }
};

export const deleteInstructor = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting instructor:", error);
    throw error;
  }
};
