import React, { useState, useEffect } from "react";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";
import ProgramService from "../../../services/ProgramService";
import { toast } from "react-toastify";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useLoading } from "../../../components/LoadingContext";
import { Users } from "lucide-react";

function Act() {
  const [activeTab, setActiveTab] = useState(0);
  const [instructorsByYear, setInstructorsByYear] = useState([[], []]); 
  const [noInstructors, setNoInstructors] = useState(false);
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
          } else {
            const grouped = [[], []]; 
            data.forEach((instructor) => {
              const year = instructor?.pivot?.yearLevel;
              if (year && year >= 1 && year <= 2) {
                grouped[year - 1].push(instructor);
              } else {
                console.warn("Instructor has an invalid or missing yearLevel:", instructor);
              }
            });
            setInstructorsByYear(grouped);
          }
        } else {
          console.error("Response is not an array:", data);
          toast.error("Failed to load instructors. Invalid response format.");
        }
      } catch (error) {
        console.error("Failed to load instructors:", error);
        toast.error(`Failed to load instructors for ${programCode}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [programCode, setLoading]);

  const hasInstructorsForYear = (year) => {
    return instructorsByYear[year]?.length > 0;
  };

  const hasInstructorsAssigned = () => {
    return instructorsByYear.some((yearGroup) => yearGroup.length > 0);
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
            There are currently no instructors assigned to any year level for ACT.
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
              <InstructorTable instructors={instructorsByYear[activeTab]} />
            ) : (
              <p className="text-red-500">No instructors assigned for this year.</p>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default Act;
