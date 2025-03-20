import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaBookOpen, FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import InstructorModal from "../../contents/Admin/InstructorModal";
import ConfirmModal from "../../components/InstructorConfirmModal";
import { fetchInstructors, saveInstructor, updateInstructor, deleteInstructor } from "../../services/InstructorService";
import { useLoading } from "../../components/LoadingContext";
import FullScreenLoader from "../../components/FullScreenLoader"; 
import "react-toastify/dist/ReactToastify.css";

function Instructors() {
  const { setLoading } = useLoading(); 
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [instructorToEdit, setInstructorToEdit] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteInstructorId, setDeleteInstructorId] = useState(null);
  const [schoolYear, setSchoolYear] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchInstructors();
        setInstructors(data);
        setFilteredInstructors(data);
      } catch {
        toast.error("Failed to load instructors.");
      } finally {
        setLoading(false); 
      }
    };

    fetchData();

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    setSchoolYear(`${currentYear}-${nextYear}`);
  }, []);

  const handleSave = async (newInstructor) => {
    if (isSaving) return;

    setIsSaving(true);
    setLoading(true);

    try {
      if (isEditing) {
        await updateInstructor(newInstructor);
        toast.success("Instructor updated successfully!");
      } else {
        await saveInstructor(newInstructor);
        toast.success("Instructor added successfully!");
      }

      setShowModal(false);
      setIsEditing(false);
      setInstructorToEdit(null);

      const updatedData = await fetchInstructors();
      setInstructors(updatedData);
      setFilteredInstructors(updatedData);
    } catch (error) {
      toast.error("Failed to save instructor.");
    } finally {
      setIsSaving(false);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteInstructor(deleteInstructorId);
      const updatedData = await fetchInstructors();
      setInstructors(updatedData);
      setFilteredInstructors(updatedData);
      toast.success("Instructor deleted successfully!");
    } catch {
      toast.error("Failed to delete instructor.");
    } finally {
      setConfirmModalOpen(false);
      setLoading(false);
    }
  };

  return (
    <main className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <FullScreenLoader />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Instructors - S.Y. {schoolYear}
        </h1>

        {/* 🔍 Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {filteredInstructors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No instructors available</p>
          <button
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
              setInstructorToEdit(null);
            }}
            className="mt-4 bg-[#1F3463] text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Add Instructor
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="grid grid-cols-4 gap-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 p-4 font-semibold">
            <div className="px-4 py-3">Instructor Name</div>
            <div className="px-4 py-3">Email</div>
            <div className="px-4 py-3 text-center">Actions</div>
            <div className="px-4 py-3 text-center">Assign</div>
          </div>

          {filteredInstructors.map((instructor) => (
            <div key={instructor.id} className="grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="px-4 py-2 dark:text-gray-200">{instructor.name}</div>
              <div className="px-4 py-2 dark:text-gray-200">{instructor.email}</div>

              <div className="px-4 py-2 flex justify-center gap-3">
                {/* ✅ Fix: Edit Instructor */}
                <button
                  onClick={() => {
                    setInstructorToEdit(instructor);
                    setIsEditing(true);
                    setShowModal(true);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  <FaEdit />
                </button>

                {/* ✅ Fix: Delete Instructor */}
                <button
                  onClick={() => {
                    setDeleteInstructorId(instructor.id);
                    setConfirmModalOpen(true);
                  }}
                  className="text-red-600 hover:underline"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="px-4 py-2 flex justify-center">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2"
                >
                  <FaBookOpen /> Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => {
          setShowModal(true);
          setIsEditing(false);
          setInstructorToEdit(null);
        }}
        className="fixed bottom-6 right-6 bg-[#1F3463] text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        title="Add Instructor"
      >
        <FaPlus size={12} />
      </button>

      {/* Instructor Modal */}
      <InstructorModal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false);
          setIsEditing(false);
          setInstructorToEdit(null);
        }} 
        onSave={handleSave} 
        isEditing={isEditing} 
        instructorToEdit={instructorToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={confirmModalOpen} 
        onClose={() => setConfirmModalOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Confirmation"
        message="Are you sure you want to delete this instructor?" 
      />
    </main>
  );
}

export default Instructors;
