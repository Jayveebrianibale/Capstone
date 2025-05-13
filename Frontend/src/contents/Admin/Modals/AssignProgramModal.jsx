import { useEffect, useState } from "react";
import ProgramService from "../../../services/ProgramService";
import InstructorService from "../../../services/InstructorService";
import { toast } from "react-toastify";

function AssignProgramModal({ isOpen, onClose, instructor }) {
  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPrograms();
      setSelectedPrograms(
        instructor?.programs?.map((p) => ({
          id: p.id,
          yearLevel: p.pivot?.yearLevel,
        })) || []
      );
    }
  }, [isOpen, instructor]);

  const fetchPrograms = async () => {
    try {
      const data = await ProgramService.getAll();
      const extracted = Array.isArray(data) ? data : data?.programs || [];

      const normalized = extracted.map((p) => ({
        id: p.id,
        name: p.name,
        yearLevel: p.year_level || p.yearLevel,
        category: p.category
      }));

      console.log("Normalized programs:", normalized);
      setPrograms(normalized);
    } catch (err) {
      toast.error("Failed to fetch programs.");
      console.error(err);
    }
  };

  const handleToggle = (program) => {
    console.log("Toggling program:", program);
    setSelectedPrograms((prev) => {
      const exists = prev.find((p) => p.id === program.id);
      if (exists) {
        return prev.filter((p) => p.id !== program.id);
      } else {
        // For non-Higher Education programs, set yearLevel to 1 by default
        const isHigherEducation = program.category === "Higher Education";
        const isSeniorHigh = program.category === "SHS";

        let yearLevel = 1; // Default year level
        if (isSeniorHigh) {
          yearLevel = program.name.includes("Grade 11") ? 1 : 2;
        }

        console.log("Is Higher Education:", isHigherEducation);
        return [
          ...prev,
          { 
            id: program.id, 
            yearLevel: isHigherEducation ? null : yearLevel 
          },
        ];
      }
    });
  };

  const handleYearLevelChange = (programId, newYearLevel) => {
    // Convert to number and validate
    const intYearLevel = parseInt(newYearLevel, 10);
    if (isNaN(intYearLevel) || intYearLevel < 1 || intYearLevel > 4) {
      toast.error("Year level must be a number between 1 and 4.");
      return;
    }

    setSelectedPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? { ...p, yearLevel: intYearLevel }
          : p
      )
    );
  };

  const handleSave = async () => {
    try {
      setIsAssigning(true);
      // Only validate year level for Higher Education programs
      const invalidPrograms = selectedPrograms.filter(p => {
        const program = programs.find(prog => prog.id === p.id);
        const isHigherEducation = program?.category === "Higher Education";
        return isHigherEducation && !p.yearLevel;
      });

      if (invalidPrograms.length > 0) {
        toast.error("Please select a year level for all Higher Education programs");
        setIsAssigning(false);
        return;
      }

      // Format the data for the API
      const formattedData = {
        programs: selectedPrograms.map(p => ({
          id: p.id,
          yearLevel: parseInt(p.yearLevel, 10)
        }))
      };

      await InstructorService.assignPrograms(instructor.id, formattedData.programs);
      toast.success("Programs assigned successfully");
      onClose();
    } catch (error) {
      console.error("Error assigning programs:", error);
      toast.error(error.response?.data?.message || "Failed to assign programs");
    } finally {
      setIsAssigning(false);
    }
  };

  const getYearLevelOptions = (programName) => {
    if (programName.toLowerCase() === "associate in computer technology") {
      return [
        { value: 1, label: "1st Year" },
        { value: 2, label: "2nd Year" },
      ];
    } else {
      return [
        { value: 1, label: "1st Year" },
        { value: 2, label: "2nd Year" },
        { value: 3, label: "3rd Year" },
        { value: 4, label: "4th Year" },
      ];
    }
  };

  const isHigherEducationProgram = (program) => {
    console.log("Checking program category:", program);
    return program.category === "Higher Education";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg transition-all">
        <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-white">
          Assign Programs to{" "}
          <span className="text-[#1F3463] dark:text-blue-400">
            {instructor?.name}
          </span>
        </h2>

        <div className="max-h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {programs.length > 0 ? (
            programs.map((program) => {
              const isChecked = selectedPrograms.some((p) => p.id === program.id);
              const selectedYearLevel = selectedPrograms.find((p) => p.id === program.id)?.yearLevel;
              const isHigherEducation = isHigherEducationProgram(program);
              
              console.log("Rendering program:", { 
                name: program.name, 
                category: program.category, 
                isHigherEducation 
              });

              return (
                <label
                  key={program.id}
                  className="flex flex-col gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggle(program)}
                        style={{
                          width: '1rem',
                          height: '1rem',
                          accentColor: '#1F3463'
                        }}
                        className="rounded border-gray-300"
                      />
                      <div className="text-gray-700 dark:text-gray-200 font-medium">
                        {program.name}
                      </div>
                    </div>

                    {isChecked && isHigherEducation && (
                      <select
                        value={selectedYearLevel || ""}
                        onChange={(e) => handleYearLevelChange(program.id, e.target.value)}
                        className="ml-2 p-1 rounded-md border text-sm dark:bg-gray-700 dark:text-white
                          [&>option:hover]:bg-[#1F3463] [&>option:hover]:text-white
                          [&>option:checked]:bg-[#1F3463] [&>option:checked]:text-white"
                      >
                        <option value="" disabled>
                          Select Year
                        </option>
                        {getYearLevelOptions(program.name).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </label>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No programs found.
            </p>
          )}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            disabled={isAssigning}
            className="px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white text-sm
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close
          </button>

          <button
            onClick={handleSave}
            disabled={isAssigning}
            className="px-5 py-2.5 rounded-lg bg-[#1F3463] text-white text-sm
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2 min-w-[100px] justify-center"
          >
            {isAssigning ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Assigning...</span>
              </>
            ) : (
              "Assign"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignProgramModal;
