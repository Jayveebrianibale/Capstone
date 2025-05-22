import React, { useState, useEffect } from 'react';
import QuestionsService from '../../../services/QuestionService';
import { FiMail, FiLoader, FiCheck } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import InstructorService from '../../../services/InstructorService';
import { toast, ToastContainer } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_URL;

const ViewResultsModal = ({ isOpen, onClose, instructor }) => {
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const getQuestions = async () => {
      if (isOpen) {
        try {
          setLoadingQuestions(true);
          const fetchedQuestions = await QuestionsService.getAll();
          setQuestions(fetchedQuestions);
          setError(null);
        } catch (err) {
          console.error('Error fetching questions:', err);
          setError('Failed to load questions');
        } finally {
          setLoadingQuestions(false);
        }
      }
    };

    getQuestions();
  }, [isOpen]);

  if (!isOpen || !instructor) return null;

  const ratings = instructor.ratings || {};
  const comments = instructor.comments || 'No comments';
  const percentage = instructor.overallRating ?? 0;

  const handleSend = async () => {
    setSending(true);
    try {
      await InstructorService.handleSendResult(instructor.id);
      toast.success('Email sent successfully!');
      setSent(true);
      setSending(false);
      setTimeout(() => {
        onClose();
        setSent(false);
      }, 5000);
    } catch (err) {
      console.error('Send result failed', err);
      toast.error('Failed to send evaluation result.');
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={6000} hideProgressBar={false} />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh]">
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
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Overall Rating */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Overall Rating
            </h3>
            <div
              className={`text-3xl font-bold ${
                percentage >= 85
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
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
            {loadingQuestions ? (
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
                        {ratings[`q${index + 1}`]?.toFixed(2) || '-'}
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
          <div className="flex flex-col sm:flex-row gap-4">
            {/* View PDF Button */}
            <button
              onClick={() => window.open(`${baseURL}/instructors/${instructor.id}/pdf`, '_blank')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1F3463]/90 text-white py-3 px-6 rounded-xl font-medium
                shadow-lg shadow-[#1F3463]/20 hover:shadow-xl hover:shadow-[#1F3463]/30
                hover:bg-[#2a4585]/90 active:scale-[0.98] transform transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#1F3463] focus:ring-offset-2"
            >
              <HiOutlineDocumentText className="text-xl" />
              View PDF
            </button>

            {/* Send Mail Button */}
            <button
              onClick={handleSend}
              disabled={sending || sent}
              className={`flex-1 flex items-center justify-center gap-2 border py-3 px-6 rounded-xl font-medium transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${sending || sent
                  ? 'border-gray-400 text-gray-400'
                  : 'bg-transparent text-[#1F3463] dark:text-indigo-400 border-[#1F3463] dark:border-indigo-400 hover:bg-[#1F3463]/10 dark:hover:bg-indigo-900/20 active:scale-[0.98] focus:ring-[#1F3463]'}
              `}
            >
              {sending ? (
                <><FiLoader className="animate-spin text-lg" /> Sending...</>
              ) : sent ? (
                <><FiCheck className="text-green-600 text-lg" /> Sent!</>
              ) : (
                <><FiMail className="text-lg" /> Send Result</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewResultsModal;
