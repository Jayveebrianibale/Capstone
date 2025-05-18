import { useEffect, useState } from "react";
import ProgramService from "../../../services/ProgramService";
import InstructorService from "../../../services/InstructorService";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";

function AssignProgramModal({ isOpen, onClose, instructor }) {
  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [search, setSearch] = useState("");

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
    setSelectedPrograms((prev) => {
      const exists = prev.find((p) => p.id === program.id);
      if (exists) {
        return prev.filter((p) => p.id !== program.id);
      } else {
        const isHigherEducation = program.category === "Higher Education";
        const isSeniorHigh = program.category === "SHS";
        let yearLevel = 1;
        if (isSeniorHigh) {
          // Try to extract the grade number from the program name (e.g., 'Grade 11 - ...')
          const match = program.name.match(/Grade (\d+)/);
          if (match && match[1]) {
            yearLevel = parseInt(match[1], 10) - 10; // Grade 11 -> 1, Grade 12 -> 2
          }
        }
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

  const filteredPrograms = programs.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg transition-all transform">
        {/* Header with close button */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Assign Programs
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              For instructor: <span className="text-[#1F3463] dark:text-blue-400 font-medium">{instructor?.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Program list with search */}
        <div className="mb-4">
          <div className="relative mb-3">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1F3463] focus:border-transparent transition-all"
            />
          </div>

          <div className="max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {filteredPrograms.length > 0 ? (
              <div className="space-y-2">
                {filteredPrograms.map((program) => {
                  const isChecked = selectedPrograms.some((p) => p.id === program.id);
                  const selectedYearLevel = selectedPrograms.find((p) => p.id === program.id)?.yearLevel;
                  const isHigherEducation = isHigherEducationProgram(program);

                  return (
                    <div
                      key={program.id}
                      className={`p-3 rounded-lg border transition-all ${isChecked ? 'border-[#1F3463] bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors relative ${isChecked ? 'bg-[#1F3463] border-[#1F3463] text-white' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggle(program)}
                              className="absolute opacity-0 h-5 w-5 cursor-pointer"
                            />
                            {isChecked && <FaCheck className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                              {program.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {program.category}
                            </div>
                          </div>
                        </div>

                        {isChecked && isHigherEducation && (
                          <div className="relative">
                            <select
                              value={selectedYearLevel || ""}
                              onChange={(e) => handleYearLevelChange(program.id, e.target.value)}
                              className="appearance-none pl-3 pr-8 py-1.5 rounded-md border text-sm dark:bg-gray-700 dark:text-white bg-white border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-[#1F3463] focus:border-[#1F3463]"
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
                            <FaChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  No programs available
                </div>
                <button
                  onClick={fetchPrograms}
                  className="text-sm text-[#1F3463] dark:text-blue-400 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedPrograms.length} {selectedPrograms.length === 1 ? 'program' : 'programs'} selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isAssigning}
              className="px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isAssigning || selectedPrograms.length === 0}
              className="px-5 py-2.5 rounded-lg bg-[#1F3463] hover:bg-[#172a4d] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
            >
              {isAssigning ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Assigning...
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4" />
                  Assign
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignProgramModal;
