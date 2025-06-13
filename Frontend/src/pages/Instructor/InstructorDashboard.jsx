import React, { useEffect, useState } from 'react';
import bgImage from '../../assets/Login.jpg';
import AnalyticsChart from '@/contents/Instructor/AnalyticsChart';
import { EvaluationTable } from '../../contents/Instructor/EvaluationTable';
import InstructorService from '../../services/InstructorService';

function InstructorDashboard() {
  const [instructor, setInstructor] = useState(null);
  const [evaluationPeriod, setEvaluationPeriod] = useState({ schoolYear: '', semester: '' });

  const getPercentageColor = (value) => {
    if (value >= 90) return 'text-green-500 font-semibold';
    if (value >= 75) return 'text-yellow-500 font-semibold';
    return 'text-red-500 font-semibold';
  };

  const fetchEvaluationPeriod = async (instructorId) => {
    try {
      console.log('Fetching evaluation period for instructor:', instructorId);
      console.log('Instructor ID type:', typeof instructorId);
      console.log('Instructor ID value:', instructorId);
      
      const response = await InstructorService.getLatestEvaluationPeriod(instructorId);
      console.log('Evaluation period response:', response);
      
      if (response && response.school_year && response.semester) {
        console.log('Setting evaluation period with values:', {
          schoolYear: response.school_year,
          semester: response.semester
        });
        setEvaluationPeriod({
          schoolYear: response.school_year,
          semester: response.semester
        });
      } else {
        console.log('Response missing school year or semester:', response);
        setEvaluationPeriod({
          schoolYear: '',
          semester: ''
        });
      }
    } catch (error) {
      console.error('Error fetching evaluation period:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data
      });
    }
  };

  useEffect(() => {
    // Get instructor data from sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log('Full user object from sessionStorage:', user);
    console.log('All user object keys:', Object.keys(user));
    console.log('All user object values:', Object.values(user));
    
    if (user) {
      setInstructor(user);
      // Try to get the instructor ID from different possible properties
      const instructorId = user.instructor_id || user.id;
      console.log('Using instructor ID:', instructorId);
      console.log('Instructor ID type:', typeof instructorId);
      console.log('Instructor ID value:', instructorId);
      
      if (instructorId) {
        // Convert to number if it's a string
        const numericInstructorId = parseInt(instructorId, 10);
        console.log('Numeric instructor ID:', numericInstructorId);
        fetchEvaluationPeriod(numericInstructorId);
      } else {
        console.error('No instructor ID found in user object');
      }
    } else {
      console.error('No user found in sessionStorage');
    }
  }, []);

  // Add this to check the current state
  useEffect(() => {
    console.log('Current evaluation period state:', evaluationPeriod);
  }, [evaluationPeriod]);

  const currentHour = new Date().getHours();
  const greeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!instructor) {
    return <div className="p-6">Loading dashboard…</div>;
  }

  return (
    <main className="p-5 min-h-screen dark:bg-gray-900 space-y-6">
      {/* Header Banner */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-md bg-[#1F3463] p-6 sm:p-8 text-white"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight drop-shadow-md">
            {greeting()}, {instructor?.name}!
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-200">
            Here's your Evaluation Results Overview.
          </p>   
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Analytics Section */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Overall Performance Analytics
            </h2>
            <p className="text-sm sm:text-base dark:text-gray-200 whitespace-nowrap mb-2 sm:mb-0">
              School Year: {evaluationPeriod.schoolYear || 'Not available'} | Semester: {evaluationPeriod.semester || 'Not available'}
            </p>
          </div>
          <AnalyticsChart instructorId={instructor.instructor_id} getPercentageColor={getPercentageColor} />
        </div>

        {/* Evaluation Table Section */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Detailed Evaluation Results
          </h2>
          <EvaluationTable instructor={instructor} getPercentageColor={getPercentageColor} />
        </div>
      </div>
    </main>
  );
}

export default InstructorDashboard;
