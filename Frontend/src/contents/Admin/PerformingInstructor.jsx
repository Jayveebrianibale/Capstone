import React, { useEffect, useState } from 'react';
import { FiAward, FiX } from 'react-icons/fi';
import EvaluationService from '../../services/EvaluationService';
import { createPortal } from 'react-dom';

const PerformingInstructor = () => {
  const [topInstructors, setTopInstructors] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const medalEmoji = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

  useEffect(() => {
    const fetchTopInstructors = async () => {
      try {
        const data = await EvaluationService.getTopInstructors();
        setAllInstructors(data);
        setTopInstructors(data.slice(0, 5));
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

  const InstructorTable = ({ instructors, showAll = false }) => (
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
          {instructors.map((item, index) => {
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
  );

  const Modal = () => {
    if (!mounted) return null;

    return createPortal(
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              All Performing Instructors
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
            <InstructorTable instructors={allInstructors} showAll={true} />
          </div>
        </div>
      </div>,
      document.body
    );
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
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center space-x-2">
              <FiAward className="text-yellow-500 text-xl sm:text-2xl" />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Top Performing Instructors
              </h1>
            </div>
            {allInstructors.length > 5 && (
              <button
                onClick={() => setShowModal(true)}
                className="text-xs sm:text-sm text-[#1F3463] dark:text-[#5d7cbf] hover:text-[#2a4a8c] dark:hover:text-[#7d9fd9] font-medium"
              >
                View All
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
            Based on evaluation results
          </p>
          <InstructorTable instructors={topInstructors} />
        </>
      )}

      {showModal && <Modal />}
    </div>
  );
};

export default PerformingInstructor;
