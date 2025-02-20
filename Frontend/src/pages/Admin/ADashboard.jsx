import React from 'react';
import PieChart from "../../contents/Admin/Piechart";
import CompletionandPerformingInstructors from '../../contents/Admin/CompletionandPerformingInstructors';


function ADashboard() {

  return (
    <main className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="sm:text-xl md:text-2xl lg:text-3xl pb-2 font-medium text-gray-900 dark:text-gray-100">
        Welcome, Admin!
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        
        <div className="lg:col-span-1 flex flex-col items-center pt-5">
          <PieChart />
          <h1 className="text-base mr-16 font-medium text-gray-900 dark:text-gray-100 mt-4">
            Average Teaching Ratings
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
          <div className="bg-gray-50 h-32 dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Total Number of Students
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">800</p>
          </div>

          <div className="bg-gray-50 h-32 dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Total Number of Instructors
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">45</p>
          </div>

          <div className="bg-gray-50 h-32 dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Total Evaluation Submitted
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">12</p>
          </div>

          <div className="bg-gray-50 h-32 dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Total Evaluation Not Submitted
            </h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">788</p>
          </div>
        </div>
      </div>
      <div className='mt-6'>
        <CompletionandPerformingInstructors/>
      </div>
    </main>
  );
}

export default ADashboard;
