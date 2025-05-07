import React, { useState, useEffect } from 'react';
import FullScreenLoader from '../../components/FullScreenLoader';
import YearSemesterSelector from '../../components/Student/YearSemesterSelector';
import InstructorTable from '../../components/Student/InstructorTable';
import NoInstructorsFound from '../../components/Student/NoInstructorFound';
import OnboardingMessage from '../../components/Student/OnboardingMessage';
import { ToastContainer, toast } from 'react-toastify';
import InstructorService from '../../services/InstructorService';
import { fetchQuestions } from '../../services/QuestionService';

const SEvaluations = () => {
  const [loading, setLoading] = useState(true);
  const [schoolYears, setSchoolYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedYear, setSelectedYear] = useState(() => 
    sessionStorage.getItem('selectedYear') || ''
  );
  const [selectedSemester, setSelectedSemester] = useState(() => 
    sessionStorage.getItem('selectedSemester') || ''
  );
  const [formReady, setFormReady] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [currentInstructors, setCurrentInstructors] = useState([]);
  const [expandedInstructorId, setExpandedInstructorId] = useState(null);
  const [responses, setResponses] = useState({});
  const [savedEvaluations, setSavedEvaluations] = useState({});
  const [noInstructors, setNoInstructors] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [submissionInfo, setSubmissionInfo] = useState({});

  useEffect(() => {
    setSchoolYears(['2023-2024', '2024-2025']);
    setSemesters(['1st Semester', '2nd Semester']);
    setLoading(false);
  }, []);

  useEffect(() => {
    const initializeComponent = async () => {
      if (selectedYear && selectedSemester) {
        setFormReady(true);
        await fetchAssignedInstructors();
      }
    };
    initializeComponent();
  }, []);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestions();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Error fetching questions.');
      }
    };
    getQuestions();
  }, []);

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

  const fetchAssignedInstructors = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const programId = user?.program_id;
    const yearLevel = user?.yearLevel;

    if (!programId || !yearLevel) {
      setError('Program ID or Year Level is missing');
      toast.error('Program ID or Year Level is missing');
      return;
    }

    const yearLevelNumber = mapYearLevelToNumber(yearLevel);
    if (!yearLevelNumber) {
      setError('Invalid Year Level');
      toast.error('Invalid Year Level');
      return;
    }

    setLoading(true);
    try {
      const response = await InstructorService.getInstructorsByProgramAndYear(
        programId,
        yearLevelNumber
      );
      if (Array.isArray(response) && response.length > 0) {
        setInstructors(response);
        setCurrentInstructors(response);
        setNoInstructors(false);
      } else {
        setInstructors([]);
        setCurrentInstructors([]);
        setNoInstructors(true);
      }
    } catch (err) {
      console.error('Error fetching instructors:', err);
      setError('An error occurred while fetching instructors');
      toast.error('Error fetching instructors');
      setInstructors([]);
      setCurrentInstructors([]);
      setNoInstructors(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (instructorId, questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [instructorId]: {
        ...prev[instructorId],
        [questionId]: {
          ...(prev[instructorId]?.[questionId] || {}),
          rating: value,
        },
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

  const handleSaveEvaluation = (instructorId) => {
    const evaluationData = responses[instructorId];
    if (!evaluationData) {
      toast.error('Please answer the questions before saving.');
      return;
    }

    setSavedEvaluations((prev) => ({ ...prev, [instructorId]: true }));
    toast.success('Evaluation saved! Don\'t forget to submit All.');
    setExpandedInstructorId(null);
  };

  const handleSubmitAll = async () => {
    if (Object.keys(savedEvaluations).length === 0) {
      toast.error('No saved evaluations to submit');
      return;
    }

    try {
      for (const instructorId of Object.keys(savedEvaluations)) {
        if (!savedEvaluations[instructorId]) continue;

        const responseEntries = questions.map((q) => {
          const rating = parseInt(responses[instructorId]?.[q.id]?.rating);
          if (isNaN(rating)) {
            throw new Error(`Incomplete answers for instructor ${instructorId}`);
          }
          return {
            question_id: q.id,
            rating: rating,
          };
        });

        const payload = {
          instructor_id: instructorId,
          comment: responses[instructorId]?.comment || '',
          responses: responseEntries,
          school_year: selectedYear,
          semester: selectedSemester,
        };

        const result = await InstructorService.submitEvaluation(payload);
        const evaluatedAt = new Date().toISOString();

        setSubmissionInfo((prev) => ({
          ...prev,
          [instructorId]: {
            status: result.status || 'Evaluated',
            evaluatedAt: result.evaluated_at || evaluatedAt,
          },
        }));
      }

      toast.success('All evaluations submitted successfully!');
    } catch (err) {
      console.error('Error submitting evaluations:', err);
      toast.error(err.message || 'An error occurred while submitting evaluations.');
    }
  };

  const handleSelectionChange = (year, semester) => {
    if (year && semester) {
      setFormReady(true);
      fetchAssignedInstructors();
    }
  };

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
              Please evaluate each instructor based on the listed criteria.
            </p>
          </div>

          <YearSemesterSelector
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            setFormReady={setFormReady}
            fetchAssignedInstructors={fetchAssignedInstructors}
            schoolYears={schoolYears}
            semesters={semesters}
            onSelectionChange={handleSelectionChange}
          />

          {formReady ? (
            noInstructors ? (
              <NoInstructorsFound />
            ) : (
              <InstructorTable
                instructors={currentInstructors}
                expandedInstructorId={expandedInstructorId}
                setExpandedInstructorId={setExpandedInstructorId}
                responses={responses}
                handleResponseChange={handleResponseChange}
                handleCommentChange={handleCommentChange}
                handleSaveEvaluation={handleSaveEvaluation}
                savedEvaluations={savedEvaluations}
                handleSubmitAll={handleSubmitAll}
                questions={questions}
              />
            )
          ) : (
            <OnboardingMessage />
          )}
        </>
      )}
    </main>
  );
};

export default SEvaluations;