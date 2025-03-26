import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import ProgramService from "../../services/ProgramService";
import { toast, ToastContainer } from "react-toastify";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useLoading } from "../../components/LoadingContext";
import ProgramModal from "../../contents/Admin/ProgramModal";
import ProgramConfirmModal from "../../contents/Admin/ProgramConfirmModal";

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, setLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteProgramId, setDeleteProgramId] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await ProgramService.getAll();
      console.log("Fetched Programs:", response);
      setPrograms(Array.isArray(response.programs) ? response.programs : []);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
      toast.error("Failed to load programs.");
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteProgramId) return;
    setLoading(true);
    try {
      await ProgramService.delete(deleteProgramId);
      toast.success("Program deleted successfully.");
      fetchPrograms();
    } catch (error) {
      console.error("Failed to delete program:", error);
      toast.error("Failed to delete program.");
    } finally {
      setConfirmModalOpen(false);
      setLoading(false);
    }
  };

  const handleSave = async (programData) => {
    setLoading(true);


    if (!programData.name || !programData.category) {
        toast.error("Program name and category are required.");
        setLoading(false);
        return;
    }

    try {
        if (selectedProgram) {
            await ProgramService.update(selectedProgram.id, programData);
            toast.success("Program updated successfully.");
        } else {
            await ProgramService.create(programData);
            toast.success("Program added successfully.");
        }

        fetchPrograms();
        setIsModalOpen(false);
        setSelectedProgram(null);
    } catch (error) {
        console.error("Error saving program:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to save program.");
    } finally {
        setLoading(false);
    }
};


  const filteredPrograms = programs.filter((prog) =>
    prog.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 w-full md:w-auto"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No Programs and Levels Available
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="hidden md:grid grid-cols-5 gap-4 bg-gray-100 dark:bg-gray-700 p-4 font-semibold dark:text-white rounded-lg">
            <div className="px-4 py-3">Education Level</div>
            <div className="px-4 py-3">Program Name</div>
            <div className="px-4 py-3">Program Code</div>
            <div className="px-4 py-3 text-center">Year/Grade Level</div>
            <div className="px-4 py-3 text-center">Actions</div>
          </div>

          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="hidden md:grid grid-cols-5 gap-4 p-4 border-b rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="px-4 py-2 dark:text-gray-200">{prog.category}</div>
              <div className="px-4 py-2 dark:text-gray-200">{prog.name}</div>
              <div className="px-4 py-2 dark:text-gray-200">{prog.code || "N/A"}</div>
              <div className="px-4 py-2 text-center dark:text-gray-200">
                {prog.levels?.length > 0 ? prog.levels.map(level => level.name).join(", ") : "N/A"}
              </div>
              <div className="px-4 py-2 flex justify-center gap-3">
                <button onClick={() => handleEdit(prog)} className="text-blue-600 hover:underline">
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setDeleteProgramId(prog.id);
                    setConfirmModalOpen(true);
                  }}
                  className="text-red-600 hover:underline"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="fixed bottom-6 right-6 bg-[#1F3463] text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => setIsModalOpen(true)}
      >
        <FaPlus size={12} />
      </button>

      <ProgramModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} program={selectedProgram} />
      <ProgramConfirmModal isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={handleDelete} message="Are you sure you want to delete this program?" />
    </main>
  );
}

export default Programs;
