import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import FullScreenLoader from '../../components/FullScreenLoader';
import { useLoading } from '../../components/LoadingContext';
import InstructorService from '../../services/InstructorService';

function SEvaluations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [instructors, setInstructors] = useState([]);
  const [responses, setResponses] = useState({});
  const [noInstructors, setNoInstructors] = useState(false);
  const { loading, setLoading } = useLoading();
  const [error, setError] = useState(null);

  const itemsPerPage = 5;

  const mapYearLevelToNumber = (yearLevel) => {
    if (typeof yearLevel === 'number') {
      return yearLevel;
    }

    switch (yearLevel) {
      case '1st Year': return 1;
      case '2nd Year': return 2;
      case '3rd Year': return 3;
      case '4th Year': return 4;
      default: return null;
    }
  };

  useEffect(() => {
    const fetchAssignedInstructors = async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const programId = user?.program_id;
      const yearLevel = user?.yearLevel;

      if (!programId || !yearLevel) {
        console.warn('Program ID or Year Level missing');
        setError('Program ID or Year Level is missing');
        return;
      }

      const yearLevelNumber = mapYearLevelToNumber(yearLevel);

      if (!yearLevelNumber) {
        console.warn('Invalid Year Level');
        setError('Invalid Year Level');
        return;
      }

      setLoading(true);
      try {
        const response = await InstructorService.getInstructorsByProgramAndYear(programId, yearLevelNumber);
        console.log('Fetched Instructors Response:', response); // Check the full response here

        // Assuming response is the array, not response.data
        if (Array.isArray(response) && response.length > 0) {
          const instructorNames = response.map((instructor) => ({
            id: instructor.id,
            name: instructor.name,
          }));

          setInstructors(instructorNames);
          setNoInstructors(false);
          setError(null); // Clear error if data is fetched successfully
        } else {
          setInstructors([]);
          setNoInstructors(true);
          setError(null); // Clear error if no instructors are found
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
        setInstructors([]);
        setNoInstructors(true);
        setError('An error occurred while fetching instructors');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedInstructors();
  }, [setLoading]);

  const questions = [
    { category: 'Teaching Effectiveness', question: 'How effective is the teacher in delivering lessons?' },
    { category: 'Communication Skills', question: 'How well does the teacher communicate ideas and concepts?' },
    { category: 'Classroom Management', question: 'How well does the teacher manage the classroom?' },
    { category: 'Knowledge of Subject Matter', question: 'How knowledgeable is the teacher in the subject matter?' },
    { category: 'Fairness in Grading', question: 'How fair is the teacher in grading student work?' },
    { category: 'Student Engagement', question: 'How well does the teacher engage students in learning activities?' },
    { category: 'Use of Technology', question: 'How effectively does the teacher use technology in teaching?' },
    { category: 'Professionalism', question: 'How professional is the teacher in their conduct and interactions?' },
    { category: 'Availability for Assistance', question: 'How available is the teacher for providing additional assistance?' },
  ];

  const options = [
    { value: '5', label: '5 - Excellent' },
    { value: '4', label: '4 - Very Good' },
    { value: '3', label: '3 - Satisfactory' },
    { value: '2', label: '2 - Needs Improvement' },
    { value: '1', label: '1 - Poor' },
  ];

  const handleResponseChange = (instructorId, category, value) => {
    setResponses((prev) => ({
      ...prev,
      [instructorId]: {
        ...prev[instructorId],
        [category]: value,
      },
    }));
  };

  const handleCommentChange = (instructorId, comment) => {
    setResponses((prev) => ({
      ...prev,
      [instructorId]: {
        ...prev[instructorId],
        comment,
      },
    }));
  };

  const isEvaluationComplete = () => {
    return instructors.every((instructor) =>
      questions.every((q) => responses[instructor.id]?.[q.category])
    );
  };

  const handleSubmit = async () => {
    if (!isEvaluationComplete()) return;

    console.log('Submitted Evaluations:', responses);
    alert('Evaluation submitted successfully!');
  };

  const totalPages = Math.ceil(instructors.length / itemsPerPage);
  const currentInstructors = instructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="p-4 dark:text-white dark:bg-gray-900 min-h-screen">
      {loading ? (
        <FullScreenLoader />
      ) : noInstructors ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Users className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Instructors Found
          </h2>
          <p className="text-red-500 text-center">
            There are currently no instructors assigned to your program and year level.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-[#1F3463] text-white text-center p-6 font-bold rounded-lg dark:bg-[#1F3463]">
            <h1 className="text-3xl">Instructor Evaluation</h1>
            <p className="text-gray-200 mt-2">
              Please evaluate each instructor based on the listed criteria. Your responses are confidential and will help improve teaching quality.
            </p>
          </div>

          <div className="mt-6">
            {currentInstructors.map((instructor) => (
              <div key={instructor.id} className="bg-white border dark:bg-gray-800 p-6 shadow-md rounded-lg mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Instructor Name: {instructor.name}
                </h2>

                <div className="mt-4 border-t pt-4 overflow-x-auto">
                  <table className="w-full border border-gray-300 dark:border-gray-700">
                    <tbody>
                      {questions.map((q, catIndex) => (
                        <React.Fragment key={catIndex}>
                          <tr className="bg-gray-100 dark:bg-gray-700">
                            <td
                              className="border border-gray-300 dark:border-gray-700 p-3 font-semibold text-gray-800 dark:text-white"
                              colSpan="3"
                            >
                              {catIndex + 1}. {q.category}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 dark:border-gray-700 p-3 text-gray-800 dark:text-white">
                              {q.question}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-700 p-3">
                              <select
                                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring focus:ring-blue-300"
                                value={responses[instructor.id]?.[q.category] || ''}
                                onChange={(e) =>
                                  handleResponseChange(instructor.id, q.category, e.target.value)
                                }
                              >
                                <option value="" disabled>Select Rating</option>
                                {options.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>

                  {/* Comment Box */}
                  <div className="mt-4">
                    <label htmlFor={`comment-${instructor.id}`} className="block text-gray-800 dark:text-white font-semibold">
                      Additional Comments:
                    </label>
                    <textarea
                      id={`comment-${instructor.id}`}
                      className="w-full p-2 mt-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                      rows="4"
                      value={responses[instructor.id]?.comment || ''}
                      onChange={(e) => handleCommentChange(instructor.id, e.target.value)}
                      placeholder="Provide additional feedback to help the instructor improve their teaching skills..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!isEvaluationComplete()}
              className={`px-6 py-2 rounded-lg transition-all ${
                isEvaluationComplete()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default SEvaluations;
