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
  const programCode = "INTERMEDIATE";
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

  // Helper to map yearLevel to 4-6 for Intermediate
  const mapYearLevelToIndex = (yearLevel) => {
    if (typeof yearLevel === 'number') return yearLevel - 4;
    const level = String(yearLevel).toLowerCase().trim();
    if (level === 'grade 4' || level === '4') return 0;
    if (level === 'grade 5' || level === '5') return 1;
    if (level === 'grade 6' || level === '6') return 2;
    return null;
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const data = await ProgramService.getInstructorsByProgramCode(programCode);

        if (data && typeof data === "string" && data.includes("<!doctype html>")) {
          throw new Error("Received an HTML response. Possible backend error.");
        }

        if (Array.isArray(data)) {
          if (data.length === 0) {
            setNoInstructors(true);
            setInstructorsByGrade([[], [], []]);
          } else {
            const grouped = [[], [], []];
            data.forEach((item) => {
              const yearLevel = item?.pivot?.yearLevel;
              const idx = mapYearLevelToIndex(yearLevel);
              const instructor = {
                id: item.id,
                name: item.name,
                email: item.email,
                yearLevel: yearLevel,
              };
              if (idx !== null && idx >= 0 && idx < 3) grouped[idx].push(instructor);
            });
            setInstructorsByGrade([]); // Force re-render
            setTimeout(() => setInstructorsByGrade(grouped), 0);
            setNoInstructors(false);
          }
        } else {
          toast.error("Failed to load instructors. Invalid response format.");
        }
      } catch (error) {
        console.error("Error loading instructors:", error);
        toast.error(`Failed to load instructors for ${programCode}.`);
        setNoInstructors(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
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
            title="Intermediate Instructors"
            stats={["Students: 0", "Submitted: 0"]}
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
