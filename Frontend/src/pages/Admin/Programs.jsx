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
  const [activeTab, setActiveTab] = useState("Higher_Education");
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await ProgramService.getAll();
      setPrograms(Array.isArray(response.programs) ? response.programs : []);
    } catch (error) {
      toast.error("Failed to load programs.");
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter((prog) => prog.category === activeTab);

  const openAddProgramModal = () => {
    setActiveModal(activeTab);
  };

  // ✅ Handle Saving a Program
  const handleSaveProgram = async (programData) => {
    try {
      await ProgramService.create(programData);
      toast.success("Program added successfully!");
      fetchPrograms(); // Refresh the list
      setActiveModal(null); // Close modal after saving
    } catch (error) {
      toast.error("Error adding program.");
    }
  };

  return (
    <main className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <FullScreenLoader />}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
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
        {["Higher_Education", "Senior_High", "Junior_High", "Intermediate"].map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`py-2 px-4 text-lg font-semibold transition ${
              activeTab === category
                ? "border-b-4 border-[#1F3463] text-[#1F3463] dark:text-white dark:border-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {category.replace("_", " ")}
          </button>
        ))}
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No Programs Available for {activeTab.replace("_", " ")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => (
            <div key={prog.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold dark:text-gray-200">{prog.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{prog.code || "N/A"}</p>
              <p className="text-gray-500 dark:text-gray-400">
                {prog.levels?.length > 0 ? prog.levels.map(level => level.name).join(", ") : "N/A"}
              </p>
              <div className="flex justify-end gap-3 mt-3">
                <button className="text-blue-600 hover:underline">
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:underline">
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

      {activeModal === "Higher_Education" && (
        <HigherEducationModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSave={handleSaveProgram} // ✅ Pass function
          isEditing={false}
          program={null}
        />
      )}
    </main>
  );
}

export default Programs;
