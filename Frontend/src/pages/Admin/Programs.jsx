import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import ProgramService from "../../services/ProgramService";
import { toast, ToastContainer } from "react-toastify";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useLoading } from "../../components/LoadingContext";
import ProgramConfirmModal from "../../contents/Admin/Modals/ProgramConfirmModal";
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteProgramId, setDeleteProgramId] = useState(null);
  const primaryColor = "#1F3463";
  const hoverColor = "#172a4d";


  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
        const response = await ProgramService.getAll();
        console.log("Fetched programs:", response);
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
  .filter((prog) => prog.category.toLowerCase() === activeTab.toLowerCase())
  .filter((prog) =>
      prog.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
      console.log("Filtered programs:", filteredPrograms);

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
            const updatedProgram = await ProgramService.update(programId, programData);
            console.log("Updated program:", updatedProgram);
            toast.success("Program updated successfully!");
        } else {
            await ProgramService.create(programData);
            toast.success("Program added successfully!");
        }

        await fetchPrograms(); 
        setActiveModal(null); 
    } catch (error) {
        console.error("Error saving program:", error);
        toast.error("Error saving program.");
    }
};

const handleDeleteProgram = async () => {
  if (!deleteProgramId) return;

  try {
    await ProgramService.delete(deleteProgramId);
    toast.success("Program deleted successfully!");
    await fetchPrograms();
  } catch (error) {
    console.error("Error deleting program:", error);
    toast.error("Failed to delete program.");
  } finally {
    setIsConfirmModalOpen(false);
    setDeleteProgramId(null);
  }
};

  return (
    <main className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <FullScreenLoader />}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Academic Programs Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Manage all academic programs and grade levels
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1F3463] focus:border-transparent transition-all text-base"
            />
          </div>
          <button
            onClick={openAddProgramModal}
            className={`bg-[#1F3463] hover:bg-[#172a4d] text-white px-3 py-2.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap text-base font-medium`}
            placeholder='Add Program'
          >
            <FaPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto pb-2 mb-6">
        {["Higher Education", "Senior High", "Junior High", "Intermediate"].map(
          (category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === category
                  ? `bg-[${primaryColor}] text-white rounded-lg shadow-sm`
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          )
        )}
      </div>

      {/* Content Section */}
      {filteredPrograms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <div className="w-20 h-20 bg-[#1F3463]/10 dark:bg-[#1F3463]/20 rounded-full flex items-center justify-center mb-4">
            <FaPlus className="w-8 h-8 text-[#1F3463] dark:text-[#1F3463]/80" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Programs Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
            Start by adding new programs to {activeTab}
          </p>
          <button
            onClick={openAddProgramModal}
            className={`bg-[${primaryColor}] hover:bg-[${hoverColor}] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors`}
          >
            <FaPlus className="w-4 h-4" />
            Add Program
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Details
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPrograms.map((prog) => (
                  <tr key={prog.id} className="hover:bg-gray-50 dark:hover:bg-gray-600/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-10 bg-[${primaryColor}] rounded-full`}></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-200">{prog.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{prog.code || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      <div className="flex flex-col gap-1">
                        <span className="inline-block px-2 py-1 dark:bg-gray-700 rounded text-sm">
                          Year Level: {prog.yearLevel || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          onClick={() => openEditProgramModal(prog)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteProgramId(prog.id);
                            setIsConfirmModalOpen(true);
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Action Button
      <button
        className="fixed bottom-8 right-8 bg-[#1F3463] hover:bg-[#172a4d] text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2"
        onClick={openAddProgramModal}
      >
        <FaPlus className="w-5 h-5" />
        <span className="hidden sm:inline-block">Add Program</span>
      </button> */}

      {/* Modals */}
      {activeModal && (
        <>
          {activeTab === "Higher Education" && (
            <HigherEducationModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
              onSave={handleSaveProgram}
              isEditing={!!selectedProgram}
              program={selectedProgram}
            />
          )}
          {activeTab === "Senior High" && (
            <SeniorHighModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
              onSave={handleSaveProgram}
              isEditing={!!selectedProgram}
              program={selectedProgram}
            />
          )}
          {activeTab === "Junior High" && (
            <JuniorHighModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
              onSave={handleSaveProgram}
              isEditing={!!selectedProgram}
              program={selectedProgram}
            />
          )}
          {activeTab === "Intermediate" && (
            <IntermediateModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
              onSave={handleSaveProgram}
              isEditing={!!selectedProgram}
              program={selectedProgram}
            />
          )}
        </>
      )}

      <ProgramConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteProgram}
        title="Confirm Deletion"
        message="Are you sure you want to delete this program?"
      />
    </main>
  );
}

export default Programs;