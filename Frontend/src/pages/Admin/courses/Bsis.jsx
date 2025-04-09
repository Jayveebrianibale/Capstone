import React, { useState, useEffect } from "react";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";
import ProgramService from "../../../services/ProgramService";
import { toast } from "react-toastify";

function Bsis() {
  const [activeTab, setActiveTab] = useState(0);
  const [instructorsByYear, setInstructorsByYear] = useState([[], [], [], []]);
  const [loading, setLoading] = useState(true);
  const [noInstructors, setNoInstructors] = useState(false);
  const tabLabels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const programCode = "BSIS";
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
      try {
        const data = await ProgramService.getInstructorsByProgramCode(programCode);
        console.log("Fetched data:", data);
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
                console.warn("Invalid or missing yearLevel in:", instructor);
              }
            });

            console.log("Assigned instructors grouped by year:", grouped);

            setInstructorsByYear(grouped);
          }
        } else {
          toast.error("Invalid response format: expected an array.");
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
        toast.error(`Failed to load instructors for ${programCode}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [programCode]);

  const hasInstructorsForYear = (year) => {
    return instructorsByYear[year]?.length > 0;
  };

  const hasInstructorsAssigned = () => {
    return instructorsByYear.some((group) => group.length > 0);
  };

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <ContentHeader
        title="BSIS Instructors"
        stats={["Students: 0", "Submitted: 0"]}
        onSearch={handleSearch}
        onExport={handleExport}
        onAdd={handleAddInstructor}
      />

      <div className="flex flex-col mt-4">
        {loading ? (
          <p className="text-center">Loading instructors...</p>
        ) : noInstructors || !hasInstructorsAssigned() ? (
          <p className="text-red-500 text-center">
            No instructors assigned yet to any year for BSIS.
          </p>
        ) : (
          <>
            <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-4 text-center">
              {hasInstructorsForYear(activeTab) ? (
                <InstructorTable
                  instructors={instructorsByYear[activeTab] || []}
                />
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

export default Bsis;
