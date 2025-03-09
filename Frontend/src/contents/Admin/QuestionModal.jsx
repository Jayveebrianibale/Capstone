import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function QuestionModal({ isOpen, onClose, onSave, isEditing, questionToEdit }) {
  const [questions, setQuestions] = useState([
    { question: "", type: "Likert Scale", category: "Teaching Effectiveness" }
  ]);

  useEffect(() => {
    if (isEditing && questionToEdit) {
      setQuestions([{ ...questionToEdit }]);
    } else {
      setQuestions([{ question: "", type: "Likert Scale", category: "Teaching Effectiveness" }]);
    }
  }, [isEditing, questionToEdit]);

  const handleChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSave = () => {
    if (questions.every(q => q.question.trim() === "")) {
      alert("Please enter at least one valid question.");
      return;
    }

    onSave(isEditing ? questions[0] : questions);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit Question" : "Create New Questions"}
          </h2>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[65vh] pr-2">
          {questions.map((q, index) => (
            <div key={index} className="relative p-4 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {!isEditing && questions.length > 1 && (
                <button
                  onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-red-500"
                  title="Remove this question"
                >
                  ✖
                </button>
              )}

              <label className="block font-semibold text-gray-700 dark:text-gray-300">Question {index + 1}</label>
              <textarea
                rows="3"
                placeholder="Enter your question..."
                value={q.question}
                onChange={(e) => handleChange(index, "question", e.target.value)}
                className="w-full border dark:border-gray-600 rounded p-3 mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300">Type</label>
                  <select
                    value={q.type}
                    onChange={(e) => handleChange(index, "type", e.target.value)}
                    className="w-full border dark:border-gray-600 rounded p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="Likert Scale">Likert Scale (1-5)</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Short Answer">Short Answer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300">Category</label>
                  <select
                    value={q.category}
                    onChange={(e) => handleChange(index, "category", e.target.value)}
                    className="w-full border dark:border-gray-600 rounded p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="Teaching Effectiveness">Teaching Effectiveness</option>
                    <option value="Classroom Management">Classroom Management</option>
                    <option value="Student Engagement">Student Engagement</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!isEditing && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setQuestions([...questions, { question: "", type: "Likert Scale", category: "Teaching Effectiveness" }])}
              className="w-full bg-[#1F3463] hover:bg-indigo-800 text-white px-3 py-2 rounded-md text-sm"
            >
              + Add More Questions
            </button>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#1F3463] hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
          >
            {isEditing ? "Update" : questions.length > 1 ? "Save All" : "Save"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
