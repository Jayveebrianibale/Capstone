import React, { useState, useEffect } from "react";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";
import ProgramService from "../../../services/ProgramService";
import { toast } from "react-toastify";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useLoading } from "../../../components/LoadingContext"; // import LoadingContext

function Bssw() {
  const [activeTab, setActiveTab] = useState(0);
  const [instructorsByYear, setInstructorsByYear] = useState([[], [], [], []]);
  const [noInstructors, setNoInstructors] = useState(false);

  const tabLabels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const programCode = "BSSW";
  const { loading, setLoading } = useLoading(); // use loading state from context

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
      setLoading(true); // start loading
      try {
        const data = await ProgramService.getInstructorsByProgramCode(programCode);

        if (data && typeof data === "string" && data.includes("<!doctype html>")) {
          throw new Error("Received an HTML response. Possible backend error.");
        }

        if (Array.isArray(data)) {
          if (data.length === 0) {
            setNoInstructors(true);
          } else {
            const grouped = [[], [], [], []];
            data.forEach((instructor) => {
              const year = instructor?.pivot?.yearLevel;
              if (year && year >= 1 && year <= 4) {
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
        setLoading(false); // stop loading
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
      <ContentHeader
        title="BSSW Instructors"
        stats={["Students: 0", "Submitted: 0"]}
        onSearch={handleSearch}
        onExport={handleExport}
        onAdd={handleAddInstructor}
      />

      <div className="flex flex-col mt-4">
        {loading ? (
          <FullScreenLoader />
        ) : noInstructors || !hasInstructorsAssigned() ? (
          <p className="text-red-500 text-center">
            No instructors assigned yet to any year for BSSW.
          </p>
        ) : (
          <>
            <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-4 text-center">
              {hasInstructorsForYear(activeTab) ? (
                <InstructorTable instructors={instructorsByYear[activeTab] || []} />
              ) : (
                <p className="text-red-500">No instructors assigned for this year.</p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Bssw;
