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

function Bsis() {
  const [activeTab, setActiveTab] = useState(0);
  const [mergedInstructorsByYear, setMergedInstructorsByYear] = useState([[], [], [], []]);
  const [noInstructors, setNoInstructors] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkSendStatus, setBulkSendStatus] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
      
      // Fetch filtered results
      const [filteredResults, courseEvalCounts] = await Promise.all([
        EvaluationFilterService.getFilteredResults(programCode, {
          schoolYear: filters.schoolYear,
          semester: filters.semester
        }),
        EvaluationService.getCourseEvaluationSubmissionCounts(),
      ]);

      const currentCourseStats = courseEvalCounts.find((course) => course.course_code === programCode);
      setSubmittedCount(currentCourseStats ? currentCourseStats.submitted_count : 0);

      const groupByYear = (data) => {
        const grouped = [[], [], [], []];
        data.forEach((item) => {
          const yearLevel = item?.pivot?.yearLevel;
          const year = mapYearLevelToNumber(yearLevel);
          if (year >= 1 && year <= 4) grouped[year - 1].push(item);
        });
        return grouped;
      };

      const resultsGrouped = groupByYear(filteredResults);

      // Fetch instructors to merge with filtered results
      const instructorsData = await ProgramService.getInstructorsByProgramCode(programCode);
      const instructorsGrouped = groupByYear(instructorsData);

      const merged = instructorsGrouped.map((yearInstructors, yearIndex) => {
        const yearResults = resultsGrouped[yearIndex] || [];
        return yearInstructors.map((instructor) => {
          const result = yearResults.find((r) => r.name === instructor.name) || {};
          return { ...instructor, ...result };
        });
      });

      // Apply search filter
      const filteredMerged = merged.map(yearGroup => 
        filterInstructors(yearGroup, filters.searchQuery)
      );

      setMergedInstructorsByYear(filteredMerged);
      setNoInstructors(instructorsData.length === 0);
    } catch (error) {
      console.error("Data fetch failed:", error);
      if (error?.response?.status === 404) {
        setNoInstructors(true);
        toast.info("No instructors found for this program.");
      } else {
        toast.error("Failed to load instructor data");
        setFetchError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSend = async () => {
    setShowConfirmModal(false);
    setBulkSending(true);
    try {
      const response = await InstructorService.sendBulkResults(programCode);
      
      // Success case - show success message
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
        // This is actually a success case but was caught as error
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

  const hasInstructorsForYear = (year) => mergedInstructorsByYear[year]?.length > 0;
  const hasInstructorsAssigned = () => mergedInstructorsByYear.some((yearGroup) => yearGroup.length > 0);

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      {loading ? (
        <FullScreenLoader />
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-500 text-center">
            We encountered an error while loading the data. Please try again later.
          </p>
        </div>
      ) : noInstructors || !hasInstructorsAssigned() ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Users className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Instructors Found
          </h2>
          <p className="text-red-500 text-center">
            There are currently no instructors assigned to any year level for BSIS.
          </p>
        </div>
      ) : (
        <>
          <ContentHeader
            title="Instructors"
            stats={[`Submitted: ${submittedCount}`]}
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
              <InstructorTable instructors={mergedInstructorsByYear[activeTab]} />
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Confirm Bulk Send
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to send results to all instructors in this program?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                disabled={bulkSending}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSend}
                className={`px-4 py-2 flex items-center justify-center gap-2 ${
                  bulkSending
                    ? "bg-blue-600 cursor-not-allowed"
                    : "bg-[#1F3463] hover:bg-blue-700"
                } text-white rounded transition-colors min-w-[80px]`}
                disabled={bulkSending}
              >
                {bulkSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay for Bulk Send */}
      {bulkSending && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#1F3463] mb-4" />
            <p className="text-gray-700 dark:text-gray-300">
              Sending results to all instructors...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This may take a few moments
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default Bsis;