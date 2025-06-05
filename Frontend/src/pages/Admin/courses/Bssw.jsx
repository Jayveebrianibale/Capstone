import React, { useState, useEffect } from "react";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";
import ProgramService from "../../../services/ProgramService";
import EvaluationService from "../../../services/EvaluationService"; // Added EvaluationService
import InstructorService from "../../../services/InstructorService"; // Added InstructorService
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useLoading } from "../../../components/LoadingContext";
import { Users, UserX, Loader2 } from "lucide-react"; 

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

function Bssw() {
  const [activeTab, setActiveTab] = useState(0);
  const [mergedInstructorsByYear, setMergedInstructorsByYear] = useState([[], [], [], []]);
  const [noInstructors, setNoInstructors] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0); // Added state for submitted count
  const [bulkSending, setBulkSending] = useState(false); // Added state for bulk sending
  const [bulkSendStatus, setBulkSendStatus] = useState(null); // Added state for bulk send status
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Added state for confirmation modal
  const { loading, setLoading } = useLoading();


  const tabLabels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const programCode = "BSSW";

  const handleSearch = (query) => {
    console.log("Search:", query);
  };

  const handleExport = () => {
    console.log("Export to PDF");
  };

  const handleAddInstructor = () => {
    console.log("Add Instructor");
  };

  const handleBulkSend = async () => { // Added handleBulkSend function
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
      // Improved error handling
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


  const fetchData = async () => {
    try {
      setLoading(true);
      const [instructorsData, resultsData, courseEvalCounts] = await Promise.all([
        ProgramService.getInstructorsByProgramCode(programCode),
        ProgramService.getInstructorResultsByProgram(programCode),
        EvaluationService.getCourseEvaluationSubmissionCounts(), // Fetch course evaluation counts
      ]);
  
      if (!Array.isArray(instructorsData) || !Array.isArray(resultsData) || !Array.isArray(courseEvalCounts)) {
        throw new Error("Invalid data format received from one or more endpoints");
      }
  
      // Find the submitted count for the current programCode
      const currentCourseStats = courseEvalCounts.find(course => course.course_code === programCode);
      if (currentCourseStats) {
        setSubmittedCount(currentCourseStats.submitted_count);
      } else {
        setSubmittedCount(0); // Default to 0 if not found
      }
      
      const groupByYear = (data) => {
        const grouped = [[], [], [], []];
        data.forEach((item) => {
          const yearLevel = item?.pivot?.yearLevel;
          const year = mapYearLevelToNumber(yearLevel);
          if (year >= 1 && year <= 4) grouped[year - 1].push(item);
        });
        return grouped;
      };
  
      const instructorsGrouped = groupByYear(instructorsData);
      const resultsGrouped = groupByYear(resultsData);
  
      const merged = instructorsGrouped.map((yearInstructors, yearIndex) => {
        const yearResults = resultsGrouped[yearIndex] || [];
        return yearInstructors.map(instructor => {
          const result = yearResults.find(r => r.name === instructor.name) || {};
          return { ...instructor, ...result };
        });
      });
  
      setMergedInstructorsByYear(merged);
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

  useEffect(() => {
    fetchData();
  }, [programCode, setLoading]);

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
            There are currently no instructors assigned to any year level for BSSW.
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
          />

          <div className="flex flex-col mt-4">
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
          </div>
        </>
      )}
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
      
            {/* Loading Overlay for Bulk Send */} {/* Added Loading Overlay */}
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
    
    export default Bssw;