import React from 'react';

function Stats() {
  return (
  <div className="grid grid-cols- gap-4 lg:grid-cols-4 lg:gap-6">
      <div className="h-36 rounded-xl border shadow-md bg-red-50">
        <div className='flex flex-col justify-center items-center gap-7'>
          <h1 className='text-lg pt-5 text-red-800'>Pending Evaluations</h1>
          <p className='text-3xl text-red-600'>0</p>
        </div>
      </div>
      <div className="h-36 rounded-xl border shadow-md bg-green-50">
        <div className='flex flex-col justify-center items-center gap-7'>
          <h1 className='text-lg pt-5 text-green-800'>Completed Evaluations</h1>
          <p className='text-3xl text-green-600'>0</p>
        </div>
      </div>
      <div className="h-36 rounded-xl border shadow-md bg-yellow-50">
        <div className='flex flex-col justify-center items-center gap-7'>
          <h1 className='text-lg pt-5 text-yellow-800'>Total Instructors</h1>
          <p className='text-3xl text-yellow-600'>6</p>
        </div>
      </div>
      <div className="h-36 rounded-xl border shadow-md bg-blue-50">
        <div className='flex flex-col justify-center items-center gap-7'>
        <h1 className='text-lg pt-5 text-blue-800'>Evaluation Status</h1>
        <p className='text-lg text-blue-600'>Not Started</p>
      </div>
</div>

    </div>
  );
}

export default Stats;
