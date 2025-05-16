import React from 'react';
import CompletionIndicator from './CompletionIndicator';
import PerformingInstructor from './PerformingInstructor';

function CompletionandPerformingInstructors() {
  const CompletionRate = 88;

  return (
    <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-3 lg:gap-6">
      <div className="flex flex-col items-center rounded-lg hover:scale-[1.02] transition-transform bg-white dark:bg-gray-800 shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <CompletionIndicator value={CompletionRate} />
        <h2 className="text-base sm:text-lg md:text-xl font-medium mt-6 text-gray-900 dark:text-gray-100">
          Completion Rate
        </h2>
      </div>

     <div className="lg:col-span-2 bg-white dark:bg-gray-900 dark:text-gray-400 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <PerformingInstructor />
      </div>
    </div>
  );
}

export default CompletionandPerformingInstructors;
