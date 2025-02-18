import React from 'react';
import CompletionIndicator from './CompletionIndicator';
import PerformingInstructor from './PerformingInstructor';

function CompletionandPerformingInstructors() {
  const CompletionRate = 88;

  return (
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-8">
      <div className="mt-7 flex flex-col items-center rounded-lg">
        <CompletionIndicator value={CompletionRate} />
      </div>

      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6">
        <h1 className="text-xl mb-4 text-gray-900 dark:text-gray-100">
          Top 3 Performing Instructors
        </h1>
        <PerformingInstructor />
      </div>
    </div>
  );
}

export default CompletionandPerformingInstructors;
