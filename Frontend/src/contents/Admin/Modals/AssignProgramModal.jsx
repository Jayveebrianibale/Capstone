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
      setSelectedPrograms(instructor?.programs?.map(p => p.id) || []);
    }
  }, [isOpen, instructor]);

  const fetchPrograms = async () => {
    try {
      const data = await ProgramService.getAll();
      const extracted = Array.isArray(data)
        ? data
        : data?.programs || [];

      const normalized = extracted.map(p => ({
        id: p.id,
        name: p.name,
        yearLevel: p.year_level || p.yearLevel || "N/A",
      }));

      setPrograms(normalized);
    } catch (err) {
      toast.error("Failed to fetch programs.");
      console.error(err);
    }
  };

  const handleToggle = (id) => {
    setSelectedPrograms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      await InstructorService.assignPrograms(instructor.id, selectedPrograms);
      toast.success("Programs assigned successfully!");
      onClose();
    } catch {
      toast.error("Failed to assign programs.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg transition-all">
        <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-white">
          Assign Programs to <span className="text-[#1F3463] dark:text-blue-400">{instructor?.name}</span>
        </h2>

        <div className="max-h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {programs.length > 0 ? (
            programs.map((program) => (
              <label
                key={program.id}
                className="flex items-start gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md transition"
              >
                <input
                  type="checkbox"
                  checked={selectedPrograms.includes(program.id)}
                  onChange={() => handleToggle(program.id)}
                  className="mt-1 accent-[#1F3463] w-4 h-4"
                />
                <div className="text-gray-700 dark:text-gray-200">
                  <div className="font-medium">{program.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Year Level: {program.yearLevel}
                  </div>
                </div>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No programs found.</p>
          )}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-gray-800 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg bg-[#1F3463] hover:bg-blue-700 transition text-white font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignProgramModal;
