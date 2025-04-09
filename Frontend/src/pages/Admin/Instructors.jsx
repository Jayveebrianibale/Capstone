import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaBookOpen, FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import InstructorModal from "../../contents/Admin/InstructorModal";
import ConfirmModal from "../../contents/Admin/Modals/InstructorConfirmModal";
import InstructorService from "../../services/InstructorService";
import { LoadingProvider, useLoading } from "../../components/LoadingContext";
import FullScreenLoader from "../../components/FullScreenLoader";
import "react-toastify/dist/ReactToastify.css";
import AssignProgramModal from "../../contents/Admin/Modals/AssignProgramModal";

function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteInstructorId, setDeleteInstructorId] = useState(null);
  const [schoolYear, setSchoolYear] = useState("");
  const { loading, setLoading } = useLoading();
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  useEffect(() => {
    fetchInstructors();
    const currentYear = new Date().getFullYear();
    setSchoolYear(`${currentYear}-${currentYear + 1}`);
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const data = await InstructorService.getAll();
      setInstructors(data);
      setFilteredInstructors(data);
    } catch (error) {
      toast.error("Failed to fetch instructors.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredInstructors(
      instructors.filter((inst) =>
        inst.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await InstructorService.delete(deleteInstructorId);
      fetchInstructors();
      toast.success("Instructor deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete instructor.");
    } finally {
      setConfirmModalOpen(false);
      setLoading(false);
    }
  };

  const handleEdit = (instructor) => {
    setCurrentInstructor(instructor);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddInstructor = () => {
    setCurrentInstructor(null);
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <main className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <FullScreenLoader />}

      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 md:mb-0">
          Instructors - S.Y. {schoolYear}
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

      {/* No Instructors Message */}
      {instructors.length === 0 ? (
        <div className="text-center text-red-500 font-semibold">
          No instructors have been created yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="hidden md:grid grid-cols-4 gap-4 border-b bg-gray-100 dark:bg-gray-700 p-4 font-semibold text-sm text-gray-700 dark:text-gray-300 rounded-t-lg">
            <div className="px-4 py-3">Instructor Name</div>
            <div className="px-4 py-3">Email</div>
            <div className="px-4 py-3 text-center">Actions</div>
            <div className="px-4 py-3 text-center">Assign</div>
          </div>

          {filteredInstructors.map((inst) => (
            <div
              key={inst.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <div className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                <span className="font-semibold md:hidden">Instructor: </span>{inst.name}
              </div>
              
              <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 break-words">
                <span className="font-semibold md:hidden">Email: </span>{inst.email}
              </div>
              
              <div className="px-4 py-3 flex justify-center items-center gap-3">
                <button
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  onClick={() => handleEdit(inst)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-600 hover:text-red-700 transition-colors duration-200"
                  onClick={() => {
                    setDeleteInstructorId(inst.id);
                    setConfirmModalOpen(true);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="px-4 py-3 flex justify-center items-center">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2"
                  onClick={() => {
                    setSelectedInstructor(inst);
                    setAssignModalOpen(true);
                  }}
                >
                  <FaBookOpen /> Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleAddInstructor}
        className="fixed bottom-6 right-6 bg-[#1F3463] text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        title="Add Instructor"
      >
        <FaPlus size={12} />
      </button>

      <InstructorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={fetchInstructors}
        isEditing={isEditing}
        instructor={currentInstructor}
      />
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this instructor?"
      />
      <AssignProgramModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        instructor={selectedInstructor}
      />
    </main>
  );
}

export default Instructors;
