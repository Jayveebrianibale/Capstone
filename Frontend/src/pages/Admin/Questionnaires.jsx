import React, { useState, useEffect } from "react";
import QuestionModal from "../../contents/Admin/Modals/QuestionModal";
import ConfirmModal from "../../components/ConfirmModal";
import QuestionsService from '../../services/QuestionService';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSort,
  FaQuestionCircle,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { FiUpload } from 'react-icons/fi';
import { toast, ToastContainer } from "react-toastify";
import { useLoading } from "../../components/LoadingContext";
import FullScreenLoader from "../../components/FullScreenLoader";
import "react-toastify/dist/ReactToastify.css";

function Questionnaires() {
  const [questions, setQuestions] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const { loading, setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    QuestionsService.getAll()
      .then((data) => setQuestions(data))
      .catch((err) => {
        console.error("Error fetching questions:", err);
        toast.error("Failed to load questions.");
      })
      .finally(() => setLoading(false));
  }, [setLoading]);

  const sortedQuestions = React.useMemo(() => {
    let sortableItems = [...questions];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [questions, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setQuestionToEdit(null);
    setShowModal(true);
  };

  const handleEditClick = (question) => {
    setIsEditing(true);
    setQuestionToEdit(question);
    setShowModal(true);
  };

  const toggleEnable = () => {
    setIsEnabled(!isEnabled);
    toast.success(`Questions ${isEnabled ? "disabled" : "enabled"}`);
  };

  const confirmDelete = (id) => {
    setDeleteQuestionId(id);
    setConfirmModalOpen(true);
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const result = await QuestionsService.bulkUpload(file);
      toast.success(result.message || "Questions uploaded successfully!");
      // If result.data or result.questions contains the new list, update state
      if (result && Array.isArray(result.data)) {
        setQuestions(result.data);
      } else if (result && Array.isArray(result.questions)) {
        setQuestions(result.questions);
      } else {
        // fallback: fetch latest
        const updatedQuestions = await QuestionsService.getAll();
        setQuestions(updatedQuestions);
      }
    } catch (error) {
      toast.error(error.message || "Upload failed. Please check your CSV file.");
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = `question,type,category\nThe teacher is organized.,Likert Scale,Classroom Management\nThe teacher is respectful.,Likert Scale,Professionalism\n`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "questions_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const handleDelete = async () => {
    setLoading(true);
    try {
      await QuestionsService.delete(deleteQuestionId);
      setQuestions(questions.filter((q) => q.id !== deleteQuestionId));
      toast.success("Question deleted successfully!");
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question.");
    }
    setConfirmModalOpen(false);
    setLoading(false);
  };

  const handleSave = async (newQuestion) => {
    setLoading(true);
    try {
      if (isEditing) {
        await QuestionsService.update(questionToEdit.id, newQuestion);
        setQuestions(
          questions.map((q) =>
            q.id === questionToEdit.id ? { ...q, ...newQuestion } : q
          )
        );
        toast.success("Question updated successfully!");
      } else {
        await QuestionsService.save(newQuestion);
        // Fetch the latest questions to ensure correct text/IDs
        const updatedQuestions = await QuestionsService.getAll();
        setQuestions(updatedQuestions);
        toast.success(
          questions.length === 0
            ? "First question created successfully!"
            : "Question added successfully!"
        );
      }
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question.");
    }
    setShowModal(false);
    setLoading(false);
  };

  return (
    <main className="p-4 sm:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <FullScreenLoader />}

      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3463] dark:text-white mb-1">
            Evaluation Questions  
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Manage evaluation criteria • {questions.length} questions
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-start md:justify-end">
          <button
            onClick={toggleEnable}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              isEnabled
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            <span className="text-sm font-semibold">
              {isEnabled ? "Active" : "Disabled"}
            </span>
            {isEnabled ? (
              <FaToggleOn className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <FaToggleOff className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </button>

          <button
            onClick={handleAddClick}
            className="bg-[#1F3463] hover:bg-[#19294f] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <FaPlus className="w-4 h-4" />
            <span className="text-sm font-semibold">New Question</span>
          </button>
        </div>
      </div>

      {/* Table or Empty State */}
      {sortedQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] bg-white border dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#f0f4ff] dark:bg-[#1a2a4a] flex items-center justify-center shadow-sm border border-[#e0e7ff] dark:border-gray-600">
              <FaQuestionCircle className="w-7 h-7 text-[#1F3463] dark:text-[#5d7cbf]" />
            </div>
          </div>
        
          {/* Text Content */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            No questions yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
            Get started by creating your first evaluation question or upload a CSV file.
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
        <div className="space-y-4">
          {/* Show as table for medium screens and up */}
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#1F3463]/10 dark:bg-[#1F3463]/20">
                <tr>
                  {["Category", "Type", "Question"].map((header, idx) => (
                    <th
                      key={header}
                      className={`px-6 py-4 text-left text-sm font-semibold text-[#1F3463] dark:text-white ${
                        idx === 0 ? "rounded-tl-2xl" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {header}
                        {header !== "Question" && (
                          <button
                            onClick={() => requestSort(header.toLowerCase())}
                            className="text-[#1F3463]/60 hover:text-[#1F3463]"
                          >
                            <FaSort className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="pr-14 py-4 text-right text-sm font-semibold text-[#1F3463] dark:text-white rounded-tr-2xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {sortedQuestions.map((q) => (
                  <tr
                    key={q.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="px-6 py-4 max-w-xs break-words">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F3463]/10 text-[#1F3463] dark:text-[#AECBFA] text-sm font-medium">
                        <div className="w-2 h-2 bg-[#1F3463] rounded-full" />
                        {q.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                      {q.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-100 max-w-2xl break-words">
                      {q.question}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        {/* Desktop buttons */}
                        <button
                          onClick={() => handleEditClick(q)}
                          className="hidden md:inline-flex items-center bg-[#1F3463] text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(q.id)}
                          className="hidden md:inline-flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>

                        {/* Mobile buttons */}
                        <button
                          onClick={() => handleEditClick(q)}
                          className="md:hidden text-[#1F3463] hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDelete(q.id)}
                          className="md:hidden text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Show as responsive grid cards on small screens */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 flex flex-col justify-between h-full"
              >
                <div className="space-y-3">
                  {/* Category */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#1F3463]/10 text-[#1F3463] dark:text-[#AECBFA] font-medium">
                      <div className="w-2 h-2 bg-[#1F3463] rounded-full" />
                      {q.category}
                    </span>
                  </div>

                  {/* Type */}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Type
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {q.type}
                    </p>
                  </div>

                  {/* Question */}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Question
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white break-words whitespace-pre-wrap">
                      {q.question}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                {/* Action buttons (mobile only) */}
                <div className="flex justify-end gap-4 pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => handleEditClick(q)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => confirmDelete(q.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <QuestionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          isEditing={isEditing}
          questionToEdit={questionToEdit}
        />
      )}

      {confirmModalOpen && (
        <ConfirmModal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this question?"
          loading={loading}
          
        />
      )}
    </main>
  );
}

export default Questionnaires;
