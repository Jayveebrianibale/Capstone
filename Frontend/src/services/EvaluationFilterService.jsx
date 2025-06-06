import api from "../services/api";

class EvaluationFilterService {
  static async getFilteredResults(programCode, filters = {}) {
    try {
      const response = await api.get(`/programs/${programCode}/filter`, {
        params: {
          school_year: filters.schoolYear,
          semester: filters.semester,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered results:", error);
      throw error;
    }
  }

  static getSchoolYearOptions() {
    const currentYear = new Date().getFullYear();
    return [
      `${currentYear - 1}-${currentYear}`,
      `${currentYear}-${currentYear + 1}`,
      `${currentYear + 1}-${currentYear + 2}`,
    ];
  }

  static getSemesterOptions() {
    return ["1st Semester", "2nd Semester"];
  }
}

export default EvaluationFilterService;
