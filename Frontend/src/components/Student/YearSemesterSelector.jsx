const YearSemesterSelector = ({ 
  selectedYear, setSelectedYear, 
  selectedSemester, setSelectedSemester, 
  setFormReady, fetchAssignedInstructors,
  submissionInfo
}) => {
  // Dynamically generate school years: current, next, and next+1
  const getDynamicSchoolYears = () => {
    const currentYear = new Date().getFullYear();
    // If after June, increment to next school year start
    const now = new Date();
    const startYear = now.getMonth() >= 5 ? currentYear : currentYear - 1;
    return [0, 1, 2].map(i => `${startYear + i}-${startYear + i + 1}`);
  };
  const schoolYears = getDynamicSchoolYears();
  const semesters = ['1st Semester', '2nd Semester'];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
        <div className="flex-1">
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">School Year</label>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              localStorage.setItem('selectedYear', e.target.value);
              if (e.target.value && selectedSemester) {
                fetchAssignedInstructors();
                setFormReady(true);
              }
            }}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none"
            disabled={!!selectedYear && !!selectedSemester}
          >
            <option value="">Select School Year</option>
            {schoolYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              localStorage.setItem('selectedSemester', e.target.value);
              if (selectedYear && e.target.value) {
                fetchAssignedInstructors();
                setFormReady(true);
              }
            }}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none"
            disabled={!!selectedYear && !!selectedSemester}
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default YearSemesterSelector;
