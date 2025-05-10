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
import { Users } from "lucide-react";

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

   const primaryColor = "#1F3463";
  const hoverColor = "#172a4d";

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

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Instructor Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            School Year {schoolYear}
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search instructors..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1F3463] focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleAddInstructor}
            className="bg-[#1F3463] hover:bg-[#172a4d] text-white px-3 py-3 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
            placeholder='Add Instructor'
          >
            <FaPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      {instructors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <Users className="w-20 h-20 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No Instructors Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
            Start by adding new instructors to the system
          </p>
          <button
            onClick={handleAddInstructor}
            className="bg-[#1F3463] hover:bg-[#172a4d] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Add First Instructor
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Instructor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInstructors.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50 dark:hover:bg-gray-600/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                      {inst.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {inst.email}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          onClick={() => handleEdit(inst)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteInstructorId(inst.id);
                            setConfirmModalOpen(true);
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
                          >
                          <FaTrash className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInstructor(inst);
                            setAssignModalOpen(true);
                          }}
                          className="px-4 py-2 bg-[#1F3463] hover:bg-[#172a4d] text-white rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <FaBookOpen className="w-4 h-4" />
                          <span>Assign</span>
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
        onClick={handleAddInstructor}
        className="fixed bottom-8 right-8 bg-[#1F3463] hover:bg-[#172a4d] text-white p-4 rounded-full shadow-lg transition-all hover:scale-105"
        title="Add Instructor"
      >
        <FaPlus className="w-6 h-6" />
      </button> */}

      {/* Modals */}
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