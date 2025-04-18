import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SEvaluations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const itemsPerPage = 5;

  useEffect(() => {
  const fetchInstructors = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const programId = user?.program_id;
      const yearLevel = user?.year_level;

      if (!programId || !yearLevel) {
        console.error('Program ID or Year Level missing');
        return;
      }

      const response = await axios.get('/api/instructors/by-course', {
        params: {
          program_id: programId,
          year_level: yearLevel,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (Array.isArray(response.data)) {
        setInstructors(response.data);
      } else {
        setInstructors([]);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  fetchInstructors();
}, []);


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
  const handleChangePage = (page) => setCurrentPage(page);

  const currentInstructors = instructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="p-4 dark:text-white dark:bg-gray-900 min-h-screen">
      {!loading && instructors.length > 0 && (
        <div className="bg-white text-center dark:bg-gray-800 p-6 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Instructor Evaluation</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Please evaluate each instructor based on the listed criteria. Your responses are confidential and will help improve teaching quality.
          </p>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-center">Loading instructors...</p>
        ) : currentInstructors.length > 0 ? (
          currentInstructors.map((instructor) => (
            <div key={instructor.id} className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Name: {instructor.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Course: {instructor.course_name || 'Unknown'}
              </p>

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
                              <option value="" disabled>
                                Select Rating
                              </option>
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
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-center pt-40 text-gray-500 text-xl">No instructors found.</p>
          </div>
        )}
      </div>

      {!loading && instructors.length > 0 && (
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
      )}
    </main>
  );
}

export default SEvaluations;
