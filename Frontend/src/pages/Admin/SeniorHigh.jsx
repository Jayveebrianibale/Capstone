import React, { useState, useEffect } from "react";
import InstructorTable from "../../contents/Admin/InstructorTable";
import Tabs from "../../components/Tabs";
import ContentHeader from "../../contents/Admin/ContentHeader";
import ProgramService from "../../services/ProgramService";
import { toast } from "react-toastify";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useLoading } from "../../components/LoadingContext";
import { Users } from "lucide-react";

function SeniorHigh() {
  const [activeTab, setActiveTab] = useState(0);
  const [instructorsByGrade, setInstructorsByGrade] = useState([[], []]);
  const [noInstructors, setNoInstructors] = useState(false);

  const { loading, setLoading } = useLoading();
  const programCode = "SHS"; // Example code for Senior High School

  const tabLabels = [
    `Grade 11 (${instructorsByGrade[0]?.length || 0})`,
    `Grade 12 (${instructorsByGrade[1]?.length || 0})`
  ];

  // Helper to map yearLevel to 1 or 2 for SHS
  // Updated mapYearLevelToNumber function
const mapYearLevelToNumber = (yearLevel) => {
  // Handle numerical values (including 11/12 as SHS grades)
  if (typeof yearLevel === 'number') {
    if (yearLevel === 11) return 1; // Map 11 to Grade 11 (index 0)
    if (yearLevel === 12) return 2; // Map 12 to Grade 12 (index 1)
    return yearLevel; // Assume valid if already 1 or 2
  }

  // Handle string values
  const level = String(yearLevel).toLowerCase().trim();
  if (level === 'grade 11' || level === '11' || level === '1') return 1;
  if (level === 'grade 12' || level === '12' || level === '2') return 2;
  
  return null; // Invalid format
};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [instructorsData, resultsData] = await Promise.all([
          ProgramService.getInstructorsByProgramCode(programCode),
          ProgramService.getInstructorResultsByProgram
            ? ProgramService.getInstructorResultsByProgram(programCode)
            : Promise.resolve([])
        ]);

        if (!Array.isArray(instructorsData)) {
          throw new Error("Invalid data format received");
        }

        // Extract unique instructors per grade
        const groupByYear = (data) => {
          const grouped = [[], []];
          data.forEach((item) => {
            const yearLevel = item?.pivot?.yearLevel;
            const year = mapYearLevelToNumber(yearLevel);
            const instructor = {
              id: item.id,
              name: item.name,
              email: item.email,
              yearLevel: year,
              // add more fields if needed
            };
            if (year === 1) grouped[0].push(instructor);
            else if (year === 2) grouped[1].push(instructor);
          });
          return grouped;
        };

        const instructorsGrouped = groupByYear(instructorsData);
        setInstructorsByGrade(instructorsGrouped);
        setNoInstructors(instructorsData.length === 0);
      } catch (err) {
        console.error("Error loading instructors:", err);
        toast.error("Failed to load instructors for Senior High.");
        setNoInstructors(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programCode, setLoading]);

  const hasInstructorsForGrade = (grade) => instructorsByGrade[grade]?.length > 0;
  const hasInstructorsAssigned = () => instructorsByGrade.some((g) => g.length > 0);

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
            No instructors are currently assigned to Senior High.
          </p>
        </div>
      ) : (
        <>
          <ContentHeader
            title="Instructors"
            stats={["Students: 0", "Submitted: 0"]}
            onSearch={(q) => console.log("Search:", q)}
            onExport={() => console.log("Export to PDF")}
            onAdd={() => console.log("Add Instructor")}
          />
          <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-4 text-center">
            {hasInstructorsForGrade(activeTab) ? (
              <InstructorTable instructors={instructorsByGrade[activeTab]} />
            ) : (
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                No instructors assigned for {tabLabels[activeTab]}.
              </p>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default SeniorHigh;
