import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export default function QuestionModal({ isOpen, onClose, onSave, isEditing, questionToEdit }) {
  const [formData, setFormData] = useState({
    question: "",
    type: "",
    category: ""
  });

  const [questions, setQuestions] = useState([{ question: "", type: "", category: "" }]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Learning Environment", "Student Development", "Content Knowledge",
    "Application of Content", "Planning for Instruction", "Teaching Strategies",
    "Ethical Practice", "Leadership and Collaboration", "Overall Rating",
  ];

  const questionTypes = [
    "Likert Scale", "Multiple Choice", "Short Answer", "Rating Scale", "Open Ended"
  ];

  useEffect(() => {
    if (isEditing && questionToEdit) {
      setFormData({
        question: questionToEdit.question || "",
        type: questionToEdit.type || "",
        category: questionToEdit.category || ""
      });
      setQuestions([{ ...questionToEdit }]);
    } else {
      setFormData({ question: "", type: "", category: "" });
      setQuestions([{ question: "", type: "", category: "" }]);
    }
  }, [isEditing, questionToEdit, isOpen]);

  // For single question (edit mode)
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setQuestions([{ ...formData, [field]: value }]);
  };

  // For multiple questions (add mode)
  const handleChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    if (isEditing) {
      return (
        formData.question.trim() !== "" &&
        formData.type.trim() !== "" &&
        formData.category.trim() !== ""
      );
    }
    return questions.every(
      (q) =>
        q.question.trim() !== "" &&
        q.type.trim() !== "" &&
        q.category.trim() !== ""
    );
  };

  const handleSave = async () => {
    if (loading) return;
    if (!validateQuestions()) {
      toast.error("Please fill in all question fields");
      return;
    }
    setLoading(true);
    try {
      await onSave(isEditing ? formData : questions);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit Question" : "New Evaluation Question"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-2 flex-1">
          {isEditing ? (
            <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              {/* Question Input */}
              <div className="space-y-2">
                <textarea
                  rows="3"
                  placeholder="Enter your question..."
                  value={formData.question}
                  onChange={(e) => handleFormChange("question", e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Question Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Response Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="" disabled>Select Type</option>
                    {questionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFormChange("category", e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            questions.map((q, index) => (
              <div key={index} className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                {/* Question Header */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Question {index + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {/* Question Input */}
                <div className="space-y-2">
                  <textarea
                    rows="3"
                    placeholder="Enter your question..."
                    value={q.question}
                    onChange={(e) => handleChange(index, "question", e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Question Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Response Type
                    </label>
                    <select
                      value={q.type}
                      onChange={(e) => handleChange(index, "type", e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="" disabled>Select Type</option>
                      {questionTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <select
                      value={q.category}
                      onChange={(e) => handleChange(index, "category", e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
          {!isEditing && (
            <button
              onClick={() =>
                setQuestions([
                  ...questions,
                  { question: "", type: "", category: "" }
                ])
              }
              className="px-4 py-2.5 border border-[#1F3463] text-[#1F3463] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
            >
              + Add Another Question
            </button>
          )}

          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2.5 bg-[#1F3463] hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isEditing ? "Save Changes" : "Save Questions"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}