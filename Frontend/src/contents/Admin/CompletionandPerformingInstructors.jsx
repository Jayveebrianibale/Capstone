import React from 'react';
import PerformingInstructor from './PerformingInstructor';
import EvaluationChartByProgram from './EvaluationChartByProgram';

function CompletionandPerformingInstructors() {
  return (
    <div className="grid grid-cols-1 gap-5 md:gap-5 lg:grid-cols-3 lg:gap-6">
      <div className='lg:col-span-1 bg-white dark:bg-gray-800 dark:text-gray-400 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform rounded-2xl p-6 pt-5 border border-gray-200 dark:border-gray-700'>
        <PerformingInstructor />
      </div>
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 dark:text-gray-400 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <EvaluationChartByProgram/>
      </div>
    </div>
  );
}

export default CompletionandPerformingInstructors;
