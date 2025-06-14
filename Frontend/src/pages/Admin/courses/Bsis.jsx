import React, { useState, useEffect } from "react";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";
import ProgramService from "../../../services/ProgramService";
import EvaluationService from "../../../services/EvaluationService";
import EvaluationFilterService from "../../../services/EvaluationFilterService";
import { toast } from "react-toastify";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useLoading } from "../../../components/LoadingContext";
import { Users, UserPlus, UserX, Loader2 } from "lucide-react"; 
import InstructorService from "../../../services/InstructorService";
import BulkSendModal from "../../../components/BulkSendModal";
import { ToastContainer } from "react-toastify";
import QuestionsService from "../../../services/QuestionService";

function Bsis() {
  const [activeTab, setActiveTab] = useState(0);
  const [mergedInstructorsByYear, setMergedInstructorsByYear] = useState([[], [], [], []]);
  const [noInstructors, setNoInstructors] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkSendStatus, setBulkSendStatus] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    schoolYear: '',
    semester: '',
    searchQuery: ''
  });

  const tabLabels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const programCode = "BSIS";
  const { loading, setLoading } = useLoading();

  const schoolYearOptions = EvaluationFilterService.getSchoolYearOptions();
  const semesterOptions = EvaluationFilterService.getSemesterOptions();

  const mapYearLevelToNumber = (yearLevel) => {
    if (typeof yearLevel === "number") return yearLevel;
    const level = String(yearLevel).toLowerCase().trim();
    switch (level) {
      case "1st year":
      case "first year":
      case "1":
        return 1;
      case "2nd year":
      case "second year":
      case "2":
        return 2;
      case "3rd year":
      case "third year":
      case "3":
        return 3;
      case "4th year":
      case "fourth year":
      case "4":
        return 4;
      default:
        console.log("Invalid year level:", yearLevel);
        return null;
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = (query) => {
    handleFilterChange('searchQuery', query);
  };

  const handleExport = () => {
    console.log("Export to PDF");
    // Implement export functionality here
  };

  const handleAddInstructor = () => {
    console.log("Add Instructor");
    // Implement add instructor functionality here
  };

  const filterInstructors = (instructors, query) => {
    if (!query) return instructors;
    return instructors.filter(instructor => 
      instructor.name.toLowerCase().includes(query.toLowerCase()) ||
      instructor.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchError(false); // Reset error state at start of fetch

      // Fetch filtered results and evaluation counts
      const [filteredResults, courseEvalCounts] = await Promise.all([
        EvaluationFilterService.getFilteredResults(programCode, {
          schoolYear: filters.schoolYear,
          semester: filters.semester
        }),
        EvaluationService.getCourseEvaluationSubmissionCounts(),
      ]);

      // Find the submitted count for the current programCode
      const currentCourseStats = courseEvalCounts.find((course) => course.course_code === programCode);
      setSubmittedCount(currentCourseStats ? currentCourseStats.submitted_count : 0);

      // Fetch instructors to merge with filtered results
      const instructorsData = await ProgramService.getInstructorsByProgramCode(programCode);

      // Handle no instructors case
      if (!instructorsData || instructorsData.length === 0) {
        setNoInstructors(true);
        setMergedInstructorsByYear([[], [], [], []]);
        setLoading(false);
        return;
      }

      const groupByYear = (data) => {
        const grouped = [[], [], [], []];
        console.log('Starting groupByYear with data:', JSON.stringify(data, null, 2));
        
        data.forEach((item) => {
          if (!item || !item.pivot || !Array.isArray(item.pivot.assignments)) {
            console.log('Invalid item data:', item);
            return;
          }

          // Process each assignment for this instructor
          item.pivot.assignments.forEach((assignment) => {
            const yearLevel = parseInt(assignment.yearLevel, 10);
            console.log(`Processing assignment for ${item.name}:`, {
              yearLevel,
              assignment: JSON.stringify(assignment, null, 2)
            });
            
            if (isNaN(yearLevel) || yearLevel < 1 || yearLevel > 4) {
              console.log(`Invalid year level for instructor ${item.name}:`, yearLevel);
              return;
            }

            // Create instructor object for this assignment
            const instructor = {
              id: item.id,
              name: item.name,
              email: item.email,
              status: item.status,
              educationLevel: item.educationLevel,
              yearLevel: yearLevel,
              program: assignment.program_name || `Year ${yearLevel}`,
              pivot: {
                yearLevel: yearLevel,
                program_id: assignment.program_id,
                program_name: assignment.program_name || `Year ${yearLevel}`
              },
              ratings: item.ratings || {
                q1: null,
                q2: null,
                q3: null,
                q4: null,
                q5: null,
                q6: null,
                q7: null,
                q8: null,
                q9: null
              },
              comments: item.comments || "No comments",
              overallRating: item.overallRating || 0
            };

            console.log(`Created instructor object for ${item.name} in year ${yearLevel}:`, JSON.stringify(instructor, null, 2));

            // Place in correct group based on actual year number
            if (yearLevel >= 1 && yearLevel <= 4) {
              console.log(`Adding ${item.name} to Year ${yearLevel} group`);
              grouped[yearLevel - 1].push(instructor);
            }
          });
        });

        // Log the grouped data for debugging
        console.log('Final grouped instructors:', JSON.stringify(grouped, null, 2));
        return grouped;
      };

      // Merge instructors with filtered results
      const merged = instructorsData.map(instructor => {
          const result = filteredResults.find(r => r.id === instructor.id || r.name === instructor.name) || {};
          // Preserve the original pivot.assignments from the API
          return { 
              ...instructor,
              ...result,
              pivot: instructor.pivot // Keep the original pivot with assignments
          };
      });

      console.log("Merged Data before Grouping:", JSON.stringify(merged, null, 2));

      const mergedGrouped = groupByYear(merged);

      console.log("Merged Data after Grouping:", mergedGrouped);

      // Apply search filter
      const filteredMerged = mergedGrouped.map(yearGroup =>
        filterInstructors(yearGroup, filters.searchQuery)
      );

      setMergedInstructorsByYear(filteredMerged);
      setNoInstructors(instructorsData.length === 0);
    } catch (error) {
      console.error("Data fetch failed:", error);
      setFetchError(true);
      setNoInstructors(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSend = async () => {
    setBulkSending(true);
    try {
      const allInstructors = mergedInstructorsByYear.flat();
      
      if (allInstructors.length === 0) {
        toast.warning("No instructors found for this program");
        setBulkSending(false);
        setShowConfirmModal(false);
        return;
      }

      const response = await InstructorService.sendBulkResults(programCode, {
        instructorIds: allInstructors.map(instructor => instructor.id)
      });
      
      setBulkSendStatus(response);
      toast.success(
        `Successfully sent results to ${response.sent_count} instructors`,
        { autoClose: 5000 }
      );
      
      if (response.failed_count > 0) {
        toast.warning(
          `Failed to send to ${response.failed_count} instructors`,
          { autoClose: 7000 }
        );
        console.log("Failed emails:", response.failed_emails);
      }
    } catch (err) {
      console.error("Bulk send error:", err);
      
      if (err.sent_count !== undefined) {
        setBulkSendStatus(err);
        toast.success(
          `Sent to ${err.sent_count} instructors (${err.failed_count} failed)`,
          { autoClose: 5000 }
        );
      } else {
        toast.error(
          err.message || "Failed to perform bulk send operation",
          { autoClose: 5000 }
        );
      }
    } finally {
      setBulkSending(false);
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [programCode, filters.schoolYear, filters.semester]);

  useEffect(() => {
    // Debounce search to prevent too many requests
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await QuestionsService.getAll();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load questions");
      }
    };

    fetchQuestions();
  }, []);

  const hasInstructorsForYear = (year) => mergedInstructorsByYear[year]?.length > 0;
  const hasInstructorsAssigned = () => mergedInstructorsByYear.some((yearGroup) => yearGroup.length > 0);

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <FullScreenLoader />
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Users className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Instructors Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            There are currently no instructors assigned to any year level for BSIS.
          </p>
        </div>
      ) : noInstructors ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Users className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Instructors Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            There are currently no instructors assigned to any year level for BSIS.
          </p>
        </div>
      ) : (
        <>
          <ContentHeader
            title="Instructors"
            stats={[`Submitted: ${submittedCount}`]}
            onSearch={handleSearch}
            onExport={handleExport}
            onAdd={handleAddInstructor}
            onBulkSend={() => setShowConfirmModal(true)}
            onSchoolYearChange={(value) => handleFilterChange('schoolYear', value)}
            onSemesterChange={(value) => handleFilterChange('semester', value)}
            selectedSchoolYear={filters.schoolYear}
            selectedSemester={filters.semester}
            schoolYearOptions={schoolYearOptions}
            semesterOptions={semesterOptions}
          />

          <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-4">
            {hasInstructorsForYear(activeTab) ? (
              <InstructorTable 
                instructors={mergedInstructorsByYear[activeTab]} 
                questions={questions}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                  <UserX className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No Instructors Assigned
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  There are no instructors assigned to {tabLabels[activeTab]} yet.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Bulk Send Modal */}
      <BulkSendModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleBulkSend}
        programCode={programCode}
        instructors={mergedInstructorsByYear.flat()}
        isSending={bulkSending}
        showLoadingOverlay={bulkSending}
      />
    </main>
  );
}

export default Bsis;