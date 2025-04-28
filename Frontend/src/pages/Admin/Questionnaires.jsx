import React, { useState, useEffect, useContext } from "react";
import QuestionModal from "../../contents/Admin/Modals/QuestionModal";
import ConfirmModal from "../../components/ConfirmModal";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { fetchQuestions, saveQuestions, updateQuestion, deleteQuestion } from "../../services/QuestionService";
import { toast, ToastContainer } from "react-toastify";
import { LoadingProvider, useLoading } from "../../components/LoadingContext";
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
    toast.success(`Questions is now ${isEnabled ? "Disabled" : "Enabled"}`);
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
        const isFirstQuestion = questions.length === 0;

        setQuestions([...questions, savedQuestion]);

        if (isFirstQuestion) {
          toast.success("Questions Created Successfully!");
        } else {
          toast.success("Questions Added Successfully!");
        }
      }
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question.");
    }
    setShowModal(false);
    setLoading(false);
  };

  return (
    <main className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {loading && <FullScreenLoader />}

      <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Evaluation Questions</h1>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button
            onClick={toggleEnable}
            className="text-gray-700 dark:text-gray-200 hover:scale-110 transition"
          >
            {isEnabled ? (
              <FaToggleOn size={26} className="text-[#1F3463] dark:text-indigo-600" />
            ) : (
              <FaToggleOff size={26} />
            )}
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No questions available</p>
          <button
            onClick={handleAddClick}
            className="mt-4 bg-[#1F3463] text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Create Question
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="hidden md:grid grid-cols-[1fr_1fr_3fr_auto] gap-4 border-b bg-gray-100 dark:bg-gray-700 p-4 font-semibold text-sm text-gray-700 dark:text-gray-300 rounded-t-lg">
            <div className="px-4 py-3">Category</div>
            <div className="px-4 py-3">Type</div>
            <div className="px-4 py-3">Question</div>
            <div className="px-4 py-3 text-center">Actions</div>
          </div>

        {questions.map((q, index) => (
          <div
            key={`${q.id}-${index}`}
            className="grid grid-cols-[1fr_1fr_3fr_auto] gap-4 p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <div className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
              {q.category}
            </div>
            <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
              {q.type}
            </div>
            <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 break-words">
              {q.question}
            </div>
            <div className="px-4 py-3 text-center flex justify-center gap-3">
              <button
                onClick={() => handleEditClick(q)}
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => confirmDelete(q.id)}
                className="text-red-600 hover:text-red-700 transition-colors duration-200"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      )}

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

      <button
        onClick={handleAddClick}
        className="fixed bottom-4 right-4 bg-[#1F3463] text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
        title="Add Question"
      >
        <FaPlus size={12} />
      </button>
    </main>
  );
}

export default Questionnaires;
