import React, { useState, useEffect } from "react";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";
import ProgramService from "../../../services/ProgramService";
import EvaluationService from "../../../services/EvaluationService"; // Added EvaluationService
import EvaluationFilterService from "../../../services/EvaluationFilterService"; // Added EvaluationFilterService
import InstructorService from "../../../services/InstructorService"; // Added InstructorService
import BulkSendModal from "../../../components/BulkSendModal";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useLoading } from "../../../components/LoadingContext";
import { Users, UserX, Loader2} from "lucide-react";

// Utility to map year level string/number to a number (1-4)
function mapYearLevelToNumber(yearLevel) {
  if (typeof yearLevel === "number") return yearLevel;
  if (!yearLevel) return 0;
  const str = yearLevel.toString().toLowerCase();
  if (str.includes("1")) return 1;
  if (str.includes("2")) return 2;
  if (str.includes("3")) return 3;
  if (str.includes("4")) return 4;
  return 0;
}

function Bab() {
  const [activeTab, setActiveTab] = useState(0);
  const [mergedInstructorsByYear, setMergedInstructorsByYear] = useState([[], [], [], []]);
  const [noInstructors, setNoInstructors] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0); // Added state for submitted count
  const [bulkSending, setBulkSending] = useState(false); // Added state for bulk sending
  const [bulkSendStatus, setBulkSendStatus] = useState(null); // Added state for bulk send status
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Added state for confirmation modal
  const [filters, setFilters] = useState({ // Added filters state
    schoolYear: '',
    semester: '',
    searchQuery: ''
  });
  const { loading, setLoading } = useLoading();

  const tabLabels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const programCode = "BAB";

  const schoolYearOptions = EvaluationFilterService.getSchoolYearOptions(); // Added schoolYearOptions
  const semesterOptions = EvaluationFilterService.getSemesterOptions(); // Added semesterOptions

  const handleFilterChange = (filterType, value) => { // Added handleFilterChange
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = (query) => { // Modified handleSearch
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

  const filterInstructors = (instructors, query) => { // Added filterInstructors
    if (!query) return instructors;
    return instructors.filter(instructor =>
      instructor.name.toLowerCase().includes(query.toLowerCase()) ||
      instructor.email.toLowerCase().includes(query.toLowerCase())
    );
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

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch filtered results and evaluation counts
      const [filteredResults, courseEvalCounts] = await Promise.all([ // Modified data fetching
        EvaluationFilterService.getFilteredResults(programCode, {
          schoolYear: filters.schoolYear,
          semester: filters.semester
        }),
        EvaluationService.getCourseEvaluationSubmissionCounts(),
      ]);

      if (!Array.isArray(filteredResults) || !Array.isArray(courseEvalCounts)) {
        throw new Error("Invalid data format received from one or more endpoints");
      }

      // Find the submitted count for the current programCode
      const currentCourseStats = courseEvalCounts.find(course => course.course_code === programCode);
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
        return yearInstructors.map(instructor => {
          const result = yearResults.find(r => r.name === instructor.name) || {};
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

  useEffect(() => { // Modified useEffect to include schoolYear and semester filters
    fetchData();
  }, [programCode, filters.schoolYear, filters.semester]);

  useEffect(() => { // Added useEffect for search query with debounce
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.searchQuery]);


  const hasInstructorsForYear = (year) => {
    return mergedInstructorsByYear[year]?.length > 0;
  };

  const hasInstructorsAssigned = () => {
    return mergedInstructorsByYear.some(yearGroup => yearGroup.length > 0);
  };

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Something went wrong
        </h2>
        <p className="text-red-500 text-center">
          We encountered an error while loading the data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <FullScreenLoader />
      ) : noInstructors || !hasInstructorsAssigned() ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Users className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Instructors Found
          </h2>
          <p className="text-red-500 text-center">
            There are currently no instructors assigned to any year level for BAB.
          </p>
        </div>
      ) : (
        <>
          <ContentHeader
            title="Instructors"
            stats={[`Submitted: ${submittedCount}`]}
            onSearch={handleSearch} // Added onSearch prop
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

export default Bab;
