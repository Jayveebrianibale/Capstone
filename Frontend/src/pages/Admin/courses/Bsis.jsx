import React, { useState, useEffect } from "react";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";
import ProgramService from "../../../services/ProgramService";
import { toast } from "react-toastify";

function Bsis() {
  const [activeTab, setActiveTab] = useState(0);
  const [instructorsByYear, setInstructorsByYear] = useState([[], [], [], []]);
  const tabLabels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

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
        const programId = 1;
        const data = await ProgramService.getInstructorsByProgram(programId);
        console.log("Fetched instructors:", data);

        const grouped = [[], [], [], []];

        data.forEach((instructor) => {
          const year = instructor?.pivot?.yearLevel;
          console.log("Instructor year:", year);

          if (year && year >= 1 && year <= 4) {
            grouped[year - 1].push(instructor);
          } else {
            console.warn("Instructor has an invalid or missing yearLevel:", instructor);
          }
        });

        setInstructorsByYear(grouped);
      } catch (error) {
        console.error("Failed to load instructors:", error);
        toast.error("Failed to load instructors for BSIS.");
      }
    };

    fetchInstructors();
  }, []);

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <ContentHeader
        title="BSIS Instructors"
        stats={["Students: 40", "Submitted: 36"]}
        onSearch={handleSearch}
        onExport={handleExport}
        onAdd={handleAddInstructor}
      />

      <div className="flex flex-col">
        <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="mt-4">
        <InstructorTable instructors={instructorsByYear[activeTab] || []} />
      </div>
    </main>
  );
}

export default Bsis;
