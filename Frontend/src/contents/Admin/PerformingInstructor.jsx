import React from 'react';

const PerformingInstructor = () => {
  const data = [
    { name: "John Doe", handle: "BSIS-4", exceedingly: "100", percentage: "95%" },
    { name: "Jane Smith", handle: "ACT-2", exceedingly: "90", percentage: "92%" },
    { name: "Michael Brown", handle: "BSAIS-1", exceedingly: "85", percentage: "89%" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-900 dark:text-gray-100">
        <thead>
          <tr className="text-center font-medium">
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Course Handle</th>
            <th className="px-6 py-3">Exceedingly Well</th>
            <th className="px-6 py-3">Average Percentage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center">
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.handle}</td>
              <td className="px-6 py-4">{item.exceedingly}</td>
              <td className="px-6 py-4">{item.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformingInstructor;
