import React from 'react';
import { FiAward } from 'react-icons/fi';

const PerformingInstructor = () => {
  const data = [
    { name: "John Doe", handle: "BSIS-4", exceedingly: "100", percentage: "95%" },
    { name: "Jane Smith", handle: "ACT-2", exceedingly: "90", percentage: "92%" },
    { name: "Michael Brown", handle: "BSAIS-1", exceedingly: "85", percentage: "89%" },
  ];

  const medalEmoji = ['🥇', '🥈', '🥉'];

  return (
    <div className="overflow-x-auto p-2 sm:p-4 rounded-lg">
      <table className="w-full text-sm text-left text-gray-900 dark:text-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-center">
            <th className="px-4 py-3 text-sm font-semibold">Name</th>
            <th className="px-4 py-3 text-sm font-semibold">Course Handle</th>
            <th className="px-4 py-3 text-sm font-semibold">Exceedingly Well</th>
            <th className="px-4 py-3 text-sm font-semibold">Average Percentage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={index}
              className="text-center even:bg-gray-50 dark:even:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="px-4 py-3 flex items-center justify-center space-x-2">
                {medalEmoji[index] && <span className="text-xl">{medalEmoji[index]}</span>}
                <span>{item.name}</span>
              </td>
              <td className="px-4 py-3">{item.handle}</td>
              <td className="px-4 py-3">{item.exceedingly}</td>
              <td className="px-4 py-3">{item.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformingInstructor;
