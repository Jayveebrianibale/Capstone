import React, { useState, useEffect } from 'react';
import { fetchQuestions } from '../../../services/QuestionService';

const ViewResultsModal = ({ isOpen, onClose, instructor }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQuestions = async () => {
      if (isOpen) {
        try {
          setLoading(true);
          const fetchedQuestions = await fetchQuestions();
          setQuestions(fetchedQuestions);
          setError(null);
        } catch (err) {
          console.error('Error fetching questions:', err);
          setError('Failed to load questions');
        } finally {
          setLoading(false);
        }
      }
    };

    getQuestions();
  }, [isOpen]);

  if (!isOpen || !instructor) return null;

  const ratings = instructor.ratings || {};
  const comments = instructor.comments || "No comments";
  const percentage = instructor.overallRating ?? 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1F3463] text-white p-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold">{instructor.name}'s Evaluation Results</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Rating */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Overall Rating
            </h3>
            <div
              className={`text-3xl font-bold ${
                percentage >= 85
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {percentage.toFixed(2)}%
            </div>
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Detailed Ratings
            </h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F3463] mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading questions...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-600 dark:text-red-400">
                {error}
              </div>
            ) : (
              <div className="grid gap-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id || index}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">
                          {question.category}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {question.question}
                        </p>
                      </div>
                      <div className="text-lg font-semibold text-[#1F3463] dark:text-blue-400">
                        {ratings[`q${index + 1}`]?.toFixed(2) || "-"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Student Comments
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 italic">
                {comments}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 p-4 rounded-b-xl border-t dark:border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-[#1F3463] text-white py-3 px-6 rounded-xl font-medium
                shadow-lg shadow-[#1F3463]/20 hover:shadow-xl hover:shadow-[#1F3463]/30
                hover:bg-[#2a4585] active:scale-[0.98] transform transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#1F3463] focus:ring-offset-2"
            >
              Close
            </button>
            <button
              onClick={() => window.open(`http://localhost:8000/api/instructors/${instructor.id}/pdf`, '_blank')}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium
                shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all"
            >
              View PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewResultsModal;
