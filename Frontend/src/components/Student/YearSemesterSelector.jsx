import React, { useEffect } from 'react';

const YearSemesterSelector = ({
  selectedYear, setSelectedYear,
  selectedSemester, setSelectedSemester,
  setFormReady, fetchAssignedInstructors,
  submissionInfo
}) => {
  const getDynamicSchoolYears = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11 (Jan-Dec)
    
    // Define your academic year start months (June=5, July=6, August=7, September=8)
    const academicStartMonths = [6, 7, 8]; // July, August, September
    const academicEndMonths = [5, 6]; // June, July
    
    // Determine if current month is in the start period
    const isStartMonth = academicStartMonths.includes(currentMonth);
    const isEndMonth = academicEndMonths.includes(currentMonth);
    
    let startYear = currentYear;
    let endYear = currentYear + 1;
    
    if (isStartMonth) {
      // If current month is a start month, academic year starts this year
      startYear = currentYear;
      endYear = currentYear + 1;
    } else if (isEndMonth) {
      // If current month is an end month, academic year ends this year
      startYear = currentYear - 1;
      endYear = currentYear;
    } else if (currentMonth < Math.min(...academicStartMonths)) {
      // Before academic year starts
      startYear = currentYear - 1;
      endYear = currentYear;
    } else {
      // After start months but before end months (in the middle of academic year)
      startYear = currentYear;
      endYear = currentYear + 1;
    }

    // Return current and next academic year
    return [
      `${startYear}-${endYear}`,
      `${startYear + 1}-${endYear + 1}`
    ];
  };

  const schoolYears = getDynamicSchoolYears();
  const semesters = ['1st Semester', '2nd Semester'];

  useEffect(() => {
    if (selectedYear) {
      return;
    }

    if (schoolYears.length > 0) {
      const defaultYear = schoolYears[0];
      setSelectedYear(defaultYear);
      localStorage.setItem('selectedYear', defaultYear); // Keep localStorage consistent

      // If a semester is already selected, this new default year might complete the pair
      if (defaultYear && selectedSemester) {
        fetchAssignedInstructors();
        setFormReady(true);
      }
    }
  }, [schoolYears, selectedYear, setSelectedYear, selectedSemester, fetchAssignedInstructors, setFormReady]);

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
            disabled={true}
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