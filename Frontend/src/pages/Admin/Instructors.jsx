import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaBookOpen, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiUpload } from 'react-icons/fi';
import { toast, ToastContainer } from "react-toastify";
import InstructorModal from "../../contents/Admin/InstructorModal";
import ConfirmModal from "../../contents/Admin/Modals/InstructorConfirmModal";
import InstructorService from "../../services/InstructorService";
import { useLoading } from "../../components/LoadingContext";
import FullScreenLoader from "../../components/FullScreenLoader";
import "react-toastify/dist/ReactToastify.css";
import AssignProgramModal from "../../contents/Admin/Modals/AssignProgramModal";
import { Users, UserX } from "lucide-react";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";

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

  // State for assigned programs modal
  const [assignedProgramsModalOpen, setAssignedProgramsModalOpen] = useState(false);
  const [assignedPrograms, setAssignedPrograms] = useState([]);
  const [assignedProgramsInstructor, setAssignedProgramsInstructor] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const instructorsPerPage = 10;
  const totalPages = Math.ceil(filteredInstructors.length / instructorsPerPage);
  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * instructorsPerPage,
    currentPage * instructorsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
    setCurrentPage(1); // Reset to first page on new search
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
    setCurrentInstructor({ status: 'Active' });
    setIsEditing(false);
    setShowModal(true);
  };

  // Handle CSV bulk upload
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const result = await InstructorService.bulkUpload(file);
      toast.success(result.message || "Instructors uploaded successfully!");
      fetchInstructors();
    } catch (error) {
      toast.error(error.message || "Upload failed. Please check your CSV file.");
    } finally {
      setLoading(false);
      // Reset file input so user can re-upload if needed
      e.target.value = null;
    }
  };

  // Download sample CSV for instructors
  const handleDownloadTemplate = () => {
    const csvContent = `name,email\nJohn Doe,johndoe@email.com\nJane Smith,janesmith@email.com\n`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "instructors_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler to fetch and show assigned programs
  const handleCheckDetails = async (instructor) => {
    setLoading(true);
    try {
      const response = await InstructorService.fetchAssignedPrograms(instructor.id);
      let programs = [];
      // If response is not an object (e.g., HTML), treat as error
      if (typeof response !== 'object' || response === null) {
        throw new Error('Invalid response from server.');
      }
      if (Array.isArray(response)) {
        programs = response;
      } else if (response && Array.isArray(response.programs)) {
        programs = response.programs;
      } else if (response && response.data && Array.isArray(response.data.programs)) {
        programs = response.data.programs;
      }
      programs = programs.map(prog => ({
        id: prog.id,
        name: prog.name || prog.program_name || "Unnamed Program",
        year_level: (prog.pivot && prog.pivot.yearLevel) ? prog.pivot.yearLevel : (prog.year_level || prog.yearLevel),
        section: prog.section
      }));
      setAssignedPrograms(programs);
      setAssignedProgramsInstructor(instructor);
      setAssignedProgramsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch assigned programs:", error);
      toast.error("Failed to fetch assigned programs. Please check your backend API endpoint.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to display year level as '1st year', '2nd year', etc.
  function getYearLevelLabel(year) {
    const n = parseInt(year, 10);
    if (isNaN(n)) return "";
    if (n === 1) return "1st year";
    if (n === 2) return "2nd year";
    if (n === 3) return "3rd year";
    return `${n}th year`;
  }

  return (
    <main className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <FullScreenLoader />}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Instructor Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            School Year {schoolYear}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        <div className="flex-1">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-[#1F3463] focus-within:border-transparent transition-all">
              <div className="pl-4 pr-2 text-gray-400">
                <FaSearch className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search instructors..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full py-2.5 pr-4 bg-transparent outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleAddInstructor}
             className="bg-[#1F3463] hover:bg-[#19294f] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <FaPlus className="w-4 h-4 text-sm font-semibold" /> Add Instructor
          </button>
        </div>
      </div>

        {instructors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] bg-white border dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#f0f4ff] dark:bg-[#1a2a4a] flex items-center justify-center shadow-sm border border-[#e0e7ff] dark:border-gray-600">
                <UserX className="w-7 h-7 text-[#1F3463] dark:text-[#5d7cbf]" />
              </div>
            </div>
          {/* Text Content */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            No instructors yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
            Get started by adding new instructors individually or upload a CSV file
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md"> 
            <label className="border border-[#1F3463] text-[#1F3463] dark:text-white dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all flex-1 cursor-pointer">
              <FiUpload className="w-4 h-4" /> Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
          </div>
          
          {/* CSV Helper Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need a template?{' '}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="underline text-[#1F3463] dark:text-[#5d7cbf] font-medium hover:text-[#17284e] focus:outline-none"
              >
                Download sample CSV
              </button>
            </p>
          </div>
        </div>
        ) : (
          <>
        
        <div className="hidden md:block bg-white border dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium  dark:text-gray-400 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium  dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedInstructors.map((inst) => (
                  <tr
                    key={inst.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#1F3463] flex items-center justify-center">
                          <span className="text-white font-medium">
                            {inst.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {inst.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        {inst.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#22c55e' }}></span>
                        {inst.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleEdit(inst)}
                          className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteInstructorId(inst.id);
                            setConfirmModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInstructor(inst);
                            setAssignModalOpen(true);
                          }}
                          className="px-3 py-2 bg-[#1F3463] hover:bg-[#172a4d] text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                        >
                          <MdOutlineAssignmentTurnedIn className="w-3.5 h-3.5" />
                          <span>Assign</span>
                        </button>
                        <button
                          onClick={() => handleCheckDetails(inst)}
                          className="px-3 py-2 border border-green-600 text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
                          title="Check Details"
                        >
                          <FaBookOpen className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 py-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-md border border-[#1F3463] text-[#1F3463] bg-white dark:bg-gray-900 hover:bg-[#1F3463] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Previous page"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-md font-semibold border border-[#1F3463] mx-0.5 text-sm ${
                  currentPage === idx + 1
                    ? 'bg-[#1F3463] text-white'
                    : 'bg-white text-[#1F3463] dark:bg-gray-900'
                } hover:bg-[#1F3463] hover:text-white transition`}
                aria-label={`Page ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-md border border-[#1F3463] text-[#1F3463] bg-white dark:bg-gray-900 hover:bg-[#1F3463] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Next page"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      
        {/* Mobile Grid - below md */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredInstructors.map((inst) => (
            <div key={inst.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-9 w-9 rounded-full bg-[#1F3463] flex items-center justify-center">
                    <span className="text-white font-medium">
                      {inst.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{inst.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{inst.email}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 flex justify-end space-x-2">
                <button 
                  onClick={() => handleEdit(inst)} 
                  className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setDeleteInstructorId(inst.id); setConfirmModalOpen(true); }} 
                  className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setSelectedInstructor(inst); setAssignModalOpen(true); }} 
                  className="px-2.5 py-1 bg-[#1F3463] hover:bg-[#172a4d] text-white rounded-md flex items-center gap-1 text-xs"
                >
                  <FaBookOpen className="w-3 h-3" />
                  <span>Assign</span>
                </button>
                <button 
                  onClick={() => handleCheckDetails(inst)} 
                  className="px-2.5 py-1 border border-green-600 text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md flex items-center gap-1 text-xs font-medium shadow-sm"
                  title="Check Details"
                >
                  <FaBookOpen className="w-3 h-3" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </>)}
      {/* Modals */}
      <InstructorModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={fetchInstructors} isEditing={isEditing} instructor={currentInstructor} />
      <ConfirmModal 
        isOpen={confirmModalOpen} 
        onClose={() => setConfirmModalOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Confirmation" 
        message="Are you sure you want to delete this instructor?" 
        loading={loading && confirmModalOpen}
      />
      <AssignProgramModal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} instructor={selectedInstructor} onSave={fetchInstructors} />
        {assignedProgramsModalOpen && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-start p-6 pb-4 border-b dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Assigned Programs
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Instructor: <span className="text-[#1F3463] dark:text-blue-400 font-medium">{assignedProgramsInstructor?.name}</span>
            </p>
          </div>
          <button
            onClick={() => setAssignedProgramsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
            aria-label="Close modal"
          >
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {assignedPrograms.length > 0 ? (
            <div className="space-y-3">
              {assignedPrograms.map((prog) => (
                <div 
                  key={`${prog.id}-${prog.year_level}-${prog.section}`}
                  className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {prog.name}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                        {prog.year_level && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#1F3463] mr-2"></span>
                            {getYearLevelLabel(prog.year_level)}
                          </div>
                        )}
                        {prog.section && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                            Section: {prog.section}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                No programs assigned
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                This instructor doesn't have any assigned programs yet.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={() => setAssignedProgramsModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-[#1F3463] hover:bg-[#172a4d] text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
    </main>
  );
}

export default function InstructorsWrapper() {
  return <Instructors />;
}
