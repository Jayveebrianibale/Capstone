import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import ProgramService from "../../services/ProgramService";
import { toast, ToastContainer } from "react-toastify";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useLoading } from "../../components/LoadingContext";
import HigherEducationModal from "../../contents/Admin/Modals/HigherEducationModal";
import SeniorHighModal from "../../contents/Admin/Modals/SeniorHighModal";
import JuniorHighModal from "../../contents/Admin/Modals/JuniorHighModal";
import IntermediateModal from "../../contents/Admin/Modals/IntermediateModal";

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, setLoading } = useLoading();
  const [activeTab, setActiveTab] = useState("Higher Education");
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await ProgramService.getAll();
      console.log("Fetched programs:", response); // ✅ Debugging
      setPrograms(Array.isArray(response.programs) ? response.programs : []);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Failed to load programs.");
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs
    .filter((prog) => prog.category === activeTab)
    .filter((prog) =>
      prog.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const openAddProgramModal = () => {
    setSelectedProgram(null);
    setActiveModal(activeTab);
  };

  const openEditProgramModal = (program) => {
    setSelectedProgram(program);
    setActiveModal(activeTab);
  };

  const handleSaveProgram = async (programData, isEditing, programId) => {
    try {
      if (isEditing) {
        console.log("Updating program:", programId, programData); // ✅ Debugging
        await ProgramService.update(programId, programData);
        toast.success("Program updated successfully!");
      } else {
        await ProgramService.create(programData);
        toast.success("Program added successfully!");
      }

      fetchPrograms(); // ✅ Always fetch updated data
      setActiveModal(null);
    } catch (error) {
      console.error("Error saving program:", error);
      toast.error("Error saving program.");
    }
  };

  return (
    <main className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <FullScreenLoader />}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Academic Programs and Grade Levels
        </h1>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 w-full md:w-auto"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="flex border-b mb-4 dark:bg-gray-800">
        {["Higher Education", "Senior High", "Junior High", "Intermediate"].map(
          (category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`py-2 px-4 text-lg font-semibold transition ${
                activeTab === category
                  ? "border-b-4 border-[#1F3463] text-[#1F3463] dark:text-white dark:border-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {category}
            </button>
          )
        )}
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No Programs Available for {activeTab}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="hidden md:grid grid-cols-4 gap-4 border-b bg-gray-100 dark:bg-gray-700 p-4 font-semibold text-sm text-gray-700 dark:text-gray-300 rounded-t-lg">
            <div className="px-4 py-3">Program Name</div>
            <div className="px-4 py-3">Program Code</div>
            <div className="px-4 py-3">Year Level</div>
            <div className="px-4 py-3 text-center">Actions</div>
          </div>

          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="grid grid-cols-4 gap-4 p-4 border-b dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-b-lg transition-all duration-200"
            >
              <div className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                {prog.name}
              </div>
              <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {prog.code || "N/A"}
              </div>
              <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {prog.yearLevel || "N/A"}
              </div>
              <div className="px-4 py-3 text-center">
                <button
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  onClick={() => openEditProgramModal(prog)}
                >
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-700 ml-3 transition-colors duration-200">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="fixed bottom-6 right-6 bg-[#1F3463] text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={openAddProgramModal}
      >
        <FaPlus size={12} />
      </button>

      {activeModal && (
        <HigherEducationModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSave={handleSaveProgram}
          isEditing={!!selectedProgram}
          program={selectedProgram}
        />
      )}
    </main>
  );
}

export default Programs;
