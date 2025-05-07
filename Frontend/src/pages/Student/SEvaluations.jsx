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
  const [selectedYear, setSelectedYear] = useState(() => sessionStorage.getItem('selectedYear') || '');
  const [selectedSemester, setSelectedSemester] = useState(() => sessionStorage.getItem('selectedSemester') || '');
  const [formReady, setFormReady] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [currentInstructors, setCurrentInstructors] = useState([]);
  const [expandedInstructorId, setExpandedInstructorId] = useState(null);
  const [responses, setResponses] = useState({});
  const [savedEvaluations, setSavedEvaluations] = useState(() => {
    const saved = sessionStorage.getItem('savedEvaluations');
    return saved ? JSON.parse(saved) : {};
  });
  const [viewOnlyInstructorId, setViewOnlyInstructorId] = useState(null);
  const [noInstructors, setNoInstructors] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [submissionInfo, setSubmissionInfo] = useState(() => {
    const saved = sessionStorage.getItem('submissionInfo');
    return saved ? JSON.parse(saved) : {};
  });

  // Sync to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('submissionInfo', JSON.stringify(submissionInfo));
  }, [submissionInfo]);

  useEffect(() => {
    sessionStorage.setItem('savedEvaluations', JSON.stringify(savedEvaluations));
  }, [savedEvaluations]);

  useEffect(() => {
    sessionStorage.setItem('selectedYear', selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    sessionStorage.setItem('selectedSemester', selectedSemester);
  }, [selectedSemester]);

  // Initialize school years and semesters
  useEffect(() => {
    setSchoolYears(['2023-2024', '2024-2025']);
    setSemesters(['1st Semester', '2nd Semester']);
    setLoading(false);
  }, []);

  // Fetch questions once
  useEffect(() => {
    const getQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestions();
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        toast.error('Error fetching questions.');
      }
    };
    getQuestions();
  }, []);

  // Fetch instructors when year/semester change and form is ready
  useEffect(() => {
    if (selectedYear && selectedSemester) {
      setFormReady(true);
      fetchAssignedInstructors();
    }
  }, [selectedYear, selectedSemester]);

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
      const response = await InstructorService.getInstructorsByProgramAndYear(programId, yearLevelNumber);
      if (Array.isArray(response) && response.length > 0) {
        const mergedInstructors = response.map((instructor) => ({
          ...instructor,
          status: submissionInfo[instructor.id]?.status || 'Not Started',
          submittedAt: submissionInfo[instructor.id]?.evaluatedAt || null,
        }));
        setInstructors(mergedInstructors);
        setCurrentInstructors(mergedInstructors);
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

  const handleCommentChange = (instructorId, value) => {
    setResponses((prev) => ({
      ...prev,
      [instructorId]: {
        ...prev[instructorId],
        comment: value,
      },
    }));
  };

  const handleSaveEvaluation = (instructorId) => {
    const evaluationData = responses[instructorId];
    if (!evaluationData) {
      toast.error('Please answer the questions before saving.');
      return;
    }

    setSavedEvaluations((prev) => {
      const updated = { ...prev, [instructorId]: 'Done' };
      return updated;
    });

    toast.success("Evaluation saved! Don't forget to submit All.");
    setExpandedInstructorId(null);
  };

  const handleSubmitAll = async () => {
    const savedIds = Object.keys(savedEvaluations);

    if (savedIds.length === 0) {
      toast.error('No saved evaluations to submit');
      return;
    }

    try {
      const evaluations = savedIds.map((instructorId) => {
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

        return {
          instructor_id: parseInt(instructorId),
          comment: responses[instructorId]?.comment || '',
          responses: responseEntries,
        };
      });

      const payload = {
        school_year: selectedYear,
        semester: selectedSemester,
        evaluations,
      };

      const result = await InstructorService.submitAllEvaluations(payload);

      const evaluatedAt = new Date().toISOString();
      const updatedInfo = { ...submissionInfo };

      result.submissions.forEach((submission) => {
        updatedInfo[submission.instructor_id] = {
          status: 'Evaluated',
          evaluatedAt: submission.submitted_at || evaluatedAt,
        };
      });

      setSubmissionInfo(updatedInfo);
      setSavedEvaluations({});
      sessionStorage.removeItem('savedEvaluations');

      toast.success('All evaluations submitted successfully!');
    } catch (err) {
      console.error('Error submitting all evaluations:', err);
      const errorMessage = err?.response?.data?.message || err.message;
      toast.error(errorMessage || 'An error occurred while submitting evaluations.');
    }
  };

  const handleSelectionChange = (year, semester) => {
    setSelectedYear(year);
    setSelectedSemester(semester);
    setFormReady(year && semester);
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
                submissionInfo={submissionInfo}
                viewOnlyInstructorId={viewOnlyInstructorId}
                setViewOnlyInstructorId={setViewOnlyInstructorId}
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
