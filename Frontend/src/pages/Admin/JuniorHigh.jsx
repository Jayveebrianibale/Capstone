import React, { useState, useEffect } from "react";
import InstructorTable from "../../contents/Admin/InstructorTable";
import Tabs from "../../components/Tabs";
import ContentHeader from "../../contents/Admin/ContentHeader";
import ProgramService from "../../services/ProgramService";
import EvaluationService from "../../services/EvaluationService";
import EvaluationFilterService from "../../services/EvaluationFilterService";
import InstructorService from "../../services/InstructorService";
import { toast, ToastContainer } from "react-toastify";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useLoading } from "../../components/LoadingContext";
import { Users, UserX, Loader2 } from "lucide-react";
import { validateGradeLevel } from "../../utils/gradeLevelFormatter.jsx";

function JuniorHigh() {
  const [activeTab, setActiveTab] = useState(0);
  const [mergedInstructorsByGrade, setMergedInstructorsByGrade] = useState([[], [], [], []]); // For grades 7-10
  const [noInstructors, setNoInstructors] = useState(false);
  const [fetchError, setFetchError] = useState(false); // Added fetchError state
  const [submittedCount, setSubmittedCount] = useState(0); // Added submittedCount state
  const [bulkSending, setBulkSending] = useState(false); // Added bulkSending state
  const [bulkSendStatus, setBulkSendStatus] = useState(null); // Added bulkSendStatus state
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Added showConfirmModal state
  const [filters, setFilters] = useState({ // Added filters state
    schoolYear: '',
    semester: '',
    searchQuery: ''
  });

  const tabLabels = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"];
  const programCode = "JHS";
  const { loading, setLoading } = useLoading();

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
  };

  const handleAddInstructor = () => {
    console.log("Add Instructor");
  };

  const filterInstructors = (instructors, query) => { // Added filterInstructors
    if (!query) return instructors;
    return instructors.filter(instructor =>
      instructor.name.toLowerCase().includes(query.toLowerCase()) ||
      instructor.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleBulkSend = async () => { // Added handleBulkSend function
    setShowConfirmModal(false);
    setBulkSending(true);
    try {
      const response = await InstructorService.sendBulkResults(programCode);

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
    }
  };


  const fetchData = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      // Fetch filtered results and evaluation counts
      const [filteredResults, courseEvalCounts] = await Promise.all([
        EvaluationFilterService.getFilteredResults(programCode, {
          schoolYear: filters.schoolYear,
          semester: filters.semester
        }),
        EvaluationService.getCourseEvaluationSubmissionCounts(),
      ]);

      console.log("Filtered Results:", filteredResults);

      if (!Array.isArray(filteredResults) || !Array.isArray(courseEvalCounts)) {
        throw new Error("Invalid data format received from one or more endpoints");
      }

      // Find the submitted count for the current programCode
      const currentCourseStats = courseEvalCounts.find(course => course.course_code === programCode);
      setSubmittedCount(currentCourseStats ? currentCourseStats.submitted_count : 0);

      // Fetch instructors to merge with filtered results
      const instructorsData = await ProgramService.getInstructorsByProgramCode(programCode);
      console.log("Raw Instructors Data from Backend:", JSON.stringify(instructorsData, null, 2));

      if (!Array.isArray(instructorsData)) {
        throw new Error("Invalid instructors data format received");
      }

      // Log each instructor's grade levels
      instructorsData.forEach(instructor => {
        console.log(`Instructor ${instructor.name} (ID: ${instructor.id}) grade levels:`, {
          pivot: instructor.pivot,
          gradeLevel: instructor.pivot?.yearLevel,
          mappedGrade: validateGradeLevel(instructor.pivot?.yearLevel, 'Junior High')
        });
      });

      // Group instructors by actual grade level (7-10)
      const groupByGrade = (data) => {
        const grouped = [[], [], [], []]; // [Grade 7, Grade 8, Grade 9, Grade 10]
        console.log('Starting groupByGrade with data:', JSON.stringify(data, null, 2));
        
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
            
            if (isNaN(yearLevel) || yearLevel < 7 || yearLevel > 10) {
              console.log(`Invalid grade level for instructor ${item.name}:`, yearLevel);
              return;
            }

            // Create instructor object for this assignment
            const instructor = {
              id: item.id,
              name: item.name,
              email: item.email,
              status: item.status,
              educationLevel: item.educationLevel,
              gradeLevel: yearLevel,
              program: assignment.program_name || `Grade ${yearLevel}`,
              pivot: {
                yearLevel: yearLevel,
                program_id: assignment.program_id,
                program_name: assignment.program_name || `Grade ${yearLevel}`
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

            console.log(`Created instructor object for ${item.name} in grade ${yearLevel}:`, JSON.stringify(instructor, null, 2));

            // Place in correct group based on actual grade number
            if (yearLevel === 7) {
              console.log(`Adding ${item.name} to Grade 7 group`);
              grouped[0].push(instructor);
            }
            else if (yearLevel === 8) {
              console.log(`Adding ${item.name} to Grade 8 group`);
              grouped[1].push(instructor);
            }
            else if (yearLevel === 9) {
              console.log(`Adding ${item.name} to Grade 9 group`);
              grouped[2].push(instructor);
            }
            else if (yearLevel === 10) {
              console.log(`Adding ${item.name} to Grade 10 group`);
              grouped[3].push(instructor);
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

      const mergedGrouped = groupByGrade(merged);

      console.log("Merged Data after Grouping:", mergedGrouped);

      // Apply search filter
      const filteredMergedGrouped = mergedGrouped.map(gradeGroup =>
        filterInstructors(gradeGroup, filters.searchQuery)
      );

      setMergedInstructorsByGrade(filteredMergedGrouped);
      setNoInstructors(instructorsData.length === 0);

    } catch (error) {
      console.error("Error loading instructors:", error);
      toast.error(`Failed to load instructors for ${programCode}.`);
      setFetchError(true);
      setNoInstructors(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [programCode, filters.schoolYear, filters.semester]); // Added filter dependencies

  useEffect(() => { // Added useEffect for search query with debounce
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.searchQuery]);


  const hasInstructorsForGrade = (index) => {
    return mergedInstructorsByGrade[index]?.length > 0;
  };

  const hasInstructorsAssigned = () => {
    return mergedInstructorsByGrade.some((gradeGroup) => gradeGroup.length > 0);
  };

  if (fetchError) { // Render error message if fetchError is true
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
      <ToastContainer position="top-right" autoClose={3000} /> {/* Added ToastContainer */}
      {loading ? (
        <FullScreenLoader />
      ) : noInstructors || !hasInstructorsAssigned() ? ( // Adjusted condition
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Users className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Instructors Found
          </h2>
          <p className="text-red-500 text-center">
            {noInstructors ?
             "There are currently no instructors assigned for Junior High Grades 7–10." :
             "No instructors match the selected filters." // More specific message if filters are applied
            }
          </p>
        </div>
      ) : (
        <>
          <ContentHeader
            title="Instructors"
            stats={[`Submitted: ${submittedCount}`]} // Added submittedCount stat
            onSearch={handleSearch} // Added onSearch prop
            onExport={handleExport}
            onAdd={handleAddInstructor}
            onBulkSend={() => setShowConfirmModal(true)} // Added onBulkSend prop
            onSchoolYearChange={(value) => handleFilterChange('schoolYear', value)} // Added filter props
            onSemesterChange={(value) => handleFilterChange('semester', value)} // Added filter props
            selectedSchoolYear={filters.schoolYear} // Added filter props
            selectedSemester={filters.semester} // Added filter props
            schoolYearOptions={schoolYearOptions} // Added filter props
            semesterOptions={semesterOptions} // Added filter props
          />

          <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="mt-4 text-center">
            {hasInstructorsForGrade(activeTab) ? (
              <InstructorTable instructors={mergedInstructorsByGrade[activeTab]} /> // Changed state name
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg"> {/* Added styling */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4"> {/* Added styling */}
                  <UserX className="w-8 h-8 text-gray-500 dark:text-gray-400" /> {/* Added icon */}
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"> {/* Added styling */}
                  No Instructors Assigned
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center"> {/* Added styling */}
                  No instructors match the selected filters for {tabLabels[activeTab]}.\
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Confirmation Modal */} {/* Added Confirmation Modal */}
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

export default JuniorHigh;
