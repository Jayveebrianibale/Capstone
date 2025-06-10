import React, { useEffect, useState } from 'react';
import bgImage from '../../assets/Login.jpg';
import AnalyticsChart from '@/contents/Instructor/AnalyticsChart';
import { EvaluationTable } from '../../contents/Instructor/EvaluationTable';

function InstructorDashboard() {
  const [instructor, setInstructor] = useState(null);

  const getPercentageColor = (value) => {
    if (value >= 90) return 'text-green-500 font-semibold';
    if (value >= 75) return 'text-yellow-500 font-semibold';
    return 'text-red-500 font-semibold';
  };

  useEffect(() => {
    // Get instructor data from sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      setInstructor(user);
    }
  }, []);

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
            {greeting()}, {instructor.name}!
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
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Overall Performance Analytics
          </h2>
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
