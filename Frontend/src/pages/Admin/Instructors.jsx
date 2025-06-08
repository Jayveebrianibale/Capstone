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
  const [assignedProgramsModalOpen, setAssignedProgramsModalOpen] = useState(false);
  const [assignedPrograms, setAssignedPrograms] = useState([]);
  const [assignedProgramsInstructor, setAssignedProgramsInstructor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [removingProgramId, setRemovingProgramId] = useState(null);
  const instructorsPerPage = 10;
  const totalPages = Math.ceil(filteredInstructors.length / instructorsPerPage);
  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * instructorsPerPage,
    currentPage * instructorsPerPage
  );

  const getDynamicSchoolYears = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11 (Jan-Dec)
    
    // Define your academic year start months (June=5, July=6, August=7, September=8)
    const academicStartMonths = [6, 7, 8]; // July, August, September
    const academicEndMonths = [5, 6]; // June, July
    
    // Determine if current month is in the start period
    const isStartMonth = academicStartMonths.includes(currentMonth);
    const isEndMonth = academicEndMonths.includes(currentMonth);
    
    let startYear = currentYear;
    let endYear = currentYear + 1;
    
    if (isStartMonth) {
      // If current month is a start month, academic year starts this year
      startYear = currentYear;
      endYear = currentYear + 1;
    } else if (isEndMonth) {
      // If current month is an end month, academic year ends this year
      startYear = currentYear - 1;
      endYear = currentYear;
    } else if (currentMonth < Math.min(...academicStartMonths)) {
      // Before academic year starts
      startYear = currentYear - 1;
      endYear = currentYear;
    } else {
      // After start months but before end months (in the middle of academic year)
      startYear = currentYear;
      endYear = currentYear + 1;
    }

    // Return current and next academic year
    return [
      `${startYear}-${endYear}`,
      `${startYear + 1}-${endYear + 1}`
    ];
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    fetchInstructors();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const academicStartMonths = [6, 7, 8];
    const academicEndMonths = [5, 6];
    
    let startYear = currentYear;
    let endYear = currentYear + 1;
    
    if (academicStartMonths.includes(currentMonth)) {
      startYear = currentYear;
      endYear = currentYear + 1;
    } else if (academicEndMonths.includes(currentMonth)) {
      startYear = currentYear - 1;
      endYear = currentYear;
    } else if (currentMonth < Math.min(...academicStartMonths)) {
      startYear = currentYear - 1;
      endYear = currentYear;
    } else {
      startYear = currentYear;
      endYear = currentYear + 1;
    }
    
    setSchoolYear(`${startYear}-${endYear}`);
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
    const searchLower = query.toLowerCase();
    setFilteredInstructors(
      instructors.filter((inst) =>
        inst.name.toLowerCase().includes(searchLower) ||
        (inst.email && inst.email.toLowerCase().includes(searchLower))
      )
    );
    setCurrentPage(1);
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
      e.target.value = null;
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = `name,email,programs
    John Doe,johndoe@email.com,"[{""code"":""BSIS"",""yearLevel"":1},{""code"":""BSA"",""yearLevel"":2}]"
    Jane Smith,janesmith@email.com,"[{""code"":""BAB"",""yearLevel"":1}]"`;
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "instructors_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCheckDetails = async (instructor) => {
    setLoading(true);
    try {
      const response = await InstructorService.fetchAssignedPrograms(instructor.id);
      let programs = [];
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

  const handleRemoveProgram = async (instructorId, programId, yearLevel) => {
    try {
      setRemovingProgramId(`${programId}-${yearLevel}`);
      await InstructorService.removeProgram(instructorId, programId, yearLevel);
      toast.success("Program removed successfully");
      handleCheckDetails(assignedProgramsInstructor);
    } catch (error) {
      toast.error("Failed to remove program");
    } finally {
      setRemovingProgramId(null);
    }
  };

  function getYearLevelLabel(year) {
    const n = parseInt(year, 10);
    if (isNaN(n)) return "";
    if (n === 1) return "1st year";
    if (n === 2) return "2nd year";
    if (n === 3) return "3rd year";
    return `${n}th year`;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-4 lg:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <FullScreenLoader />}

      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3463] dark:text-white mb-1">
            Instructor Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            School Year {schoolYear}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-start md:justify-end">
          <div className="flex-1 md:flex-none">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-[#1F3463] focus-within:border-transparent transition-all">
              <div className="pl-3 pr-2 text-gray-400">
                <FaSearch className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search instructors..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full py-2.5 pr-4 bg-transparent outline-none text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleAddInstructor}
            className="bg-[#1F3463] hover:bg-[#19294f] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <FaPlus className="w-4 h-4" />
            <span className="text-sm font-semibold">Add Instructor</span>
          </button>
        </div>
      </div>

      {instructors.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white border dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#f0f4ff] dark:bg-[#1a2a4a] flex items-center justify-center shadow-sm border border-[#e0e7ff] dark:border-gray-600">
              <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-[#1F3463] dark:text-[#5d7cbf]" />
            </div>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
            No instructors yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-center text-sm sm:text-base max-w-md px-2">
            Get started by adding new instructors individually or upload a CSV file
          </p>
          
          <div className="flex flex-col w-full max-w-xs gap-3">
            <label className="border border-[#1F3463] text-[#1F3463] dark:text-white dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-sm sm:text-base">
              <FiUpload className="w-4 h-4" /> Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="mt-6 sm:mt-8 text-center px-4">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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
      ) : filteredInstructors.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white border dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#f0f4ff] dark:bg-[#1a2a4a] flex items-center justify-center shadow-sm border border-[#e0e7ff] dark:border-gray-600">
              <FaSearch className="w-6 h-6 sm:w-8 sm:h-8 text-[#1F3463] dark:text-[#5d7cbf]" />
            </div>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
            No matching instructors found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-center text-sm sm:text-base max-w-md px-2">
            Try adjusting your search query or browse all instructors
          </p>
          <button
            onClick={() => handleSearch("")}
            className="text-[#1F3463] dark:text-[#5d7cbf] font-medium hover:text-[#17284e] focus:outline-none underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden mb-4">
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedInstructors.map((inst) => (
                    <tr key={inst.id} className="hover:bg-gray-50 dark:hover:bg-gray-600/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#1F3463] flex items-center justify-center text-white font-medium">
                            {inst.name?.trim() ? inst.name.trim().charAt(0).toUpperCase() : "?"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm dark:text-gray-200 truncate">
                              {inst.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                        {inst.email}
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
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
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
                            className="px-3 py-2 bg-[#1F3463] hover:bg-[#172a4d] text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                          >
                            <MdOutlineAssignmentTurnedIn className="w-4 h-4" />
                            <span>Assign</span>
                          </button>
                          <button
                            onClick={() => handleCheckDetails(inst)}
                            className="px-3 py-2 border border-green-600 text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
                          >
                            <FaBookOpen className="w-4 h-4" />
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

          {/* Mobile Card View */}
          <div className="lg:hidden">
            <div className="grid gap-2 sm:gap-3 p-2 sm:p-3 grid-cols-1">
              {paginatedInstructors.map((inst) => (
                <div key={inst.id} className="p-2 sm:p-3 border rounded-lg shadow-sm bg-white dark:bg-gray-900 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1F3463] flex items-center justify-center text-white font-medium flex-shrink-0">
                      {inst.name?.trim() ? inst.name.trim().charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-[#1F3463] dark:text-white truncate">
                        {inst.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                        {inst.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: '#22c55e' }}></span>
                      {inst.status || 'Active'}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-end items-center gap-1.5 sm:gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleEdit(inst)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors touch-target"
                      title="Edit"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteInstructorId(inst.id);
                        setConfirmModalOpen(true);
                      }}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors touch-target"
                      title="Delete"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInstructor(inst);
                        setAssignModalOpen(true);
                      }}
                      className="px-2 py-1 sm:px-2.5 sm:py-1.5 bg-[#1F3463] hover:bg-[#172a4d] text-white rounded-lg flex items-center gap-1 transition-colors text-xs touch-target"
                    >
                      <MdOutlineAssignmentTurnedIn className="w-3.5 h-3.5" />
                      <span>Assign</span>
                    </button>
                    <button
                      onClick={() => handleCheckDetails(inst)}
                      className="px-2 py-1 sm:px-2.5 sm:py-1.5 border border-green-600 text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg flex items-center gap-1 transition-colors text-xs font-medium shadow-sm touch-target"
                      title="Details"
                    >
                      <FaBookOpen className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination - Updated for better mobile responsiveness */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 py-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md border border-[#1F3463] text-[#1F3463] bg-white dark:bg-gray-900 hover:bg-[#1F3463] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed touch-target`}
                aria-label="Previous page"
              >
                <FaChevronLeft className="w-3 h-3" />
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md font-semibold border border-[#1F3463] text-xs touch-target ${
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
                className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md border border-[#1F3463] text-[#1F3463] bg-white dark:bg-gray-900 hover:bg-[#1F3463] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed touch-target`}
                aria-label="Next page"
              >
                <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </>
      )}

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
        loading={loading && confirmModalOpen}
      />
      
      <AssignProgramModal 
        isOpen={assignModalOpen} 
        onClose={() => setAssignModalOpen(false)} 
        instructor={selectedInstructor} 
        onSave={fetchInstructors} 
      />
      
      {/* Assigned Programs Modal */}
      {assignedProgramsModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
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
                className="text-gray-600 text-3xl hover:text-gray-800 dark:text-gray-200 dark:hover:text-white transition-colors p-2 rounded-md"
                aria-label="Close modal"
              >
                &times;
              </button>

            </div>

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
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Active
                          </span>
                          <button
                            onClick={() => handleRemoveProgram(assignedProgramsInstructor.id, prog.id, prog.year_level)}
                            disabled={removingProgramId === `${prog.id}-${prog.year_level}`}
                            className="px-2.5 py-1.5 bg-[#1F3463] hover:bg-[#172a4d] text-white rounded-lg flex items-center gap-1.5 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove Program"
                          >
                            {removingProgramId === `${prog.id}-${prog.year_level}` ? (
                              <>
                                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Removing...</span>
                              </>
                            ) : (
                              <>
                                <FaTrash className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </>
                            )}
                          </button>
                        </div>
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
          </div>
        </div>
      )}

      {/* Add custom styles for better mobile support */}
      <style jsx>{`
        .touch-target {
          min-height: 28px;
          min-width: 28px;
        }
        @media (max-width: 450px) {
          .xs\\:flex-row {
            flex-direction: row;
          }
          .xs\\:inline {
            display: inline;
          }
          .xs\\:items-center {
            align-items: center;
          }
          .xs\\:gap-2 {
            gap: 0.5rem;
          }
          .touch-target {
            min-height: 24px;
            min-width: 24px;
          }
        }
      `}</style>
    </main>
  );
}

export default Instructors;