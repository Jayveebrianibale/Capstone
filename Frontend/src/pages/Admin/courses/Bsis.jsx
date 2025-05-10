import React, { useState, useEffect } from "react";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";
import ProgramService from "../../../services/ProgramService";
import { toast } from "react-toastify";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useLoading } from "../../../components/LoadingContext";
import { Users } from "lucide-react";

function Bsis() {
  const [activeTab, setActiveTab] = useState(0);
  const [mergedInstructorsByYear, setMergedInstructorsByYear] = useState([[], [], [], []]);
  const [noInstructors, setNoInstructors] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const tabLabels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const programCode = "BSIS";
  const { loading, setLoading } = useLoading();

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
      const [instructorsData, resultsData] = await Promise.all([
        ProgramService.getInstructorsByProgramCode(programCode),
        ProgramService.getInstructorResultsByProgram(programCode),
      ]);

      if (!Array.isArray(instructorsData) || !Array.isArray(resultsData)) {
        throw new Error("Invalid data format received");
      }

      // Group instructors and results by year level
      const groupByYear = (data) => {
        const grouped = [[], [], [], []];
        data.forEach((item) => {
          const year = item?.pivot?.yearLevel;
          if (year >= 1 && year <= 4) grouped[year - 1].push(item);
        });
        return grouped;
      };

      const instructorsGrouped = groupByYear(instructorsData);
      const resultsGrouped = groupByYear(resultsData);

      // Merge data
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
      toast.error("Failed to load instructor data");
      setFetchError(true);
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
            There are currently no instructors assigned to any year level for BSIS.
          </p>
        </div>
      ) : (
        <>
          <ContentHeader
            title="Instructors"
            stats={["Students: 0", "Submitted: 0"]}
            onSearch={handleSearch}
            onExport={handleExport}
            onAdd={handleAddInstructor}
          />

          <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-4 text-center">
            {hasInstructorsForYear(activeTab) ? (
              <InstructorTable instructors={mergedInstructorsByYear[activeTab]} />
            ) : (
              <p className="text-red-500">No instructors assigned for this year.</p>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default Bsis;