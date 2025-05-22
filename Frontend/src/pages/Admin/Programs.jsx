import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaRegFolderOpen } from "react-icons/fa";
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
    
    // Map the tab name to the correct category codes
    const categoryMap = {
      "higher education": ["Higher Education"],
      "senior high": ["SHS", "Senior High"],
      "junior high": ["Junior High", "Jhs", "jhs"],
      "intermediate": ["Intermediate"]
    };

    // Filter programs based on category
    return programs.filter(prog => 
      categoryMap[category].includes(prog.category) &&
      prog.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    const csvContent = `name,code,category,yearLevel
      Bachelor of Science in Information Systems,BSIS,Higher Education,1st - 4th Year
      Bachelor of Science in Accountancy,BSA,Higher Education,1st - 4th Year
      Bachelor of Science in Social Work,BSSW,Higher Education,1st - 4th Year
      Grade 7,JHS,Junior High,"Grade 7"
      Grade 10,JHS,Junior High,"Grade 10"`;
  
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
        
        <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="flex-1 flex items-center">
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#1F3463] focus:border-transparent transition-all text-base"
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
      {getFilteredItems().length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] bg-white border dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#f0f4ff] dark:bg-[#1a2a4a] flex items-center justify-center shadow-sm border border-[#e0e7ff] dark:border-gray-600">
              <FaRegFolderOpen className="w-8 h-8 text-[#1F3463] dark:text-[#5d7cbf]" />
            </div>
          </div>
        
          {/* Text Content */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            No Programs Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
            Start by adding new programs to {activeTab} or upload a CSV file.
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
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
                          <div className={`w-2 h-10 bg-[${primaryColor}] rounded-full`}></div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-200">
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
        </div>
      )}

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