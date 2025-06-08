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
    try {
      setIsSubmitting(true);
      await handleSubmitAll();
    } catch (error) {
      console.error('Error submitting evaluations:', error);
    } finally {
      setIsSubmitting(false);
      setShowSubmitAllModal(false);
    }
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
                      onClick={() => {
                        setViewOnlyInstructorId(instructor.id);
                        setExpandedInstructorId(instructor.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-sm"
                    >
                      View
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setViewOnlyInstructorId(null);
                        setExpandedInstructorId(isExpanded ? null : instructor.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
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
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
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
                      onClick={() => {
                        setViewOnlyInstructorId(instructor.id);
                        setExpandedInstructorId(instructor.id);
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      View
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setViewOnlyInstructorId(null);
                        setExpandedInstructorId(isExpanded ? null : instructor.id);
                      }}
                      className={`px-4 py-2 rounded-lg transition ${
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
        <div className="p-4 border-t dark:border-gray-700 text-right">
          <button
            onClick={() => setShowSubmitAllModal(true)}
            disabled={isSubmitAllDisabled || isSubmitting}
            className={`mt-4 mb-4 ml-4 px-6 py-2 rounded-lg text-white ${
              isSubmitting || isSubmitAllDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#1F3463] hover:bg-blue-700'
            }`}
          >
            Submit All
          </button>
        </div>
      )}

      {/* Submit All Confirmation Modal */}
      {showSubmitAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Submission
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to submit all evaluations? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSubmitAllModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAllWithConfirmation}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg text-white ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-[#1F3463] hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorTable;