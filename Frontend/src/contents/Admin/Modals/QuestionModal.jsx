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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6 transition-opacity duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col transition-all duration-300">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{isEditing ? "Edit Question" : "Create New Questions"}</h2>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors duration-300">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[65vh] pr-2">
          {questions.map((q, index) => (
            <div key={index} className="relative p-6 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
              {!isEditing && questions.length > 1 && (
                <button
                  onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors duration-300"
                  title="Remove this question"
                >
                  <X size={18} />
                </button>
              )}

              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Question {index + 1}</label>
              <textarea
                rows="3"
                placeholder="Enter your question..."
                value={q.question}
                onChange={(e) => handleChange(index, "question", e.target.value)}
                className="w-full border dark:border-gray-600 rounded-lg p-4 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition-all"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                  <select
                    value={q.type}
                    onChange={(e) => handleChange(index, "type", e.target.value)}
                    className="w-full border dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="Likert Scale">Likert Scale (1-5)</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Short Answer">Short Answer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    value={q.category}
                    onChange={(e) => handleChange(index, "category", e.target.value)}
                    className="w-full border dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="Learning Environment">Learning Environment</option>
                    <option value="Student Development">Student Development</option>
                    <option value="Content Knowledge">Content Knowledge</option>
                    <option value="Application of Content">Application of Content</option>
                    <option value="Planning for Instruction">Planning for Instruction</option>
                    <option value="Teaching Strategies">Teaching Strategies</option>
                    <option value="Ethical Practice">Ethical Practice</option>
                    <option value="Leadership and Collaboration">Leadership and Collaboration</option>
                    <option value="Overall Rating">Overall Rating</option>

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
              className="w-full bg-[#1F3463] hover:bg-indigo-800 text-white px-4 py-3 rounded-lg transition-colors duration-300"
            >
              + Add More Questions
            </button>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-md text-sm transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#1F3463] hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm transition-colors duration-300"
          >
            {isEditing ? "Update" : questions.length > 1 ? "Save All" : "Save"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
