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

  const tabLabels = ["Grade 11", "Grade 12"];
  const programCode = "SHS";
  const { loading, setLoading } = useLoading();

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
          } else {
            const grouped = [[], []];
            data.forEach((instructor) => {
              const grade = instructor?.pivot?.yearLevel;
              if (grade === 1) grouped[0].push(instructor); // Map 1 to Grade 11
              else if (grade === 2) grouped[1].push(instructor); // Map 2 to Grade 12
              else {
                console.warn(`Unexpected yearLevel: ${grade}`);
              }
            });
            setInstructorsByGrade(grouped);
          }
        } else {
          toast.error("Invalid instructor data format.");
        }
      } catch (err) {
        console.error("Error loading instructors:", err);
        toast.error("Failed to load instructors for Senior High.");
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
              <p className="text-red-500">No instructors assigned for this grade.</p>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default SeniorHigh;
