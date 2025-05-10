import React, { useState, useEffect } from "react";
import QuestionModal from "../../contents/Admin/Modals/QuestionModal";
import ConfirmModal from "../../components/ConfirmModal";
import { 
  FaPlus, FaEdit, FaTrash, FaRegClone, FaSort, 
  FaQuestionCircle, FaToggleOn, FaToggleOff 
} from "react-icons/fa";
import { fetchQuestions, saveQuestions, updateQuestion, deleteQuestion } from "../../services/QuestionService";
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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const { loading, setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    fetchQuestions()
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
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [questions, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
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

  const handleDuplicate = async (question) => {
    setLoading(true);
    try {
      const duplicatedQuestion = { ...question, id: null };
      const savedQuestion = await saveQuestions(duplicatedQuestion);
      setQuestions([...questions, savedQuestion]);
      toast.success("Question duplicated successfully!");
    } catch (error) {
      console.error("Error duplicating question:", error);
      toast.error("Failed to duplicate question.");
    }
    setLoading(false);
  };

  const toggleEnable = () => {
    setIsEnabled(!isEnabled);
    toast.success(`Questions ${isEnabled ? "disabled" : "enabled"}`);
  };

  const confirmDelete = (id) => {
    setDeleteQuestionId(id);
    setConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteQuestion(deleteQuestionId);
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
        await updateQuestion(questionToEdit.id, newQuestion);
        setQuestions(questions.map((q) => (q.id === questionToEdit.id ? { ...q, ...newQuestion } : q)));
        toast.success("Question updated successfully!");
      } else {
        const savedQuestion = await saveQuestions(newQuestion);
        setQuestions([...questions, savedQuestion]);
        toast.success(questions.length === 0 
          ? "First question created successfully!" 
          : "Question added successfully!");
      }
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question.");
    }
    setShowModal(false);
    setLoading(false);
  };

  return (
    <main className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {loading && <FullScreenLoader />}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Evaluation Questions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and organize evaluation criteria</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleEnable}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEnabled 
                ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800/30 dark:text-red-400'
            }`}
          >
            {isEnabled ? 'Active' : 'Inactive'}
            {isEnabled ? <FaToggleOn className="w-5 h-5" /> : <FaToggleOff className="w-5 h-5" />}
          </button>
          <button
            onClick={handleAddClick}
            className="bg-[#1F3463] hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            New Question
          </button>
        </div>
      </div>

      {/* Questions Table */}
      {sortedQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <FaQuestionCircle className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No questions found</p>
          <button
            onClick={handleAddClick}
            className="bg-[#1F3463] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Create First Question
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['Category', 'Type', 'Question'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => requestSort(header.toLowerCase())}
                    >
                      <div className="flex items-center gap-2">
                        {header}
                        <FaSort className="w-3 h-3 opacity-50" />
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-600/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-800/30 dark:text-indigo-400 text-sm">
                        {q.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {q.type}
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200 max-w-[500px] break-words">
                      {q.question}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEditClick(q)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(q)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                          title="Duplicate"
                        >
                          <FaRegClone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(q.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="w-4 h-4" />
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

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this question?"
      />

      {/* <button
        onClick={handleAddClick}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105"
        title="Add Question"
      >
        <FaPlus className="w-5 h-5" />
      </button> */}
    </main>
  );
}

export default Questionnaires;