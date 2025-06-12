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
    return 'text-gray-900 dark:text-gray-100 font-semibold';
  };

  return (
    <div className="overflow-x-auto p-4 sm:p-6 rounded-lg">
      {loading ? (
        <div className="flex justify-center items-center h-[200px] sm:h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1F3463]"></div>
        </div>
      ) : topInstructors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px] sm:h-[300px] w-full bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#f0f4ff] dark:bg-[#1a2a4a] flex items-center justify-center shadow-sm border border-[#e0e7ff] dark:border-gray-600 mb-3 sm:mb-4">
            <FiAward className="w-6 h-6 sm:w-8 sm:h-8 text-[#1F3463] dark:text-[#5d7cbf]" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 text-center">
            No Performing Instructors Yet
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center max-w-[200px] sm:max-w-xs">
            Once evaluations are submitted, the top performing instructors will be displayed here.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-2 mb-2 sm:mb-3">
            <FiAward className="text-yellow-500 text-xl sm:text-2xl" />
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Top Performing Instructors
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
            Based on evaluation results
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-900 dark:text-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-center">
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold">Name</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold">Average Rating</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {topInstructors.map((item, index) => {
                  const percentage = parseFloat(item.percentage);
                  const avgRating = parseFloat(item.avg_rating).toFixed(2);
                  return (
                    <tr
                      key={item.id}
                      className="even:bg-gray-50 dark:even:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="py-2 sm:py-3 px-3 sm:px-4 flex items-center gap-1 text-left">
                        {medalEmoji[index] && <span className="text-lg sm:text-xl">{medalEmoji[index]}</span>}
                        <span className="text-xs sm:text-sm">{item.name}</span>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">{avgRating}</td>
                      <td className={`px-3 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm ${getPercentageColor(percentage)}`}>
                        {percentage.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformingInstructor;
