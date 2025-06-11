import React, { useState } from 'react';
import EvaluationForm from './EvaluationForm';

const InstructorTable = ({
  instructors,
  expandedInstructorId,
  setExpandedInstructorId,
  responses,
  handleResponseChange,
  handleCommentChange,
  handleSaveEvaluation,
  savedEvaluations,
  handleSubmitAll,
  questions,
  submissionInfo, 
  viewOnlyInstructorId,
  setViewOnlyInstructorId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitAllModal, setShowSubmitAllModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  
  const ratingOptions = {
    "Learning Environments": [
      { value: '5', label: '5 - Extremely positive and significantly enhances learning' },
      { value: '4', label: '4 - Positive and slightly enhances learning' },
      { value: '3', label: '3 - Neutral, neither positive nor negative' },
      { value: '2', label: '2 - Negative and somewhat hinders learning' },
      { value: '1', label: '1 - Extremely negative and hinders learning' },
    ],
    "Student Development": [
      { value: '5', label: '5 - Exceedingly well' },
      { value: '4', label: '4 - Very well' },
      { value: '3', label: '3 - Moderately' },
      { value: '2', label: '2 - Slightly' },
      { value: '1', label: '1 - Not at all' },
    ],
    "Content Knowledge": [
      { value: '5', label: '5 - Exceptional' },
      { value: '4', label: '4 - Strong' },
      { value: '3', label: '3 - Adequate' },
      { value: '2', label: '2 - Limited' },
      { value: '1', label: '1 - Very limited' },
    ],
    "Application of Content": [
      { value: '5', label: '5 - Very effectively' },
      { value: '4', label: '4 - Often effective' },
      { value: '3', label: '3 - Sometimes effective' },
      { value: '2', label: '2 - Rarely effective' },
      { value: '1', label: '1 - Not at all' },
    ],
    "Planning for Instruction": [
      { value: '5', label: '5 - Excellent' },
      { value: '4', label: '4 - Good' },
      { value: '3', label: '3 - Satisfactory' },
      { value: '2', label: '2 - Poor' },
      { value: '1', label: '1 - Very poor' },
    ],
    "Teaching Strategies": [
      { value: '5', label: '5 - Very effective' },
      { value: '4', label: '4 - Often effective' },
      { value: '3', label: '3 - Sometimes effective' },
      { value: '2', label: '2 - Rarely effective' },
      { value: '1', label: '1 - Not effective at all' },
    ],
    "Ethical Practice": [
      { value: '5', label: '5 - Consistently demonstrated exemplary ethical standards and professionalism' },
      { value: '4', label: '4 - Generally demonstrated ethical standards and professionalism, with minor lapses' },
      { value: '3', label: '3 - Occasionally displayed unethical behavior or unprofessional conduct' },
      { value: '2', label: '2 - Frequently displayed unethical behavior or unprofessional conduct' },
      { value: '1', label: '1 - Consistently demonstrated unethical behavior or unprofessional conduct' },
    ],
    "Leadership and Collaboration": [
      { value: '5', label: '5 - Excellent' },
      { value: '4', label: '4 - Good' },
      { value: '3', label: '3 - Average' },
      { value: '2', label: '2 - Poor' },
      { value: '1', label: '1 - Very poor' },
    ],
    "Overall Rating": [
      { value: '5', label: '5 - Very satisfied' },
      { value: '4', label: '4 - Satisfied' },
      { value: '3', label: '3 - Neutral' },
      { value: '2', label: '2 - Unsatisfied' },
      { value: '1', label: '1 - Very unsatisfied' },
    ],
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    let dateToFormat = timestamp;
    if (typeof timestamp === 'string' && timestamp.includes(' ') && !timestamp.includes('T') && !timestamp.endsWith('Z')) {
      dateToFormat = timestamp.replace(' ', 'T') + 'Z';
    }
    
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: true,
      timeZone: 'Asia/Manila'
    };
    try {
      return new Date(dateToFormat).toLocaleString('en-PH', options);
    } catch (e) {
      console.error("Error formatting date:", e, "Original timestamp:", timestamp);
      return 'Invalid Date';
    }
  };

  const allEvaluationsSaved = instructors.length > 0 && Object.keys(savedEvaluations).length === instructors.length;
  const noInstructorsExist = instructors.length === 0;
  const isSubmitAllDisabled = noInstructorsExist || !allEvaluationsSaved;

  const handleSubmitAllWithConfirmation = async () => {
    setShowSubmitAllModal(false);
    setIsSubmitting(true);
    try {
      await handleSubmitAll();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewEvaluation = (instructor) => {
    setSelectedInstructor(instructor);
    setShowViewModal(true);
  };

  const getPercentageColor = (value) => {
    if (value >= 90) return 'text-green-500 font-semibold';
    if (value >= 75) return 'text-yellow-500 font-semibold';
    return 'text-red-500 font-semibold';
  };

  return (
    <div className="mt-6 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      {/* Desktop Header */}
      <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-b dark:border-gray-700">
        <div className="font-semibold uppercase tracking-wider">Instructor</div>
        <div className="font-semibold uppercase tracking-wider">Status</div>
        <div className="font-semibold uppercase tracking-wider">Submitted At</div>
        <div className="font-semibold uppercase tracking-wider text-center">Actions</div>
      </div>

      {instructors.map((instructor) => {
        const isExpanded = expandedInstructorId === instructor.id;
        const saved = savedEvaluations[instructor.id];
        const submittedAt = instructor.evaluationHistory?.evaluatedAt || submissionInfo?.[instructor.id]?.evaluatedAt || null;
        
        let status = 'Not Started';
        let statusClass = 'text-red-500';
          
        if (instructor.evaluationHistory) {
          status = 'Evaluated';
          statusClass = 'text-green-600';
        } else if (submissionInfo?.[instructor.id]?.status === 'Evaluated') {
          status = 'Evaluated';
          statusClass = 'text-green-600';
        } else if (saved) {
          status = 'Done';
          statusClass = 'text-green-600';
        }

        return (
          <div key={instructor.id} className="border-b dark:border-gray-700">
            {/* Mobile Layout */}
            <div className="md:hidden p-4 space-y-2">
              <div className="font-semibold text-gray-900 dark:text-white">
                {instructor.name}
              </div>
              
              <div className="flex justify-between items-center">
                <div className={`${statusClass} font-medium`}>
                  {status}
                </div>
                <div>
                  {status === 'Evaluated' ? (
                    <button
                      onClick={() => handleViewEvaluation(instructor)}
                      className="px-4 py-2 rounded-lg bg-[#1F3463] hover:bg-blue-700 text-white text-sm sm:text-base"
                    >
                      View
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setViewOnlyInstructorId(null);
                        setExpandedInstructorId(isExpanded ? null : instructor.id);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm sm:text-base ${
                        saved ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#1F3463] hover:bg-blue-700'
                      } text-white`}
                    >
                      {saved ? 'Edit' : 'Evaluate'}
                    </button>
                  )}
                </div>
              </div>

              {status === 'Evaluated' && submittedAt && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Submitted: {formatDate(submittedAt)}
                </div>
              )}
            </div>
            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700">
              {/* Avatar and Name */}
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#1F3463] flex items-center justify-center">
                  <span className="text-white font-medium">
                    {instructor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate break-words">
                    {instructor.name}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className={`font-semibold ${statusClass}`}>
                {status}
              </div>

              {/* Submitted At */}
              <div>
                {status === 'Evaluated' && submittedAt
                  ? formatDate(submittedAt)
                  : '—'}
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                {status === 'Evaluated' ? (
                  <button
                    onClick={() => handleViewEvaluation(instructor)}
                    className="px-3 py-1.5 rounded-lg bg-[#1F3463] hover:bg-blue-700 text-white text-base"
                  >
                    View
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setViewOnlyInstructorId(null);
                      setExpandedInstructorId(isExpanded ? null : instructor.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-base ${
                      saved ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#1F3463] hover:bg-blue-700'
                    } text-white`}
                  >
                    {saved ? 'Edit' : 'Evaluate'}
                  </button>
                )}
              </div>
            </div>
            {/* Expanded Form Section */}
            {isExpanded && (
              <div className="col-span-full p-4 border-t dark:border-gray-700">
                <EvaluationForm
                  instructor={instructor}
                  questions={questions}
                  responses={responses}
                  handleResponseChange={handleResponseChange}
                  handleCommentChange={handleCommentChange}
                  handleSaveEvaluation={handleSaveEvaluation}
                  savedEvaluations={savedEvaluations}
                  ratingOptions={ratingOptions}
                  viewOnly={viewOnlyInstructorId === instructor.id}
                  onClose={() => {
                    setViewOnlyInstructorId(null);
                    setExpandedInstructorId(null);
                  }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Submit All Button */}
      {Object.keys(savedEvaluations).length > 0 && 
       !instructors.every(instructor => 
         instructor.evaluationHistory || 
         submissionInfo?.[instructor.id]?.status === 'Evaluated'
       ) && (
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex justify-end">
            <button
              onClick={() => setShowSubmitAllModal(true)}
              disabled={isSubmitAllDisabled || isSubmitting}
              className={`px-4 py-2 rounded-lg text-white text-sm sm:text-base min-w-[120px] ${
                isSubmitting || isSubmitAllDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#1F3463] hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l5-5-5-5v4a12 12 0 00-12 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit All'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Submit All Confirmation Modal */}
      {showSubmitAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-800 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Confirm Submission
              </h3>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                You are about to submit all your evaluations. This action cannot be undone.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 sm:p-6 rounded-lg">
                <p className="text-sm sm:text-base text-yellow-800 dark:text-yellow-200">
                  Please make sure you have reviewed all your evaluations before proceeding.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                onClick={() => setShowSubmitAllModal(false)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-colors text-sm sm:text-base font-medium order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAllWithConfirmation}
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white transition-colors text-sm sm:text-base font-medium order-1 sm:order-2 ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-[#1F3463] hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l5-5-5-5v4a12 12 0 00-12 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Confirm & Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Evaluation Modal */}
      {showViewModal && selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%] max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#1F3463] flex items-center justify-center">
                  <span className="text-white font-medium">
                    {selectedInstructor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedInstructor.name}
                </h3>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {questions.map((q, idx) => {
                const response = responses[selectedInstructor.id]?.[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900"
                  >
                    <h4 className="font-semibold text-base text-gray-800 dark:text-white mb-2">
                      {idx + 1}. {q.category}
                    </h4>
                    <p className="text-base text-gray-600 dark:text-gray-300 mb-3">
                      {q.question}
                    </p>
                    {response && (
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Rating: {response.label || response.rating}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {responses[selectedInstructor.id]?.comment && (
                <div className="mt-6">
                  <h4 className="font-semibold text-base text-gray-800 dark:text-white mb-2">
                    Comments
                  </h4>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {responses[selectedInstructor.id].comment}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorTable;