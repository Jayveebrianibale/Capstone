// Helper function to get ordinal suffix
const getOrdinalSuffix = (number) => {
  const j = number % 10;
  const k = number % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

// Format grade level text based on program category
export const formatGradeLevelText = (yearLevel, category) => {
  switch (category) {
    case 'Higher Education':
      return `${yearLevel}${getOrdinalSuffix(yearLevel)} Year`;
    case 'Intermediate':
    case 'Junior High':
    case 'Senior High':
      return `Grade ${yearLevel}`;
    default:
      return `Grade ${yearLevel}`;
  }
};

// Validate grade level based on program category
export const validateGradeLevel = (yearLevel, category) => {
  const level = typeof yearLevel === 'number' ? yearLevel : parseInt(yearLevel, 10);
  
  switch (category) {
    case 'Junior High':
    case 'JHS':
      return level >= 7 && level <= 10;
    case 'Intermediate':
    case 'INT':
      return level >= 4 && level <= 6;
    case 'Senior High':
    case 'SHS':
      return level >= 11 && level <= 12;
    case 'Higher Education':
    case 'HE':
      return level >= 1 && level <= 4;
    default:
      return false;
  }
};

// Get year level options based on program category
export const getYearLevelOptions = (category, programName = '') => {
  switch (category) {
    case 'Junior High':
    case 'JHS':
      return [
        { value: 7, label: "Grade 7" },
        { value: 8, label: "Grade 8" },
        { value: 9, label: "Grade 9" },
        { value: 10, label: "Grade 10" },
      ];
    case 'Intermediate':
    case 'INT':
      return [
        { value: 4, label: "Grade 4" },
        { value: 5, label: "Grade 5" },
        { value: 6, label: "Grade 6" },
      ];
    case 'Senior High':
    case 'SHS':
      return [
        { value: 11, label: "Grade 11" },
        { value: 12, label: "Grade 12" },
      ];
    case 'Higher Education':
    case 'HE':
      if (programName.toLowerCase() === "associate in computer technology") {
        return [
          { value: 1, label: "1st Year" },
          { value: 2, label: "2nd Year" },
        ];
      }
      return [
        { value: 1, label: "1st Year" },
        { value: 2, label: "2nd Year" },
        { value: 3, label: "3rd Year" },
        { value: 4, label: "4th Year" },
      ];
    default:
      return [];
  }
}; 