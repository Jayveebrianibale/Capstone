import { useEffect, useState } from "react";
import ProgramService from "../../../services/ProgramService";
import InstructorService from "../../../services/InstructorService";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaChevronDown, FaSearch } from "react-icons/fa";
import { formatGradeLevelText, validateGradeLevel, getYearLevelOptions } from "../../../utils/gradeLevelFormatter";

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
          yearLevels: p.pivot?.yearLevel ? [p.pivot.yearLevel] : []
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
        // Get the appropriate year level based on program category
        let defaultYearLevel = getDefaultYearLevel(program);
        return [
          ...prev,
          { 
            id: program.id, 
            yearLevels: [defaultYearLevel]
          },
        ];
      }
    });
  };

  const handleSave = async () => {
    try {
      setIsAssigning(true);
      
      // Format the data for the API
      const formattedData = {
        programs: selectedPrograms.map(p => {
          const program = programs.find(prog => prog.id === p.id);
          // Extract grade level from program name
          const match = program.name.match(/Grade (\d+)/);
          const gradeLevel = match ? parseInt(match[1], 10) : null;
          
          const formattedProgram = {
            id: p.id,
            yearLevels: gradeLevel ? [gradeLevel] : p.yearLevels.map(level => parseInt(level)),
            programName: program?.name
          };
          console.log('Formatted program:', formattedProgram);
          return formattedProgram;
        })
      };

      // Log the complete data being sent
      console.log('Complete data being sent:', {
        instructorId: instructor.id,
        programs: formattedData.programs
      });

      try {
        const response = await InstructorService.assignPrograms(instructor.id, formattedData.programs);
        console.log('Raw response from server:', response);
        
        if (response) {
          toast.success("Programs assigned successfully");
          onClose();
        } else {
          throw new Error("No response from server");
        }
      } catch (apiError) {
        console.error('API Error Details:', {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status,
          config: apiError.config
        });
        throw apiError;
      }
    } catch (error) {
      console.error("Error assigning programs:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      // More specific error messages
      if (error.response?.status === 422) {
        toast.error("Invalid data format. Please check your selections.");
      } else if (error.response?.status === 404) {
        toast.error("Instructor not found.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.response?.data?.message || "Failed to assign programs. Please try again.");
      }
    } finally {
      setIsAssigning(false);
    }
  };

  const getDefaultYearLevel = (program) => {
    // Extract grade level from program name for all categories
    const match = program.name.match(/Grade (\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }

    // If no grade level found in name, use default values
    switch (program.category) {
      case 'Junior High':
        return 7; // Default to Grade 7
      case 'Senior High':
        return 11; // Default to Grade 11
      case 'Higher Education':
        return 1; // Default to 1st Year
      case 'Intermediate':
        return 4; // Default to Grade 4
      default:
        return null;
    }
  };

  const filteredPrograms = programs.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-2xl transition-all transform">
        {/* Header with close button */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Assign Programs
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              For instructor: <span className="text-[#1F3463] dark:text-blue-400 font-medium">{instructor?.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Program list with search */}
        <div className="mb-6">
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1F3463] focus:border-transparent transition-all text-base"
            />
          </div>

          <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {filteredPrograms.length > 0 ? (
              <div className="space-y-3">
                {filteredPrograms.map((program) => {
                  const isChecked = selectedPrograms.some((p) => p.id === program.id);
                  const selectedYearLevels = selectedPrograms.find((p) => p.id === program.id)?.yearLevels || [];

                  return (
                    <div
                      key={program.id}
                      className={`p-4 rounded-lg border transition-all ${isChecked ? 'border-[#1F3463] bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors relative mt-1 ${isChecked ? 'bg-[#1F3463] border-[#1F3463] text-white' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggle(program)}
                              className="absolute opacity-0 h-5 w-5 cursor-pointer"
                            />
                            {isChecked && <FaCheck className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200 text-base">
                              {program.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                              {program.category}
                            </div>
                          </div>
                        </div>
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
              className="px-6 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isAssigning || selectedPrograms.length === 0}
              className="px-6 py-2.5 rounded-lg bg-[#1F3463] hover:bg-[#172a4d] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
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
