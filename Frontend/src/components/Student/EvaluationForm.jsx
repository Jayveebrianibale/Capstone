import React, { useEffect, useRef, useState } from 'react';

const EvaluationForm = ({
  instructor,
  questions = [],
  responses = {},
  handleResponseChange,
  handleCommentChange,
  handleSaveEvaluation,
  evaluationResponses = {},
  ratingOptions = {},
  viewOnly = false,
  onClose,
}) => {
  const firstUnansweredRef = useRef(null);
  const instructorId = instructor?.id;
  const instructorResponses = responses?.[instructorId] || {};
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (firstUnansweredRef.current) {
      firstUnansweredRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [responses, instructorId, validationErrors]);

  const scrollToNextUnanswered = (currentQuestionId) => {
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    const nextUnanswered = questions.slice(currentIndex + 1).find(q => !instructorResponses?.[q.id]?.rating);
    
    if (nextUnanswered) {
      const element = document.getElementById(`question-${nextUnanswered.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleSave = () => {
    // Check for missing ratings
    const errors = {};
    let hasErrors = false;
    
    questions.forEach(q => {
      if (!instructorResponses?.[q.id]?.rating) {
        errors[q.id] = true;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(errors);
      // Find the first unanswered question and scroll to it
      const firstUnanswered = questions.find(q => !instructorResponses?.[q.id]?.rating);
      if (firstUnanswered) {
        const element = document.getElementById(`question-${firstUnanswered.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    // Clear any previous validation errors
    setValidationErrors({});
    handleSaveEvaluation(instructorId);
  };

  // Check if all questions have ratings
  const allQuestionsAnswered = questions.every(q => instructorResponses?.[q.id]?.rating);

  // Clear validation error when a rating is selected
  const handleRatingChange = (questionId, value, label) => {
    if (validationErrors[questionId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
    handleResponseChange(instructorId, questionId, value, label);
    
    // Add a small delay to ensure the response is updated before scrolling
    setTimeout(() => {
      scrollToNextUnanswered(questionId);
    }, 100);
  };

  return (
    <div className="relative space-y-6 border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      {viewOnly && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-lg font-bold"
          aria-label="Close view"
        >
          ✕
        </button>
      )}

      {questions.length > 0 ? (
        questions.map((q, idx) => {
          const missing = !instructorResponses?.[q.id]?.rating;
          const hasError = validationErrors[q.id];
          const prevUnanswered = idx > 0 && questions.slice(0, idx).some(qq => !instructorResponses?.[qq.id]?.rating);

          return (
            <div
              key={q.id}
              id={`question-${q.id}`}
              ref={hasError ? firstUnansweredRef : null}
              className={`space-y-2 p-4 border rounded-lg transition-colors ${
                hasError 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
              }`}
            >
              <h3 className="font-semibold text-base text-gray-800 dark:text-white">
                {idx + 1}. {q.category}
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-300">{q.question}</p>
              <div className="relative">
                <select
                  value={instructorResponses?.[q.id]?.rating || ''}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    const selectedLabel =
                      ratingOptions?.[q.category]?.find(opt => String(opt.value) === String(selectedValue))?.label || '';
                    handleRatingChange(q.id, selectedValue, selectedLabel);
                  }}
                  disabled={viewOnly || prevUnanswered}
                  className={`w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                    viewOnly || prevUnanswered
                      ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-500'
                      : hasError
                        ? 'bg-white dark:bg-gray-700 text-black dark:text-white border-red-500 focus:ring-red-500'
                        : 'bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 focus:ring-green-500'
                  }`}
                >
                  <option value="" disabled>Select Rating</option>
                  {ratingOptions?.[q.category]?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {hasError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Please select a rating for this question
                  </p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">No questions available.</p>
      )}

      <div className="space-y-2">
        <label className="block text-base font-semibold text-gray-900 dark:text-white">Provide any specific suggestions for how the teacher could improve their teaching methods:</label>
        <textarea
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
            viewOnly
              ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-500'
              : 'bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 focus:ring-green-500'
          }`}
          rows="4"
          value={instructorResponses?.comment || ''}
          onChange={(e) => handleCommentChange(instructorId, e.target.value)}
          placeholder="Share any additional comments or thoughts about your experience with the teacher (Optional)"
          disabled={viewOnly}
          maxLength={300}
        />
      </div>

      {!viewOnly && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={!allQuestionsAnswered}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              allQuestionsAnswered
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-400 cursor-not-allowed text-white'
            }`}
          >
            {evaluationResponses?.[instructorId] ? 'Update Evaluation' : 'Save Evaluation'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EvaluationForm;
