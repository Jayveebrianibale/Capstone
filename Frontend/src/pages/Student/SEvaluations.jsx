import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import FullScreenLoader from '../../components/FullScreenLoader';
import { useLoading } from '../../components/LoadingContext';
import InstructorService from '../../services/InstructorService';
import { fetchQuestions } from '../../services/QuestionService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Evaluation from "../../assets/Evaluation.png";
import EvaluationService from '../../services/EvaluationService';

function SEvaluations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [instructors, setInstructors] = useState([]);
  const [responses, setResponses] = useState({});
  const [noInstructors, setNoInstructors] = useState(false);
  const { loading, setLoading } = useLoading();
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [expandedInstructorId, setExpandedInstructorId] = useState(null);
  const [submissionInfo, setSubmissionInfo] = useState({});
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [formReady, setFormReady] = useState(false);
  const [proceeded, setProceeded] = useState(false);


  const itemsPerPage = 5;

  const mapYearLevelToNumber = (yearLevel) => {
    if (typeof yearLevel === 'number') return yearLevel;
    switch (yearLevel) {
      case '1st Year': return 1;
      case '2nd Year': return 2;
      case '3rd Year': return 3;
      case '4th Year': return 4;
      default: return null;
    }
  };

  const schoolYears = ['2023-2024', '2024-2025', '2025-2026'];
  const semesters = ['1st Semester', '2nd Semester', 'Summer'];

  useEffect(() => {
  const storedYear = sessionStorage.getItem('selectedYear');
  const storedSemester = sessionStorage.getItem('selectedSemester');

  if (storedYear) setSelectedYear(storedYear);
  if (storedSemester) setSelectedSemester(storedSemester);
  if (storedYear && storedSemester) {
    setFormReady(true);
    fetchAssignedInstructors();
  }
}, []);


  useEffect(() => {
    const fetchEvaluationQuestions = async () => {
      setLoading(true);
      try {
        const fetchedQuestions = await fetchQuestions();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError('An error occurred while fetching evaluation questions');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationQuestions();
  }, [setLoading]);

  const fetchAssignedInstructors = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const programId = user?.program_id;
    const yearLevel = user?.yearLevel;

    if (!programId || !yearLevel) {
      setError('Program ID or Year Level is missing');
      return;
    }

    const yearLevelNumber = mapYearLevelToNumber(yearLevel);
    if (!yearLevelNumber) {
      setError('Invalid Year Level');
      return;
    }

    setLoading(true);
    try {
      const response = await InstructorService.getInstructorsByProgramAndYear(programId, yearLevelNumber);
      if (Array.isArray(response) && response.length > 0) {
        const instructorNames = response.map((instructor) => ({
          id: instructor.id,
          name: instructor.name,
        }));
        setInstructors(instructorNames);
        setNoInstructors(false);
      } else {
        setInstructors([]);
        setNoInstructors(true);
      }
    } catch (err) {
      console.error('Error fetching instructors:', err);
      setError('An error occurred while fetching instructors');
      setInstructors([]);
      setNoInstructors(true);
    } finally {
      setLoading(false);
    }
  };

  const handleYearSemesterSelect = () => {
    if (selectedYear && selectedSemester) {
      setFormReady(true);
      setProceeded(true);
      fetchAssignedInstructors();
    }
  };

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

  const isInstructorEvaluationComplete = (instructorId) => {
    return questions.every((q) => responses[instructorId]?.[q.category]);
  };

  const handleSubmit = async (instructorId) => {
    if (!isInstructorEvaluationComplete(instructorId)) return;

    const responseEntries = questions.map((q) => ({
      question_id: q.id,
      rating: parseInt(responses[instructorId][q.category]),
    }));

    const payload = {
      instructor_id: instructorId,
      comment: responses[instructorId]?.comment || '',
      responses: responseEntries,
      school_year: selectedYear,
      semester: selectedSemester,
    };

    try {
      const result = await InstructorService.submitEvaluation(payload);
      
      setSubmissionInfo((prev) => ({
        ...prev,
        [instructorId]: {
          status: result.status || result.message,
          evaluatedAt: result.evaluated_at,
        }
      }));

      toast.success(result.message || 'Evaluation submitted successfully!');
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast.error(error.response?.data?.message || 'Failed to submit evaluation. Please try again.');
    }
  };

  const totalPages = Math.ceil(instructors.length / itemsPerPage);
  const currentInstructors = instructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="p-4 dark:text-white dark:bg-gray-900 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div className="bg-[#1F3463] text-white text-center p-6 font-bold rounded-lg mb-5">
            <h1 className="text-3xl">Instructor Evaluation</h1>
            <p className="text-gray-200 mt-2">
              Please evaluate each instructor based on the listed criteria. Your responses are confidential and will help improve teaching quality.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                      School Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        sessionStorage.setItem('selectedYear', e.target.value);
                        if (e.target.value && selectedSemester) {
                          fetchAssignedInstructors();
                          setFormReady(true);
                        }
                      }}
                      disabled={formReady}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed transition"
                    >
                      <option value="">Select School Year</option>
                      {schoolYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                      Semester
                    </label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => {
                        setSelectedSemester(e.target.value);
                        sessionStorage.setItem('selectedSemester', e.target.value);
                        if (selectedYear && e.target.value) {
                          fetchAssignedInstructors();
                          setFormReady(true);
                        }
                      }}
                      disabled={formReady}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed transition"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((semester) => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

          {formReady ? (
            instructors.length === 0 ? (
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
                    {currentInstructors.map((instructor) => {
                      const isExpanded = expandedInstructorId === instructor.id;
                      const submission = submissionInfo[instructor.id];

                      return (
                        <React.Fragment key={instructor.id}>
                          <tr className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{instructor.name}</td>
                            <td className="px-6 py-4">
                              {submission?.status || 'Pending'}
                            </td>
                            <td className="px-6 py-4">
                              {submission?.evaluatedAt 
                                ? new Date(submission.evaluatedAt).toLocaleString() 
                                : '—'}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                className="bg-[#1F3463] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                onClick={() => setExpandedInstructorId(isExpanded ? null : instructor.id)}
                                disabled={submission?.status === 'Evaluated'}
                              >
                                {isExpanded ? 'Hide' : submission?.status === 'Evaluated' ? 'Completed' : 'Evaluate'}
                              </button>
                            </td>
                          </tr>

                          {isExpanded && (
                           <tr>
                            <td colSpan={4} className="bg-gray-50 dark:bg-gray-900 px-6 py-4">
                              <div className="space-y-6 border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">

                                {questions.map((q, idx) => (
                                  <div key={idx} className="space-y-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                                    <h3 className="font-semibold text-base text-gray-800 dark:text-white">{idx + 1}. {q.category}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{q.question}</p>
                                    <select
                                      className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                      value={responses[instructor.id]?.[q.category] || ''}
                                      onChange={(e) => handleResponseChange(instructor.id, q.category, e.target.value)}
                                      disabled={submission?.status === 'Evaluated'}
                                    >
                                      <option value="" disabled>Select Rating</option>
                                      {ratingOptions[q.category]?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                      ))}
                                    </select>
                                  </div>
                                ))}

                                <div className="space-y-2">
                                  <label className="block text-base font-semibold text-gray-900 dark:text-white">
                                    Additional Comments:
                                  </label>
                                  <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    rows="4"
                                    value={responses[instructor.id]?.comment || ''}
                                    onChange={(e) => handleCommentChange(instructor.id, e.target.value)}
                                    placeholder="Provide additional feedback..."
                                    disabled={submission?.status === 'Evaluated'}
                                  />
                                </div>

                                <div className="text-right">
                                  <button
                                    onClick={() => handleSubmit(instructor.id)}
                                    disabled={!isInstructorEvaluationComplete(instructor.id) || submission?.status === 'Evaluated'}
                                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                      isInstructorEvaluationComplete(instructor.id) && submission?.status !== 'Evaluated'
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    }`}
                                  >
                                    {submission?.status === 'Evaluated' ? 'Evaluation Submitted' : 'Submit Evaluation'}
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                          
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
              <div className="mb-6">
                <img 
                  src={Evaluation}
                  alt="Onboarding" 
                  className="mx-auto mb-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto" 
                />
              </div>
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Let's get started with your evaluation!
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Please select a school year and semester to begin your evaluation process.
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default SEvaluations;