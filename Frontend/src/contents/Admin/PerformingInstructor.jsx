import React, { useEffect, useState } from 'react';
import { FiAward } from 'react-icons/fi';
import EvaluationService from '../../services/EvaluationService';

const PerformingInstructor = () => {
  const [topInstructors, setTopInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  const medalEmoji = ['🥇', '🥈', '🥉'];

  useEffect(() => {
    const fetchTopInstructors = async () => {
      try {
        const data = await EvaluationService.getTopInstructors();
        setTopInstructors(data);
      } catch (error) {
        console.error("Error fetching top instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopInstructors();
  }, []);

  const getPercentageColor = (value) => {
    if (value >= 90) return 'text-green-500 font-semibold';
    if (value >= 75) return 'text-yellow-500 font-semibold';
    return 'text-red-500 font-semibold';
  };

  return (
    <div className="overflow-x-auto p-2 sm:p-4 rounded-lg">
      {loading ? (
        <p className="text-center py-5 text-gray-600 dark:text-gray-300">Loading...</p>
      ) : topInstructors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 w-full bg-white dark:bg-gray-800 rounded-lg">
          <FiAward className="w-12 h-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
            No Performing Instructors Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
            Once evaluations are submitted, the top performing instructors will be displayed here.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-2 mb-4">
            <FiAward className="text-yellow-500 text-2xl" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Top Performing Instructors
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
            Based on evaluation results
          </p>
          <table className="w-full text-sm text-left text-gray-900 dark:text-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-center">
                <th className="px-4 py-3 text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-sm font-semibold">Average Rating</th>
                <th className="px-4 py-3 text-sm font-semibold">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {topInstructors.map((item, index) => {
                const percentage = parseFloat(item.percentage);
                const avgRating = parseFloat(item.avg_rating).toFixed(2);
                return (
                  <tr
                    key={item.id}
                    className="text-center even:bg-gray-50 dark:even:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3 flex items-center justify-center space-x-2">
                      {medalEmoji[index] && <span className="text-xl">{medalEmoji[index]}</span>}
                      <span>{item.name}</span>
                    </td>
                    <td className="px-4 py-3">{avgRating}</td>
                    <td className={`px-4 py-3 ${getPercentageColor(percentage)}`}>
                      {percentage.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default PerformingInstructor;
