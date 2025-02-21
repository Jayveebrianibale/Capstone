import React, { useState } from "react";
import QuestionModal from "../../contents/Admin/QuestionModal";
import { FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";

function Questionnaires() {
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleEnable = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    alert(`Questionnaire is now ${newState ? "Enabled for Students" : "Disabled"}`);
  };

  return (
    <main className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
             <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
               Questionnaires
             </h1>
             <div className="flex items-center gap-4 mt-4 md:mt-0">
               <button
                 onClick={() => setShowModal(true)}
                 className="flex items-center gap-2 bg-[#1F3463] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                 title="Add Questions"
               >
                 <FaPlus />
               </button>

               <button
                 onClick={toggleEnable}
                 className="text-gray-700 dark:text-gray-200 hover:scale-110 transition"
               >
                 {isEnabled ? (
                   <FaToggleOn size={28} className="text-blue-500" />
                 ) : (
                   <FaToggleOff size={28} className="text-gray-400" />
                 )}
               </button>
             </div>
        </div>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No questions available</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-[#1F3463] text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Create Question
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
         
            <div className="hidden md:grid grid-cols-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 p-3 font-semibold">
              <div className="p-2">Category</div>
              <div className="p-2">Type</div>
              <div className="p-2">Question</div>
              <div className="p-2">Actions</div>
            </div>

            <div className="divide-y divide-gray-300 dark:divide-gray-600">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 p-3 items-start gap-2 md:gap-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                 
                  <div className="md:hidden font-semibold text-gray-600 dark:text-gray-400">Category:</div>
                  <div className="p-2">{q.category}</div>
            
                  <div className="md:hidden font-semibold text-gray-600 dark:text-gray-400">Type:</div>
                  <div className="p-2">{q.type}</div>
            
                  <div className="md:hidden font-semibold text-gray-600 dark:text-gray-400">Question:</div>
                  <div className="p-2 break-words">{q.question}</div>
            
                  <div className="md:hidden font-semibold text-gray-600 dark:text-gray-400">Actions:</div>
                  <div className="p-2 flex gap-4">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>

        </div>
      )}

      {showModal && (
        <QuestionModal
          onClose={() => setShowModal(false)}
          onSave={(newQuestions) => setQuestions([...questions, ...newQuestions])}
        />
      )}
    </main>
  );
}

export default Questionnaires;
