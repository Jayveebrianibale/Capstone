import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiCheckCircle, FiAlertCircle, FiFilter } from 'react-icons/fi';
import PieChart from "../../contents/Admin/Piechart";
import CompletionandPerformingInstructors from '../../contents/Admin/CompletionandPerformingInstructors';
import bgImage from "../../assets/Login.jpg";
import InstructorService from '../../services/InstructorService';
import StudentService from '../../services/StudentService';
import EvaluationService from '../../services/EvaluationService';

function ADashboard() {
  const [instructorsCount, setInstructorsCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [notSubmittedCount, setNotSubmittedCount] = useState(0);
  const [educationLevel, setEducationLevel] = useState('All');
  const [isLoading, setIsLoading] = useState({
    instructors: false,
    students: false,
    submitted: false,
    notSubmitted: false
  });
  const [showFilter, setShowFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const educationLevels = [
    { value: 'All', label: 'All' },
    { value: 'Higher Education', label: 'Higher Ed' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Junior High', label: 'Junior High' },
    { value: 'Senior High', label: 'Senior High' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentHour = new Date().getHours();
  const greeting = () => {
    if (currentHour < 12) return "Good Morning, Admin!";
    if (currentHour < 18) return "Good Afternoon, Admin!";
    return "Good Evening, Admin!";
  };

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(prev => ({...prev, instructors: true, students: true}));
        const [instructors, students] = await Promise.all([
          InstructorService.getAll(),
          StudentService.getAll()
        ]);
        setInstructorsCount(instructors.length);
        setStudentsCount(students.length);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(prev => ({...prev, instructors: false, students: false}));
      }
    };

    fetchInitialData();
    fetchEvaluationStats('All'); // Initial load for evaluation stats
  }, []);

  // Fetch evaluation stats separately
  const fetchEvaluationStats = async (level) => {
    try {
      setIsLoading(prev => ({...prev, submitted: true, notSubmitted: true}));
      const evaluationStats = await EvaluationService.getOverallEvaluationSubmissionStats(
        level === 'All' ? null : level
      );
      setSubmittedCount(evaluationStats.submitted);
      setNotSubmittedCount(evaluationStats.not_submitted);
    } catch (error) {
      console.error("Error fetching evaluation stats:", error);
    } finally {
      setIsLoading(prev => ({...prev, submitted: false, notSubmitted: false}));
    }
  };

  const handleEducationLevelChange = (e) => {
    const newLevel = e.target.value;
    setEducationLevel(newLevel);
    setShowFilter(false);
    fetchEvaluationStats(newLevel);
  };

  const stats = [
    { 
      id: 'students',
      title: 'Students', 
      count: studentsCount, 
      color: 'text-[#2196f3]', 
      icon: <FiUsers size={isMobile ? 20 : 28} />,
      loading: isLoading.students
    },
    { 
      id: 'instructors',
      title: 'Instructors', 
      count: instructorsCount, 
      color: 'text-[#4caf50]', 
      icon: <FiUserCheck size={isMobile ? 20 : 28} />,
      loading: isLoading.instructors
    },
    { 
      id: 'submitted',
      title: 'Submitted', 
      count: submittedCount, 
      color: 'text-[#9c27b0]', 
      icon: <FiCheckCircle size={isMobile ? 20 : 28} />,
      filterable: true,
      loading: isLoading.submitted,
      filterValue: educationLevel,
      onFilterChange: handleEducationLevelChange,
      showFilter: showFilter,
      setShowFilter: setShowFilter
    },
    { 
      id: 'notSubmitted',
      title: 'Not Submitted', 
      count: notSubmittedCount, 
      color: 'text-[#f44336]', 
      icon: <FiAlertCircle size={isMobile ? 20 : 28} />,
      loading: isLoading.notSubmitted
    },
  ];

  return (
    <main className="p-4 sm:p-6 min-h-screen dark:bg-gray-900 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden shadow-md bg-[#1F3463] p-4 sm:p-6 text-white"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight drop-shadow-md">
            {greeting()}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-200">
            Here's an overview of today's system stats.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1 flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <PieChart educationLevel={educationLevel} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-2 gap-4 sm:gap-6">
          {stats.map(({ 
            id, 
            title, 
            count, 
            color, 
            icon, 
            filterable, 
            loading,
            filterValue,
            onFilterChange,
            showFilter: cardShowFilter,
            setShowFilter: setCardShowFilter
          }) => (
            <div
              key={id}
              className="relative bg-gray-50 dark:bg-gray-800 shadow-md rounded-xl p-4 sm:p-6 flex flex-col justify-center items-center border border-gray-200 dark:border-gray-700"
            >
              {filterable && (
                <div className={`absolute ${isMobile ? 'top-1 right-1' : 'top-2 right-2'}`}>
                  <div className="relative">
                    <button 
                      onClick={() => setCardShowFilter(prev => !prev)}
                      className={`flex items-center p-1 rounded-md ${
                        isMobile ? 'text-xs bg-gray-100 dark:bg-gray-700' : 'text-sm bg-gray-100 dark:bg-gray-700'
                      } hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-100`}
                    >
                      <FiFilter size={isMobile ? 12 : 14} className="mr-1" />
                      {filterValue === 'All' ? 'All' : educationLevels.find(l => l.value === filterValue)?.label}
                    </button>

                    {cardShowFilter && (
                      <div className={`absolute right-0 mt-1 z-50 ${
                        isMobile ? 'w-28' : 'w-36'
                      } bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600`}>
                        <select
                          value={filterValue}
                          onChange={onFilterChange}
                          className="block w-full px-2 py-1 text-xs sm:text-sm border-0 rounded-md dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                          size={isMobile ? 3 : undefined}
                        >
                          {educationLevels.map((level) => (
                            <option 
                              key={level.value} 
                              value={level.value}
                              className="dark:bg-gray-700 dark:text-white"
                            >
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <>
                  <div className={`p-2 sm:p-3 rounded-full bg-gray-200 dark:bg-gray-700 mb-2 sm:mb-3 ${color}`}>
                    {icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 text-center">
                    {title}
                  </h3>
                  <p className={`text-2xl sm:text-3xl font-bold ${color}`}>{count}</p>
                  {filterable && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      {filterValue === 'All' ? 'All levels' : filterValue}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <CompletionandPerformingInstructors educationLevel={educationLevel} />
    </main>
  );
}

export default ADashboard;