import React from "react";
import { FiClipboard, FiCheckCircle, FiCalendar, FiInfo, FiUsers } from "react-icons/fi";

const SDashboard = () => {
  const studentName = "John Doe";
  const totalInstructors = 10; 
  const semester = "2nd Semester, SY 2024-2025"; 

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Welcome, {studentName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{semester}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <FiClipboard className="text-blue-500 text-2xl" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Pending Evaluations</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">You have <strong>2</strong> pending evaluations.</p>
          <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
            View Pending
          </button>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <FiCheckCircle className="text-green-500 text-2xl" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Completed Evaluations</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">You have completed <strong>3 out of 5</strong> evaluations.</p>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mt-3">
            <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: "60%" }}></div>
          </div>
        </div>

       
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <FiCalendar className="text-yellow-500 text-2xl" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Upcoming Evaluations</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Next evaluation is scheduled for <strong>March 10, 2025</strong>.</p>
        </div>

    
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <FiUsers className="text-purple-500 text-2xl" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Total Instructors</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">You are evaluating <strong>{totalInstructors}</strong> instructors this semester.</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg md:col-span-2 lg:col-span-3">
          <div className="flex items-center gap-3 mb-4">
            <FiInfo className="text-red-500 text-2xl" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Announcements</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Evaluation Deadline:</strong> March 15, 2025. Please complete all pending evaluations before the deadline.
          </p>
        </div>
      </div>
    </main>
  );
};

export default SDashboard;
