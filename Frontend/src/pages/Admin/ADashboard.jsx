import React from 'react';
import PieChart from "../../contents/Admin/Piechart";
import CompletionandPerformingInstructors from '../../contents/Admin/CompletionandPerformingInstructors';

function ADashboard() {
  const currentHour = new Date().getHours();
  
  const greeting = () => {
    if (currentHour < 12) {
      return "Good Morning, Admin!";
    } else if (currentHour < 18) {
      return "Good Afternoon, Admin!";
    } else {
      return "Good Evening, Admin!";
    }
  };

  return (
    <main className="p-8 min-h-screen dark:bg-gray-900 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
        {greeting()}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <PieChart />
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">
            Average Teaching Ratings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-2 gap-6">
          {[ 
            { title: 'Number of Students', count: 0, color: 'text-[#2196f3]' },
            { title: 'Number of Instructors', count: 0, color: 'text-[#4caf50]' },
            { title: 'Evaluation Submitted', count: 0, color: 'text-[#9c27b0]' },
            { title: 'Evaluation Not Submitted', count: 0, color: 'text-[#f44336]' },
          ].map(({ title, count, color }) => (
            <div
              key={title}
              className="bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col justify-center items-center border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <p className={`text-3xl font-bold ${color}`}>{count}</p>
            </div>
          ))}
        </div>
      </div>

      <CompletionandPerformingInstructors />
    </main>
  );
}

export default ADashboard;
