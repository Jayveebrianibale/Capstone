import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaRegFolderOpen, FaSearch } from "react-icons/fa";
import { FiUpload } from 'react-icons/fi';
import ProgramService from "../../services/ProgramService";
import GradeLevelService from "../../services/GradeLevelService";
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
  const [gradeLevels, setGradeLevels] = useState([]);
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
    fetchGradeLevels();
  }, []);

  const fetchGradeLevels = async () => {
    setLoading(true);
    try {
      const response = await GradeLevelService.getAll();
      console.log("Fetched grade levels:", response);
      setGradeLevels(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching grade levels:", error);
      toast.error("Failed to load grade levels.");
      setGradeLevels([]);
    } finally {
      setLoading(false);
    }
  };

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

  const getFilteredItems = () => {
    const category = activeTab.toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    // Map the tab name to the correct category codes
    const categoryMap = {
      "higher education": ["Higher Education"],
      "senior high": ["SHS", "Senior High"],
      "junior high": ["Junior High", "Jhs", "jhs"],
      "intermediate": ["Intermediate"]
    };

    // Filter programs based on category and search query
    return programs.filter(prog =>
      categoryMap[category].includes(prog.category) &&
      (prog.name.toLowerCase().includes(searchLower) ||
       (prog.code && prog.code.toLowerCase().includes(searchLower)))
    );
  };

  const openAddProgramModal = () => {
    setSelectedProgram(null);
    setActiveModal(activeTab);
  };

  const openEditProgramModal = (program) => {
    setSelectedProgram(program);
    setActiveModal(activeTab);
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const result = await ProgramService.bulkUpload(file);
      toast.success(result.message || "Programs uploaded successfully!");
      fetchPrograms(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed. Please check your CSV file.");
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = `name,code,category,yearLevel,section
      Bachelor of Science in Information Systems,BSIS,Higher Education,1st - 4th Year,
      Bachelor of Science in Accountancy,BSA,Higher Education,1st - 4th Year,
      Grade 4 - Section A,INT,Intermediate,Grade 4,Section A
      Grade 4 - Section B,INT,Intermediate,Grade 4,Section B
      Grade 7 - Section A,JHS,Junior High,Grade 7,Section A
      Grade 7 - Section B,JHS,Junior High,Grade 7,Section B
      Grade 11 - Section A,SHS,Senior High,Grade 11,Section A
      Grade 11 - Section B,SHS,Senior High,Grade 11,Section B`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "programs_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveProgram = async (programData, isEditing, programId) => {
    try {
      let programResponse;
      if (isEditing) {
        programResponse = await ProgramService.update(programId, programData);
        console.log("Updated program:", programResponse);
        toast.success("Program updated successfully!");
      } else {
        programResponse = await ProgramService.create(programData);
        console.log("Created program:", programResponse);
        toast.success("Program added successfully!");
      }

      // Close modal immediately after successful save
      setActiveModal(null);

      // Update programs state with the new/updated program
      if (programResponse.program) {
        setPrograms(prevPrograms => {
          if (isEditing) {
            return prevPrograms.map(p =>
              p.id === programId ? programResponse.program : p
            );
          } else {
            return [...prevPrograms, programResponse.program];
          }
        });
      }

      // Refresh data in the background
      Promise.all([
        fetchPrograms(),
        fetchGradeLevels()
      ]).catch(error => {
        console.error("Error updating data:", error);
        toast.error("Data updated but there was an error refreshing the list");
      });

    } catch (error) {
      console.error("Error in handleSaveProgram:", error);
      if (!error.response?.data?.message?.includes("already exists")) {
        setActiveModal(null);
      }
    }
  };

  const handleDeleteProgram = async () => {
    if (!deleteProgramId) return;

    try {
      if (activeTab === "Higher Education") {
        await ProgramService.delete(deleteProgramId);
      } else {
        let programIdToDelete = deleteProgramId;
        const gradeLevel = gradeLevels.find(gl => gl.id === deleteProgramId);
        if (gradeLevel && gradeLevel.program_id) {
          programIdToDelete = gradeLevel.program_id;
        } else if (!gradeLevel) {
          const match = programs.find(p =>
            p.id === deleteProgramId
          );
          if (match) programIdToDelete = match.id;
        }
        // Delete the program (always)
        await ProgramService.delete(programIdToDelete);
        // Optionally, also delete the grade level if it exists
        if (gradeLevel) {
          await GradeLevelService.delete(deleteProgramId);
        }
      }
      toast.success("Program deleted successfully!");
      await fetchPrograms();
      await fetchGradeLevels();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.");
    } finally {
      setIsConfirmModalOpen(false);
      setDeleteProgramId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-4 lg:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <FullScreenLoader />}

   {/* Header Section */}
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3463] dark:text-white mb-1">
            Academic Programs Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Manage all academic programs and grade levels
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
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 pr-4 bg-transparent outline-none text-sm"
              />
            </div>
          </div>
          <button
            onClick={openAddProgramModal}
            className="bg-[#1F3463] hover:bg-[#19294f] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <FaPlus className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {activeTab === "Higher Education" ? "Add Program" : "Add Section"}
            </span>
          </button>
        </div>
      </div>
      {/* Tabs Navigation - Horizontal Scroll for Mobile */}
      <div className="mb-4 sm:mb-6">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["Higher Education", "Senior High", "Junior High", "Intermediate"].map(
            (category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`flex-shrink-0 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${
                  activeTab === category
                    ? "bg-[#1F3463] text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="sm:hidden">
                  {category === "Higher Education" ? "Higher Ed" : 
                   category === "Senior High" ? "Senior" :
                   category === "Junior High" ? "Junior" : "Intermediate"}
                </span>
                <span className="hidden sm:inline">{category}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Content Section */}
      {getFilteredItems().length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white border dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#f0f4ff] dark:bg-[#1a2a4a] flex items-center justify-center shadow-sm border border-[#e0e7ff] dark:border-gray-600">
              <FaSearch className="w-6 h-6 sm:w-8 sm:h-8 text-[#1F3463] dark:text-[#5d7cbf]" />
            </div>
          </div>

          {/* Text Content */}
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
            {searchQuery ? "No matching programs found" : "No Programs Found"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-center text-sm sm:text-base max-w-md px-2">
            {searchQuery ? (
              "Try adjusting your search query or browse all programs"
            ) : (
              `Start by adding new programs to ${activeTab} or upload a CSV file.`
            )}
          </p>

          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[#1F3463] dark:text-[#5d7cbf] font-medium hover:text-[#17284e] focus:outline-none underline"
            >
              Clear search
            </button>
          ) : (
            <>
              {/* Action Buttons */}
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

              {/* CSV Helper Text */}
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
            </>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden lg:block">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Program Code
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
                {getFilteredItems().map((item) => {
                  const isProgram = activeTab === "Higher Education";
                  const program = isProgram ? item : programs.find(p => p.id === item.program_id);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-600/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-10 bg-[#1F3463] rounded-full"></div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 dark:text-gray-200 truncate">
                              {item.name.split(' - ')[0]}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                        {item.code || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        <div className="flex flex-col gap-1">
                          {isProgram ? (
                            <span className="inline-block px-2 py-1 dark:bg-gray-700 rounded text-sm">
                               {item.yearLevel || "N/A"}
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 dark:bg-gray-700 rounded text-sm">
                              {item.name.includes(' - ') ? item.name.split(' - ')[1] : "N/A"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <button
                            onClick={() => openEditProgramModal(item)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteProgramId(item.id);
                              setIsConfirmModalOpen(true);
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Fully Responsive */}
          <div className="lg:hidden">
            <div className="grid gap-3 sm:gap-4 p-3 sm:p-4 grid-cols-1">
              {getFilteredItems().map((item) => {
                const isProgram = activeTab === "Higher Education";
                const program = isProgram ? item : programs.find(p => p.id === item.program_id);

                return (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-900 min-w-0"
                  >
                    {/* Program Name - Responsive Typography */}
                    <h3 className="font-bold text-base sm:text-lg text-[#1F3463] dark:text-white mb-2 break-words leading-tight">
                      {item.name.split(' - ')[0]}
                    </h3>

                    {/* Program Details - Responsive Layout */}
                    <div className="space-y-2 text-sm">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">
                          Code:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 break-all min-w-0">
                          {item.code || "N/A"}
                        </span>
                      </div>

                      <div className="flex flex-col xs:flex-row xs:items-start gap-1 xs:gap-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">
                          Details:
                        </span>
                        <div className="min-w-0 flex-1">
                          {isProgram ? (
                            <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs sm:text-sm break-words">
                               {item.yearLevel || "N/A"}
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs sm:text-sm break-words">
                              {item.name.includes(' - ') ? item.name.split(' - ')[1] : "N/A"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Mobile Optimized */}
                    <div className="flex justify-end items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => openEditProgramModal(item)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors touch-target"
                        title="Edit Program"
                      >
                        <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteProgramId(item.id);
                          setIsConfirmModalOpen(true);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors touch-target"
                        title="Delete Program"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .touch-target {
          min-height: 44px;
          min-width: 44px;
        }
        @media (max-width: 390px) {
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
        }
      `}</style>
    </main>
  );
}

export default Programs;