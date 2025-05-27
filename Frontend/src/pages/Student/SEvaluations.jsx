import React from 'react';
import EvaluationHeader from '../../components/Student/EvaluationHeader';
import{ useState, useEffect } from 'react';
import FullScreenLoader from '../../components/FullScreenLoader';
import YearSemesterSelector from '../../components/Student/YearSemesterSelector';
import InstructorTable from '../../components/Student/InstructorTable';
import NoInstructorsFound from '../../components/Student/NoInstructorFound';
import OnboardingMessage from '../../components/Student/OnboardingMessage';
import { ToastContainer, toast } from 'react-toastify';
import InstructorService from '../../services/InstructorService';
import QuestionsService from '../../services/QuestionService';
import { useLoading } from '../../components/LoadingContext';

const SEvaluations = () => {
  const { loading, setLoading } = useLoading();
  const [schoolYears, setSchoolYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedYear, setSelectedYear] = useState(() => sessionStorage.getItem('selectedYear') || '');
  const [selectedSemester, setSelectedSemester] = useState(() => sessionStorage.getItem('selectedSemester') || '');
  const [formReady, setFormReady] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [currentInstructors, setCurrentInstructors] = useState([]);
  const [expandedInstructorId, setExpandedInstructorId] = useState(null);
  const [responses, setResponses] = useState(() => {
    const saved = sessionStorage.getItem('evaluationResponses');
    return saved ? JSON.parse(saved) : {};
  });
  const [savedEvaluations, setSavedEvaluations] = useState(() => {
    const saved = localStorage.getItem('savedEvaluations');
    return saved ? JSON.parse(saved) : {};
  });
  // ...
  useEffect(() => {
    localStorage.setItem('savedEvaluations', JSON.stringify(savedEvaluations));
  }, [savedEvaluations]);
  
  const [viewOnlyInstructorId, setViewOnlyInstructorId] = useState(null);
  const [noInstructors, setNoInstructors] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [submissionInfo, setSubmissionInfo] = useState(() => {
    const saved = sessionStorage.getItem('submissionInfo');
    return saved ? JSON.parse(saved) : {};
  });
  const [evaluationHistory, setEvaluationHistory] = useState(() => {
    const saved = sessionStorage.getItem('evaluationHistory');
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
    sessionStorage.setItem('evaluationResponses', JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    sessionStorage.setItem('selectedYear', selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    sessionStorage.setItem('selectedSemester', selectedSemester);
  }, [selectedSemester]);

  useEffect(() => {
    sessionStorage.setItem('evaluationHistory', JSON.stringify(evaluationHistory));
  }, [evaluationHistory]);

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
        const fetchedQuestions = await QuestionsService.getAll();
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

  // Add function to fetch existing evaluations
  const fetchExistingEvaluations = async () => {
    try {
      const response = await InstructorService.getEvaluations();
      if (response) {
        const evaluatedInstructors = {};
        const evaluationResponses = {};
        const history = {};
        
        // Handle the new response format
        Object.entries(response).forEach(([instructorId, evaluations]) => {
          if (evaluations && evaluations.length > 0) {
            const latestEvaluation = evaluations[0];
            evaluatedInstructors[instructorId] = {
              status: latestEvaluation.status || 'Evaluated',
              evaluatedAt: latestEvaluation.evaluated_at
            };
            
            // Store evaluation history with instructor details
            history[instructorId] = {
              schoolYear: latestEvaluation.school_year,
              semester: latestEvaluation.semester,
              evaluatedAt: latestEvaluation.evaluated_at,
              instructor: latestEvaluation.instructor,
              status: latestEvaluation.status
            };

            // If there are responses in the evaluation, store them
            if (latestEvaluation.responses) {
              evaluationResponses[instructorId] = latestEvaluation.responses.reduce((acc, response) => {
                // Try to reconstruct the label from the rating value and question category
                const question = questions.find(q => q.id === response.question_id);
                let label = '';
                if (question && response.rating) {
                  const opts = ratingOptions?.[question.category];
                  if (opts) {
                    const found = opts.find(opt => String(opt.value) === String(response.rating));
                    label = found ? found.label : '';
                  }
                }
                acc[response.question_id] = { rating: response.rating, label };
                return acc;
              }, {});
              evaluationResponses[instructorId].comment = latestEvaluation.comment;
            }
          }
        });

        setSubmissionInfo(evaluatedInstructors);
        setResponses(prevResponses => {
          const newResponseState = { ...prevResponses }; // Start with current state (contains sessionStorage data)
          
          // `evaluationResponses` is data derived from server for instructor responses.
          // `evaluatedInstructors` contains status from server for each instructor.
          for (const instructorId in evaluationResponses) {
            if (evaluatedInstructors[instructorId]?.status === 'Evaluated') {
              // If the server says this evaluation is complete, use the server's data for responses.
              newResponseState[instructorId] = evaluationResponses[instructorId];
            } else {
              // If server does not mark it as 'Evaluated' (e.g., 'Not Started', or no specific status from server for this evaluation):
              // We prefer existing data in newResponseState[instructorId] (which came from prevResponses/sessionStorage).
              // Only if there's no existing session data for this instructor,
              // and the server provides some initial data (though less likely for non-evaluated items),
              // would we consider using the server's data.
              if (!newResponseState[instructorId] && evaluationResponses[instructorId]) {
                // This case means: no in-session data, but server provided something (e.g. an old draft not marked 'Evaluated')
                newResponseState[instructorId] = evaluationResponses[instructorId];
              }
              // Otherwise (if newResponseState[instructorId] exists), the in-session data is preserved.
            }
          }
          // Instructors in prevResponses but not in evaluationResponses are preserved by the initial spread.
          return newResponseState;
        });
        setEvaluationHistory(history);

        // If there are existing evaluations, set the year and semester
        if (Object.keys(history).length > 0) {
          const firstEvaluation = Object.values(history)[0];
          setSelectedYear(firstEvaluation.schoolYear);
          setSelectedSemester(firstEvaluation.semester);
          setFormReady(true);
        }

        // Update instructors list with evaluation history
        setInstructors(prevInstructors => 
          prevInstructors.map(instructor => ({
            ...instructor,
            status: evaluatedInstructors[instructor.id]?.status || 'Not Started',
            submittedAt: evaluatedInstructors[instructor.id]?.evaluatedAt || null,
            evaluationHistory: history[instructor.id] || null
          }))
        );
        setCurrentInstructors(prevInstructors => 
          prevInstructors.map(instructor => ({
            ...instructor,
            status: evaluatedInstructors[instructor.id]?.status || 'Not Started',
            submittedAt: evaluatedInstructors[instructor.id]?.evaluatedAt || null,
            evaluationHistory: history[instructor.id] || null
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching existing evaluations:', error);
      toast.error('Error fetching evaluation history');
    }
  };

  // Add useEffect to check user data on component mount
  useEffect(() => {
    const checkUserData = () => {
      const userData = sessionStorage.getItem('user');
      if (!userData) {
        setError('User data not found. Please log in again.');
        toast.error('User data not found. Please log in again.');
        setLoading(false);
        return false;
      }
      return true;
    };

    if (checkUserData()) {
      fetchExistingEvaluations();
    }
  }, []);

  const mapYearLevelToNumber = (yearLevel) => {
    if (typeof yearLevel === 'number') return yearLevel;
    
    // Convert to string and lowercase for consistent comparison
    const level = String(yearLevel).toLowerCase().trim();
    
    switch (level) {
      case '1st year':
      case 'first year':
      case '1':
        return 1;
      case '2nd year':
      case 'second year':
      case '2':
        return 2;
      case '3rd year':
      case 'third year':
      case '3':
        return 3;
      case '4th year':
      case 'fourth year':
      case '4':
        return 4;
      default:
        console.log('Invalid year level:', yearLevel); // For debugging
        return null;
    }
  };

  const fetchAssignedInstructors = async () => {
    try {
      // Get user data from sessionStorage instead of localStorage
      const userData = sessionStorage.getItem('user');
      if (!userData) {
        setError('User data not found. Please log in again.');
        toast.error('User data not found. Please log in again.');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      console.log('User data:', user); // For debugging

      // Check if required fields exist
      if (!user.program_id) {
        setError('Program ID is missing from user data');
        toast.error('Program ID is missing from user data');
        setLoading(false);
        return;
      }

      if (!user.yearLevel) {
        setError('Year Level is missing from user data');
        toast.error('Year Level is missing from user data');
        setLoading(false);
        return;
      }

      const yearLevelNumber = mapYearLevelToNumber(user.yearLevel);
      if (!yearLevelNumber) {
        setError('Invalid Year Level format');
        toast.error('Invalid Year Level format');
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await InstructorService.getInstructorsByProgramAndYear(user.program_id, yearLevelNumber);
      
      if (Array.isArray(response) && response.length > 0) {
        const mergedInstructors = response.map((instructor) => {
          const history = evaluationHistory[instructor.id];
          return {
            ...instructor,
            status: history ? 'Evaluated' : (submissionInfo[instructor.id]?.status || 'Not Started'),
            submittedAt: history?.evaluatedAt || submissionInfo[instructor.id]?.evaluatedAt || null,
            evaluationHistory: history
          };
        });
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

  const handleResponseChange = (instructorId, questionId, value, label) => {
    setResponses((prev) => ({
      ...prev,
      [instructorId]: {
        ...prev[instructorId],
        [questionId]: {
          ...(prev[instructorId]?.[questionId] || {}),
          rating: value,
          label: label,
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
    // Check if all questions have a rating (comment is optional)
    const missing = questions.some(q => !evaluationData || !evaluationData[q.id] || !evaluationData[q.id].rating);
    if (missing) {
      toast.error('Please answer all the questions before saving.');
      return;
    }
    // Save both status and all ratings/labels for this instructor
    setSavedEvaluations((prev) => {
      const updated = {
        ...prev,
        [instructorId]: {
          status: 'Done',
          ratings: Object.entries(evaluationData)
            .filter(([key]) => key !== 'comment')
            .reduce((acc, [questionId, val]) => {
              acc[questionId] = { rating: val.rating, label: val.label };
              return acc;
            }, {}),
          comment: evaluationData.comment || '',
        },
      };
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
      const updatedHistory = { ...evaluationHistory };

      result.submissions.forEach((submission) => {
        updatedInfo[submission.instructor_id] = {
          status: 'Evaluated',
          evaluatedAt: submission.submitted_at || evaluatedAt,
        };

        // Update evaluation history
        updatedHistory[submission.instructor_id] = {
          schoolYear: selectedYear,
          semester: selectedSemester,
          evaluatedAt: submission.submitted_at || evaluatedAt,
          responses: responses[submission.instructor_id],
          comment: responses[submission.instructor_id]?.comment || ''
        };
      });

      // Ensure responses are updated for view mode after submit
      setResponses((prev) => {
        const updated = { ...prev };
        result.submissions.forEach((submission) => {
          updated[submission.instructor_id] = {
            ...responses[submission.instructor_id],
          };
        });
        return updated;
      });

      setSubmissionInfo(updatedInfo);
      setEvaluationHistory(updatedHistory);
      
      // Update the instructors list to reflect the new evaluation status
      setInstructors(prevInstructors => 
        prevInstructors.map(instructor => ({
          ...instructor,
          status: updatedInfo[instructor.id]?.status || instructor.status,
          submittedAt: updatedInfo[instructor.id]?.evaluatedAt || instructor.submittedAt,
          evaluationHistory: updatedHistory[instructor.id] || instructor.evaluationHistory
        }))
      );
      setCurrentInstructors(prevInstructors => 
        prevInstructors.map(instructor => ({
          ...instructor,
          status: updatedInfo[instructor.id]?.status || instructor.status,
          submittedAt: updatedInfo[instructor.id]?.evaluatedAt || instructor.submittedAt,
          evaluationHistory: updatedHistory[instructor.id] || instructor.evaluationHistory
        }))
      );

      toast.success('All evaluations submitted successfully!');
    } catch (err) {
      console.error('Error submitting all evaluations:', err);
      
      if (err.response?.status === 409) {
        const evaluatedInstructors = err.response.data.evaluated_instructors;
        const instructorNames = currentInstructors
          .filter(instructor => evaluatedInstructors.includes(instructor.id))
          .map(instructor => instructor.name)
          .join(', ');

        toast.error(
          `You have already evaluated the following instructors: ${instructorNames}. Please remove them from your submission.`
        );
      } else {
        const errorMessage = err?.response?.data?.message || err.message;
        toast.error(errorMessage || 'An error occurred while submitting evaluations.');
      }
    }
  };

  const handleSelectionChange = (year, semester) => {
    setSelectedYear(year);
    setSelectedSemester(semester);
    setFormReady(year && semester);
  };

  // Handler to expand instructor and always pre-fill responses from savedEvaluations if available
  const handleExpandInstructor = (instructorId) => {
    // Always restore from savedEvaluations when opening the form (Edit or View)
    if (savedEvaluations[instructorId]) {
      const { ratings = {}, comment = '' } = savedEvaluations[instructorId];
      const newResponses = { ...ratings, comment };
      setResponses((prev) => ({
        ...prev,
        [instructorId]: newResponses,
      }));
    }
    setExpandedInstructorId(instructorId);
  };

  return (
    <main className="p-4 dark:text-white dark:bg-gray-900 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <FullScreenLoader />
      ) : (
        <>
          <EvaluationHeader/>

          {!Object.values(submissionInfo).some(info => info.status === 'Evaluated') && (
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
              submissionInfo={submissionInfo}
            />
          )}

          {formReady ? (
            noInstructors ? (
              <NoInstructorsFound />
            ) : (
              <InstructorTable
                instructors={currentInstructors}
                expandedInstructorId={expandedInstructorId}
                setExpandedInstructorId={handleExpandInstructor}
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
