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

  // Optional: Add search, export, and add functionalities
  const handleSearch = (query) => {
    console.log("Search:", query);
  };

  const handleExport = () => {
    console.log("Export to PDF");
  };

  const handleAddInstructor = () => {
    console.log("Add Instructor");
    // If you're opening a modal to assign an instructor, trigger it here
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const programId = 1; // BSIS program ID
        const data = await ProgramService.getInstructorsByProgram(programId);

        console.log("Fetched instructors:", data);

        const grouped = [[], [], [], []]; // Year levels: 1 to 4

        data.forEach((instructor) => {
          const year = instructor?.pivot?.yearLevel;

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

      <div className="flex flex-col mt-4">
        <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4">
          <InstructorTable instructors={instructorsByYear[activeTab] || []} />
        </div>
      </div>
    </main>
  );
}

export default Bsis;
