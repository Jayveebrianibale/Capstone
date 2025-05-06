import React from 'react';
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
}) => {
  const ratingOptions = {
    "Learning Environment": [
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

  return (
    <>
      <div className="mt-6 overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-left bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="px-6 py-4 text-base">Instructor</th>
              <th className="px-6 py-4 text-base">Status</th>
              <th className="px-6 py-4 text-base">Submitted At</th>
              <th className="px-6 py-4 text-center text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => {
              const isExpanded = expandedInstructorId === instructor.id;
              return (
                <React.Fragment key={instructor.id}>
                  <tr className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {instructor.name}
                    </td>
                    <td className="px-6 py-4">{instructor.status}</td>
                    <td className="px-6 py-4">{instructor.submittedAt}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setExpandedInstructorId(isExpanded ? null : instructor.id)}
                        className="bg-[#1F3463] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4">
                        <EvaluationForm 
                          instructor={instructor}
                          questions={questions}
                          responses={responses}
                          handleResponseChange={handleResponseChange}
                          handleCommentChange={handleCommentChange}
                          handleSaveEvaluation={handleSaveEvaluation}
                          savedEvaluations={savedEvaluations}
                          ratingOptions={ratingOptions} // Pass it here
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {Object.keys(savedEvaluations).length > 0 && (
        <div className="text-right mt-4">
          <button
            onClick={handleSubmitAll}
            className="bg-[#1F3463] text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Submit All Saved Evaluations
          </button>
        </div>
      )}
    </>
  );
};

export default InstructorTable;
