import React, { useState, useEffect } from "react";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";
import ProgramService from "../../../services/ProgramService";
import EvaluationService from "../../../services/EvaluationService"; // Added EvaluationService
import { toast } from "react-toastify";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useLoading } from "../../../components/LoadingContext";
import { Users, UserX } from "lucide-react";

// Utility to map year level string/number to a number (1-2)
function mapYearLevelToNumber(yearLevel) {
  if (typeof yearLevel === 'number') return yearLevel;
  if (!yearLevel) return null;
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
    default:
      console.log('Invalid year level:', yearLevel);
      return null;
  }
}

function Act() {
  const [activeTab, setActiveTab] = useState(0);
  const [mergedInstructorsByYear, setMergedInstructorsByYear] = useState([[], []]);
  const [noInstructors, setNoInstructors] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0); // Added state for submitted count
  const { loading, setLoading } = useLoading();

  const tabLabels = ["1st Year", "2nd Year"];
  const programCode = "ACT";

  const handleSearch = (query) => {
    console.log("Search:", query);
  };

  const handleExport = () => {
    console.log("Export to PDF");
  };

  const handleAddInstructor = () => {
    console.log("Add Instructor");
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
        const grouped = [[], []];
        data.forEach((item) => {
          const yearLevel = item?.pivot?.yearLevel;
          const year = mapYearLevelToNumber(yearLevel);
          if (year >= 1 && year <= 2) grouped[year - 1].push(item);
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
      {loading ? (
        <FullScreenLoader />
      ) : noInstructors || !hasInstructorsAssigned() ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Users className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Instructors Found
          </h2>
          <p className="text-red-500 text-center">
            There are currently no instructors assigned to any year level for ACT.
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
    </main>
  );
}

export default Act;
