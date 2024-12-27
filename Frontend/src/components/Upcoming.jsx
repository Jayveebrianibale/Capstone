import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Calendar from '../components/Calendar';
import BarChart from '../components/BarChart';

function Upcoming() {
  const { isDarkMode } = useOutletContext();

  return (
    <div className="pt-5">
      <h1 className="text-xl text-gray-600 dark:text-gray-300 pb-5 ml-2 font-medium">Evaluations Overview</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        <div className="lg:col-span-2 shadow-md rounded-xl p-6 flex-grow dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-300">
          <BarChart isDarkMode={isDarkMode} />
        </div>
        <div className="flex flex-col h-auto rounded-xl lg:col-span-1 flex-grow dark:bg-gray-800 dark:border-gray-700">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default Upcoming;
