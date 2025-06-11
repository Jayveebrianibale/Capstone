import api from "../services/api";

const SectionService = {
  // Get all sections with optional filters
  getAll: async (filters = {}) => {
    const response = await api.get("/sections", { params: filters });
    return response.data;
  },

  // Get sections for a specific grade level and category
  getByGradeAndCategory: async (gradeLevel, category) => {
    const response = await api.get("/sections", {
      params: {
        grade_level: gradeLevel,
        category: category
      }
    });
    return response.data;
  },

  // Create a new section
  create: async (sectionData) => {
    const response = await api.post("/sections", sectionData);
    return response.data;
  },

  // Update an existing section
  update: async (id, sectionData) => {
    const response = await api.put(`/sections/${id}`, sectionData);
    return response.data;
  },

  // Delete a section
  delete: async (id) => {
    const response = await api.delete(`/sections/${id}`);
    return response.data;
  },

  // Assign section to an instructor
  assignToInstructor: async (instructorId, sectionId) => {
    const response = await api.post(`/sections/${sectionId}/instructors`, {
      instructor_id: instructorId
    });
    return response.data;
  },

  // Remove section assignment from an instructor
  removeFromInstructor: async (instructorId, sectionId) => {
    const response = await api.delete(`/sections/${sectionId}/instructors/${instructorId}`);
    return response.data;
  },

  // Get instructors for a specific section
  getInstructors: async (sectionId) => {
    const response = await api.get(`/sections/${sectionId}/instructors`);
    return response.data;
  }
};

export default SectionService; 