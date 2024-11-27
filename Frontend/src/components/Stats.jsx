import React from 'react'

function Stats() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="h-36 rounded-xl border shadow-md">
            <div className='flex flex-col justify-center items-center gap-7'>
                <h1 className='text-xl pt-5'>Pending Evaluations</h1>
                <p className='text-4xl'>0</p>
            </div>
        </div>
        <div className="h-36 rounded-xl border shadow-md">
            <div className='flex flex-col justify-center items-center gap-7'>
                <h1 className='text-xl pt-5'>Completed Evaluations</h1>
                <p className='text-4xl'>0</p>
            </div>
        </div>
        <div className="h-36 rounded-xl border shadow-md">
            <div className='flex flex-col justify-center items-center gap-7'>
                <h1 className='text-xl pt-5'>Total Subjects</h1>
                <p className='text-4xl'>6</p>
            </div>
        </div>
    </div>
  )
}

export default Stats