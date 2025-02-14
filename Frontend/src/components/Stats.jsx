import React from "react";

function Stats() {
  return (
    <div className="flex flex-col gap-3">
      {/* Instructors */}
      <div className="py-5 px-4 rounded-xl border shadow-md bg-gradient-to-r from-red-400 to-red-600 dark:from-red-700 dark:to-red-900 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M14 9a4 4 0 11-8 0 4 4 0 018 0zm7 6v5m-4-5v5m-3-5a4 4 0 00-8 0v5h8v-5z" />
          </svg>
          <h1 className="text-sm sm:text-md lg:text-lg font-semibold text-white">INSTRUCTORS</h1>
        </div>
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white mt-1">9</p>
      </div>

      {/* Completed */}
      <div className="py-5 px-4 rounded-xl border shadow-md bg-gradient-to-r from-green-400 to-green-600 dark:from-green-700 dark:to-green-900 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <h1 className="text-sm sm:text-md lg:text-lg font-semibold text-white">COMPLETED</h1>
        </div>
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white mt-1">0</p>
      </div>

      {/* Status */}
      <div className="py-5 px-4 rounded-xl border shadow-md bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-900 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 1 1-10 10h2a8 8 0 1 0 8-8V2z" />
          </svg>
          <h1 className="text-sm sm:text-md lg:text-lg font-semibold text-white">STATUS</h1>
        </div>
        <p className="text-md sm:text-lg lg:text-xl text-white mt-1">Not Started</p>
      </div>
    </div>
  );
}

export default Stats;
