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
      ) : (
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
      )}
    </div>
  );
};

export default PerformingInstructor;
