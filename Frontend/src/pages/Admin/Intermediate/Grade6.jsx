import React, { useEffect, useState } from "react";
import ProgramService from "../../../services/ProgramService";
import { toast } from "react-toastify";
import FullScreenLoader from "../../../components/FullScreenLoader";
import { useLoading } from "../../../components/LoadingContext";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import ContentHeader from "../../../contents/Admin/ContentHeader";
import { Users } from "lucide-react";

function Grade4() {
  const [instructors, setInstructors] = useState([]);
  const [noInstructors, setNoInstructors] = useState(false);

  const programCode = "GRADE4"; // Update this to match your backend identifier
  const yearLevel = 4;
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

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const data = await ProgramService.getInstructorsByProgramCode(programCode);

        if (data && typeof data === "string" && data.includes("<!doctype html>")) {
          throw new Error("Received an HTML response. Possible backend error.");
        }

        if (Array.isArray(data)) {
          const filtered = data.filter(
            (instructor) => instructor?.pivot?.yearLevel === yearLevel
          );
          setInstructors(filtered);
          if (filtered.length === 0) setNoInstructors(true);
        } else {
          console.error("Response is not an array:", data);
          toast.error("Failed to load instructors. Invalid response format.");
        }
      } catch (error) {
        console.error("Failed to load instructors:", error);
        toast.error(`Failed to load instructors for Grade 4.`);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [programCode, yearLevel, setLoading]);

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      {loading ? (
        <FullScreenLoader />
      ) : noInstructors ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Users className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Instructors Found
          </h2>
          <p className="text-red-500 text-center">
            There are currently no instructors assigned for Grade 4.
          </p>
        </div>
      ) : (
        <>
          <ContentHeader
            title="Grade 4 Instructors"
            stats={["Students: 0", "Submitted: 0"]}
            onSearch={handleSearch}
            onExport={handleExport}
            onAdd={handleAddInstructor}
          />
          <div className="mt-4 text-center">
            <InstructorTable instructors={instructors} />
          </div>
        </>
      )}
    </main>
  );
}

export default Grade4;
