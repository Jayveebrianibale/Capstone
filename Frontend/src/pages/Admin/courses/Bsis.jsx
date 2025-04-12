import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";
import ProgramService from "../../../services/ProgramService";
import { toast } from "react-toastify";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useLoading } from "../../../components/LoadingContext";

function Bsis() {
  const [instructors, setInstructors] = useState([[], [], [], []]);
  const [noInstructors, setNoInstructors] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const tabLabels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const programCode = "BSIS";
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const data = await ProgramService.getInstructorsByProgramCode(programCode);
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
                console.warn("Invalid or missing yearLevel:", instructor);
              }
            });
            setInstructors(grouped);
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
  }, [programCode, setLoading]);

  const handleAddInstructor = () => {
    console.log("Add Instructor");
  };

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <ContentHeader
        title="Instructors"
        stats={["Students: 0", "Submitted: 0"]}
        onSearch={() => console.log("Search")}
        onExport={() => console.log("Export to PDF")}
        onAdd={handleAddInstructor}
      />

      {loading ? (
        <FullScreenLoader />
      ) : noInstructors ? (
        <p className="text-red-500 text-center">No instructors assigned yet to any year for BSIS.</p>
      ) : (
        <>
          <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-4 text-center">
            {instructors[activeTab]?.length > 0 ? (
              <InstructorTable instructors={instructors[activeTab]} />
            ) : (
              <p className="text-red-500">No instructors assigned for this year.</p>
            )}
          </div>
        </>
      )}

      <button
        onClick={handleAddInstructor}
        className="fixed bottom-4 right-4 bg-[#1F3463] text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
        title="Add Instructor"
      >
        <FaPlus size={12} />
      </button>
    </main>
  );
}

export default Bsis;
