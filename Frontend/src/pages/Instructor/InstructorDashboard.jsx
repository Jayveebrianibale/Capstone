import React, { useEffect, useState } from 'react';
import bgImage from '../../assets/Login.jpg';
import { AnalyticsChart } from '../../contents/Instructor/AnalyticsChart';
import { EvaluationTable } from '../../contents/Instructor/EvaluationTable';

function InstructorDashboard() {
  const [instructorId, setInstructorId] = useState(null);
  const [programCode, setProgramCode] = useState(null);

  useEffect(() => {
    // Always get the latest user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setInstructorId(user.id || user.email || user.name);
      if (user.programCode) setProgramCode(user.programCode);
    }
    // Fallback: try to get from localStorage directly
    if (!instructorId) {
      const id = localStorage.getItem('instructorId');
      if (id) setInstructorId(id);
    }
    if (!programCode) {
      const code = localStorage.getItem('programCode');
      if (code) setProgramCode(code);
    }
  }, []);

  const currentHour = new Date().getHours();

  const greeting = () => {
    if (currentHour < 12) return 'Good Morning, Instructor! ☀️';
    if (currentHour < 18) return 'Good Afternoon, Instructor! 🌤';
    return 'Good Evening, Instructor! 🌙';
  };

  return (
    <main className="p-5 min-h-screen dark:bg-gray-900 space-y-6">
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
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-md">
            {greeting()}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-200">
            Here’s your Evaluation Results Overview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1">
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 shadow-sm dark:shadow-none mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Overall Performance Analytics
          </h2>
          <AnalyticsChart />
        </div>

        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 shadow-sm dark:shadow-none mb-10">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Evaluation Results
          </h2>
          <EvaluationTable instructorId={instructorId} programCode={programCode} />
        </div>
      </div>
    </main>
  );
}

export default InstructorDashboard;
