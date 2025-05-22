import React, { useEffect, useState } from "react";
import InstructorTable from "../../contents/Admin/InstructorTable";
import Tabs from "../../components/Tabs";
import ContentHeader from "../../contents/Admin/ContentHeader";
import ProgramService from "../../services/ProgramService";
import { toast } from "react-toastify";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useLoading } from "../../components/LoadingContext";
import { Users } from "lucide-react";

function Intermediate() {
  const [activeTab, setActiveTab] = useState(0);
  const [instructorsByGrade, setInstructorsByGrade] = useState([[], [], []]);
  const [noInstructors, setNoInstructors] = useState(false);

  const tabLabels = ["Grade 4", "Grade 5", "Grade 6"];
  const programCode = "INT";
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

  // Helper to map yearLevel to 1, 2, 3 for Grades 4, 5, 6
  const mapYearLevelToNumber = (yearLevel) => {
    if (typeof yearLevel === 'number') {
      if (yearLevel === 4) return 1;
      if (yearLevel === 5) return 2;
      if (yearLevel === 6) return 3;
      return yearLevel;
    }
    const level = String(yearLevel).toLowerCase().trim();
    if (level === 'grade 4' || level === '4' || level === '1') return 1;
    if (level === 'grade 5' || level === '5' || level === '2') return 2;
    if (level === 'grade 6' || level === '6' || level === '3') return 3;
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const instructorsData = await ProgramService.getInstructorsByProgramCode(programCode);
        if (!Array.isArray(instructorsData)) {
          throw new Error("Invalid data format received");
        }
        // Group instructors by yearLevel (Grade 4, 5, 6)
        const groupByYear = (data) => {
          const grouped = [[], [], []];
          data.forEach((item) => {
            const yearLevel = item?.pivot?.yearLevel;
            const year = mapYearLevelToNumber(yearLevel);
            const instructor = {
              id: item.id,
              name: item.name,
              email: item.email,
              yearLevel: year,
            };
            if (year === 1) grouped[0].push(instructor);
            else if (year === 2) grouped[1].push(instructor);
            else if (year === 3) grouped[2].push(instructor);
          });
          return grouped;
        };
        const instructorsGrouped = groupByYear(instructorsData);
        setInstructorsByGrade(instructorsGrouped);
        setNoInstructors(instructorsData.length === 0);
      } catch (error) {
        console.error("Error loading instructors:", error);
        toast.error(`Failed to load instructors for ${programCode}.`);
        setNoInstructors(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [programCode, setLoading]);

  const hasInstructorsForGrade = (index) => {
    return instructorsByGrade[index]?.length > 0;
  };

  const hasInstructorsAssigned = () => {
    return instructorsByGrade.some((gradeGroup) => gradeGroup.length > 0);
  };

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
            There are currently no instructors assigned for Intermediate Grades 4–6.
          </p>
        </div>
      ) : (
        <>
          <ContentHeader
            title="Instructors"
            stats={["Students: 0"]}
            onSearch={handleSearch}
            onExport={handleExport}
            onAdd={handleAddInstructor}
          />

          <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="mt-4 text-center">
            {hasInstructorsForGrade(activeTab) ? (
              <InstructorTable instructors={instructorsByGrade[activeTab]} />
            ) : (
              <p className="text-red-500">No instructors assigned for this grade.</p>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default Intermediate;
