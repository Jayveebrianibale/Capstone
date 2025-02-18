import React from 'react';

const PerformingInstructor = () => {
  const data = [
    { name: "John Doe", handle: "BSIS-4", exceedingly: "100" , percentage: "95%"},
    { name: "Jane Smith",  handle: "ACT-2", exceedingly: "90", percentage: "92%" },
    { name: "Michael Brown",  handle: "BSAIS-1", exceedingly: "85", percentage: "89%" },
  ];

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-900 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <tr className='text-center'>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Course Handle</th>
            <th scope="col" className="px-6 py-3">Exceedingly Well</th>
            <th scope="col" className="px-6 py-3">Average Percentage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
            >
              <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">{item.name}</td>
              <td className="px-6 py-4 text-center">{item.handle}</td>
              <td className="px-6 py-4 text-center">{item.exceedingly}</td>
              <td className="px-6 py-4 text-center">{item.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformingInstructor;
