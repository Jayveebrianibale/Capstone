import { useState } from "react";
import { X } from "lucide-react"; 

export default function QuestionModal({ onClose, onSave }) {
  const [questions, setQuestions] = useState([
    { question: "", type: "Likert Scale", category: "Teaching Effectiveness" }
  ]);

 
  const addQuestion = () => {
    setQuestions([...questions, { question: "", type: "Likert Scale", category: "Teaching Effectiveness" }]);
  };

  
  const handleChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };


  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };


  const handleSave = () => {
    if (questions.length === 1) {
      onSave(questions);
      onClose();
      return;
    }

    const validQuestions = questions.filter(q => q.question.trim() !== "");
    if (validQuestions.length < questions.length) {
      alert("Please complete all questions before saving.");
      return;
    }

    onSave(validQuestions);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Create New Questions</h2>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-red-500">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[50vh] pr-2 rounded">
          {questions.map((q, index) => (
            <div key={index} className="relative p-3 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button 
                onClick={() => removeQuestion(index)} 
                className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-red-500"
                title="Remove this question"
              >
                ✖
              </button>

              <label className="block font-semibold text-gray-700 dark:text-gray-300">Question {index + 1}</label>
              <textarea
                rows="2"
                placeholder="Enter your question..."
                value={q.question}
                onChange={(e) => handleChange(index, "question", e.target.value)}
                className="w-full border dark:border-gray-600 rounded p-2 mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300">Type</label>
                  <select
                    value={q.type}
                    onChange={(e) => handleChange(index, "type", e.target.value)}
                    className="w-full border dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                    className="w-full border dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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

        
        <div className="mt-4">
          <button onClick={addQuestion} className="w-full bg-[#1F3463] hover:bg-indigo-800 text-white px-4 py-2 rounded">
            + Add More Questions
          </button>
        </div>

       
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSave} className="bg-[#1F3463] hover:bg-indigo-700 text-white px-4 py-2 rounded">
            {questions.length === 1 ? "Save" : "Save All"}
          </button>
        </div>
      </div>
    </div>
  );
}
