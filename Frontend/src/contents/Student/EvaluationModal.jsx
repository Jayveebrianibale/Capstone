import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EvaluationFormModal = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({ suggestions: "", additional: "" });
  const [showSubmitNotice, setShowSubmitNotice] = useState(false);

  const categories = [
    {
      category: "Teaching Effectiveness",
      questions: ["How effective is the teacher in delivering lessons?"],
    },
    {
      category: "Communication Skills",
      questions: ["How well does the teacher communicate ideas and concepts?"],
    },
    {
      category: "Classroom Management",
      questions: ["How well does the teacher manage the classroom?"],
    },
    {
      category: "Knowledge of Subject Matter",
      questions: ["How knowledgeable is the teacher in the subject matter?"],
    },
    {
      category: "Fairness in Grading",
      questions: ["How fair is the teacher in grading student work?"],
    },
  ];

  const options = [
    { value: "5", label: "5 - Exceedingly Well" },
    { value: "4", label: "4 - Very Well" },
    { value: "3", label: "3 - Moderately" },
    { value: "2", label: "2 - Slightly" },
    { value: "1", label: "1 - Not at All" },
  ];

  const handleAnswerChange = (category, question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [category]: { ...prev[category], [question]: value },
    }));
  };

  const isFormComplete = categories.every((cat) =>
    cat.questions.every((q) => answers[cat.category]?.[q])
  );

  const handleSubmit = () => {
    if (isFormComplete) {
      setShowSubmitNotice(true);
    }
  };

  const handleClose = () => {
    navigate("/CEvaluations");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 max-w-2xl w-full rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        {showSubmitNotice ? (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Submission Successful!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Thank you for your evaluation. Your response has been recorded.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
            >
              OK
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 text-center mb-4">
              Teacher Evaluation
            </h2>

            <div className="space-y-6">
              {categories.map((category, catIndex) => (
                <div
                  key={catIndex}
                  className="border rounded-lg p-4 shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                  <h3 className="font-bold text-gray-800 dark:text-gray-300 mb-2">{category.category}</h3>
                  {category.questions.map((question, qIndex) => (
                    <div key={qIndex} className="mb-3">
                      <p className="text-gray-700 dark:text-gray-300">{question}</p>
                      <select
                        className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200"
                        value={answers[category.category]?.[question] || ""}
                        onChange={(e) =>
                          handleAnswerChange(category.category, question, e.target.value)
                        }
                      >
                        <option value="" disabled>Select Rating</option>
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ))}

              {/* Comments Section */}
              <div className="border rounded-lg p-4 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  Suggestions for Improvement (Optional)
                </p>
                <textarea
                  className="mt-2 w-full p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200"
                  value={comments.suggestions}
                  onChange={(e) => setComments({ ...comments, suggestions: e.target.value })}
                  placeholder="Write your suggestions here..."
                />
              </div>

              <div className="border rounded-lg p-4 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  Additional Comments (Optional)
                </p>
                <textarea
                  className="mt-2 w-full p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200"
                  value={comments.additional}
                  onChange={(e) => setComments({ ...comments, additional: e.target.value })}
                  placeholder="Write any additional thoughts here..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormComplete}
                className={`px-6 py-2 rounded-lg transition-all ${
                  !isFormComplete
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EvaluationFormModal;
