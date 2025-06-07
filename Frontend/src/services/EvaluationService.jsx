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

  /**
   * Fetch instructor distributions, optionally filtered by education level
   * @param {string|null} educationLevel
   * @returns {Promise<Array>}
   */
  getAllInstructorDistributions: async (educationLevel = null) => {
    const params = {};
    if (educationLevel && educationLevel !== 'All') {
      params.educationLevel = educationLevel;
    }

    const res = await api.get("/instructor-distributions", { params });
    return res.data.data;
  },

  getEvaluationSubmissionStats: async (schoolYear, semester) => {
    const params = {};
    if (schoolYear) params.school_year = schoolYear;
    if (semester) params.semester = semester;

    const res = await api.get("/evaluation-submission-stats", { params });
    return res.data.data;
  },

  getOverallEvaluationSubmissionStats: async (educationLevel = null) => {
    const params = {};
    if (educationLevel && educationLevel !== 'All') {
      params.educationLevel = educationLevel;
    }
  
    const res = await api.get("/evaluation-submission-overall", { params });
    return res.data;
  },

  getProgramEvaluationStats: async () => {
    const res = await api.get("/program-evaluation-stats");
    return res.data.data;
  },

  getCourseEvaluationSubmissionCounts: async () => {
    const res = await api.get("/course-evaluation-submission-counts");
    return res.data.data;
  },

   /**
   * Export instructor evaluation results as PDF
   * @returns {Promise} Axios response with PDF blob
   */
   exportInstructorResultsPdf: async () => {
    try {
      const response = await api.get("/instructors/export/pdf", {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      return response;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  },

  /**
   * Export instructor evaluation results as CSV
   * @returns {Promise} Axios response with CSV blob
   */
  exportInstructorResultsCsv: async () => {
    try {
      const response = await api.get("/instructors/export/csv", {
        responseType: 'blob',
        headers: {
          'Accept': 'text/csv'
        }
      });
      return response;
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  },

  /**
   * Helper function to download the exported file
   * @param {Blob} blob - File blob from response
   * @param {string} filename - Default filename for download
   */
  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
};

export default EvaluationService;
