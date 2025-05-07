import React from 'react';

const EvaluationForm = ({
  instructor,
  questions = [],
  responses,
  handleResponseChange,
  handleCommentChange,
  handleSaveEvaluation,
  savedEvaluations,
  ratingOptions,
  isEvaluated = false,
}) => (
  <div className="space-y-6 border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
    {questions.length > 0 ? (
      questions.map((q, idx) => (
        <div
          key={idx}
          className="space-y-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
        >
          <h3 className="font-semibold text-base text-gray-800 dark:text-white">
            {idx + 1}. {q.category}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{q.question}</p>
          <select
            value={responses[instructor.id]?.[q.id]?.rating || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleResponseChange(instructor.id, q.id, value);
            }}
            disabled={isEvaluated}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              Select Rating
            </option>
            {ratingOptions?.[q.category]?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500 dark:text-gray-400">No questions available.</p>
    )}

    <div className="space-y-2">
      <label className="block text-base font-semibold text-gray-900 dark:text-white">
        Additional Comments:
      </label>
      <textarea
            className="w-full p-3 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            rows="4"
            value={responses[instructor.id]?.comment || ''}
            onChange={(e) => handleCommentChange(instructor.id, e.target.value)}
            placeholder="Provide additional feedback..."
            disabled={isEvaluated}
            />
    </div>

    <div className="flex justify-end">
      <button
        onClick={() => handleSaveEvaluation(instructor.id)}
        disabled={isEvaluated}
        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
          isEvaluated
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {savedEvaluations[instructor.id] ? 'Update Evaluation' : 'Save Evaluation'}
      </button>
    </div>
  </div>
);

export default EvaluationForm;
