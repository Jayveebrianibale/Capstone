import React, { useState, useEffect } from "react";
import InstructorTable from "../../contents/Admin/InstructorTable";
import Tabs from "../../components/Tabs";
import ContentHeader from "../../contents/Admin/ContentHeader";
import ProgramService from "../../services/ProgramService";
import { toast } from "react-toastify";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useLoading } from "../../components/LoadingContext";
import { Users } from "lucide-react";

function JuniorHigh() {
  const [activeTab, setActiveTab] = useState(0);
  const [instructorsByGrade, setInstructorsByGrade] = useState([[], [], [], []]);
  const [noInstructors, setNoInstructors] = useState(false);

  const tabLabels = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"];
  const programCode = "JHS";
  const { loading, setLoading } = useLoading();

  // Helper to map yearLevel to 7-10 for JHS
  const mapYearLevelToIndex = (yearLevel) => {
    if (typeof yearLevel === 'number') return yearLevel - 7;
    const level = String(yearLevel).toLowerCase().trim();
    if (level === 'grade 7' || level === '7') return 0;
    if (level === 'grade 8' || level === '8') return 1;
    if (level === 'grade 9' || level === '9') return 2;
    if (level === 'grade 10' || level === '10') return 3;
    return null;
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const data = await ProgramService.getInstructorsByProgramCode(programCode);

        if (typeof data === "string" && data.includes("<!doctype html>")) {
          throw new Error("Received HTML instead of JSON. Check backend.");
        }

        if (Array.isArray(data)) {
          if (data.length === 0) {
            setNoInstructors(true);
            setInstructorsByGrade([[], [], [], []]);
          } else {
            const grouped = [[], [], [], []];
            data.forEach((item) => {
              const yearLevel = item?.pivot?.yearLevel;
              const idx = mapYearLevelToIndex(yearLevel);
              const instructor = {
                id: item.id,
                name: item.name,
                email: item.email,
                yearLevel: yearLevel,
              };
              if (idx !== null && idx >= 0 && idx < 4) grouped[idx].push(instructor);
            });
            setInstructorsByGrade([]); // Force re-render
            setTimeout(() => setInstructorsByGrade(grouped), 0);
            setNoInstructors(false);
          }
        } else {
          toast.error("Invalid instructor data format.");
        }
      } catch (err) {
        console.error("Error loading instructors:", err);
        toast.error("Failed to load instructors for Junior High.");
        setNoInstructors(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
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
            No instructors are currently assigned to Junior High.
          </p>
        </div>
      ) : (
        <>
          <ContentHeader
            title="Junior High Instructors"
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
              <p className="text-red-500">No instructors assigned for this grade.</p>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default JuniorHigh;
