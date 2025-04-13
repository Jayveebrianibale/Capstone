import { useEffect, useState } from "react";
import ProgramService from "../../../services/ProgramService";
import InstructorService from "../../../services/InstructorService";
import { toast } from "react-toastify";

function AssignProgramModal({ isOpen, onClose, instructor }) {
  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchPrograms();
      setSelectedPrograms(
        instructor?.programs?.map((p) => ({
          id: p.id,
          yearLevel: p.pivot?.yearLevel, // No default yearLevel, must be selected
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
        yearLevel: p.year_level || p.yearLevel, // Keep as is, not defaulting to 1
      }));

      setPrograms(normalized);
    } catch (err) {
      toast.error("Failed to fetch programs.");
      console.error(err);
    }
  };

  const handleToggle = (program) => {
    setSelectedPrograms((prev) => {
      const exists = prev.find((p) => p.id === program.id);
      if (exists) {
        return prev.filter((p) => p.id !== program.id);
      } else {
        return [
          ...prev,
          { id: program.id, yearLevel: null }, // Set yearLevel to null initially, it will be set when chosen
        ];
      }
    });
  };

  const handleYearLevelChange = (programId, newYearLevel) => {
    const intYearLevel = parseInt(newYearLevel, 10);
    if (intYearLevel >= 1 && intYearLevel <= 4) {
      setSelectedPrograms((prev) =>
        prev.map((p) =>
          p.id === programId
            ? { ...p, yearLevel: intYearLevel }
            : p
        )
      );
    } else {
      toast.error("Year level must be a number between 1 and 4.");
    }
  };

  const handleSave = async () => {
    // Validate if yearLevel is set for all selected programs
    const invalidPrograms = selectedPrograms.filter((program) => {
      const intYearLevel = program.yearLevel;
      return intYearLevel === null || isNaN(intYearLevel) || intYearLevel < 1 || intYearLevel > 4;
    });

    if (invalidPrograms.length > 0) {
      toast.error("Please select a valid year level (1-4) for all selected programs.");
      return;
    }

    const payload = {
      programs: selectedPrograms.map((program) => ({
        id: program.id,
        yearLevel: parseInt(program.yearLevel, 10),
      })),
    };

    try {
      await InstructorService.assignPrograms(instructor.id, payload.programs);
      toast.success("Programs assigned successfully!");
      onClose();
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(error.response.data.message || "Failed to assign programs.");
      } else {
        console.error("Network error:", error);
        toast.error("Failed to assign programs.");
      }
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
                        className="accent-[#1F3463] w-4 h-4"
                      />
                      <div className="text-gray-700 dark:text-gray-200 font-medium">
                        {program.name}
                      </div>
                    </div>

                    {isChecked && (
                      <select
                        value={selectedYearLevel || ""}
                        onChange={(e) => handleYearLevelChange(program.id, e.target.value)}
                        className="ml-2 p-1 rounded-md border text-sm dark:bg-gray-700 dark:text-white"
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
            className="px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white text-sm"
          >
            Close
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-[#1F3463] text-white text-sm"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignProgramModal;
