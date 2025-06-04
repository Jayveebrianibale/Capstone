import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export default function QuestionModal({ isOpen, onClose, onSave, isEditing, questionToEdit }) {
  // Constants for limits
  const MAX_CHARACTERS = 250;
  const MAX_WORDS = 50;

  const [formData, setFormData] = useState({
    question: "",
    type: "Likert Scale", 
    category: ""
  });

  const [questions, setQuestions] = useState([{ question: "", type: "Likert Scale", category: "" }]);
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [limitExceeded, setLimitExceeded] = useState([]);
  const questionRefs = useRef([]);

  const categories = [
    "Learning Environments", "Student Development", "Content Knowledge",
    "Application of Content", "Planning for Instruction", "Teaching Strategies",
    "Ethical Practice", "Leadership and Collaboration", "Overall Rating",
  ];

  const questionTypes = ["Likert Scale"];

  // Helper function to count words
  const countWords = (str) => {
    return str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
  };

  // Validate input limits
  const validateLimits = (value, index = null) => {
    const charLimit = value.length > MAX_CHARACTERS;
    const wordLimit = countWords(value) > MAX_WORDS;
    
    if (index !== null) {
      // For multiple questions
      const newLimitExceeded = [...limitExceeded];
      if (charLimit || wordLimit) {
        newLimitExceeded[index] = { charLimit, wordLimit };
      } else {
        delete newLimitExceeded[index];
      }
      setLimitExceeded(newLimitExceeded);
    } else {
      // For single question (edit mode)
      if (charLimit || wordLimit) {
        setLimitExceeded([{ charLimit, wordLimit }]);
      } else {
        setLimitExceeded([]);
      }
    }
    
    return !charLimit && !wordLimit;
  };

  useEffect(() => {
    if (isEditing && questionToEdit) {
      setFormData({
        question: questionToEdit.question || "",
        type: questionToEdit.type || "Likert Scale", 
        category: questionToEdit.category || ""
      });
      setQuestions([{ ...questionToEdit, type: questionToEdit.type || "Likert Scale" }]);
      validateLimits(questionToEdit.question || "");
    } else {
      setFormData({ question: "", type: "Likert Scale", category: "" });
      setQuestions([{ question: "", type: "Likert Scale", category: "" }]);
      setLimitExceeded([]);
    }
    setMissingFields([]);
  }, [isEditing, questionToEdit, isOpen]);

  // For single question (edit mode)
  const handleFormChange = (field, value) => {
    if (field === "question") {
      validateLimits(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setQuestions([{ ...formData, [field]: value }]);
    
    if (value.trim() !== "") {
      setMissingFields(prev => prev.filter(f => f !== field));
    }
  };

  // For multiple questions (add mode)
  const handleChange = (index, field, value) => {
    if (field === "question") {
      validateLimits(value, index);
    }
    
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
    
    if (value.trim() !== "") {
      setMissingFields(prev => prev.filter(f => f !== `${index}-${field}`));
    }
  };

  const validateQuestions = () => {
    const newMissingFields = [];
    let limitsValid = true;
    
    if (isEditing) {
      if (formData.question.trim() === "") newMissingFields.push("question");
      if (formData.category.trim() === "") newMissingFields.push("category");
      limitsValid = validateLimits(formData.question);
    } else {
      questions.forEach((q, index) => {
        if (q.question.trim() === "") newMissingFields.push(`${index}-question`);
        if (q.category.trim() === "") newMissingFields.push(`${index}-category`);
        limitsValid = limitsValid && validateLimits(q.question, index);
      });
    }
    
    setMissingFields(newMissingFields);
    
    if (!limitsValid) {
      toast.error(`Question text exceeds limits (max ${MAX_CHARACTERS} characters or ${MAX_WORDS} words)`);
      return false;
    }
    
    return newMissingFields.length === 0;
  };

  const scrollToFirstMissingField = () => {
    if (missingFields.length === 0) return;
    
    // For edit mode
    if (isEditing) {
      const firstMissing = missingFields[0];
      const element = document.querySelector(`[data-field="${firstMissing}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    
    // For multiple questions mode
    const firstMissing = missingFields[0];
    const [index, field] = firstMissing.split('-');
    const questionElement = questionRefs.current[index];
    
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Focus the specific input field
      const inputElement = questionElement.querySelector(`[data-field="${firstMissing}"]`);
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  useEffect(() => {
    if (missingFields.length > 0) {
      scrollToFirstMissingField();
    }
  }, [missingFields]);

  const handleSave = async () => {
    if (loading) return;
    if (!validateQuestions()) {
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
                  data-field="question"
                  rows="3"
                  placeholder="Enter your question..."
                  value={formData.question}
                  onChange={(e) => handleFormChange("question", e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                    missingFields.includes("question") ? "border-red-500" : 
                    (limitExceeded[0]?.charLimit || limitExceeded[0]?.wordLimit) ? "border-yellow-500" : 
                    "border-gray-300 dark:border-gray-600"
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {limitExceeded[0]?.charLimit ? (
                      <span className="text-red-500">{formData.question.length}/{MAX_CHARACTERS} characters</span>
                    ) : (
                      <span>{formData.question.length}/{MAX_CHARACTERS} characters</span>
                    )}
                  </span>
                  <span>
                    {limitExceeded[0]?.wordLimit ? (
                      <span className="text-red-500">{countWords(formData.question)}/{MAX_WORDS} words</span>
                    ) : (
                      <span>{countWords(formData.question)}/{MAX_WORDS} words</span>
                    )}
                  </span>
                </div>
                {missingFields.includes("question") && (
                  <p className="text-red-500 text-sm">Question is required</p>
                )}
                {(limitExceeded[0]?.charLimit || limitExceeded[0]?.wordLimit) && (
                  <p className="text-yellow-600 text-sm">
                    {limitExceeded[0].charLimit && `Maximum ${MAX_CHARACTERS} characters exceeded. `}
                    {limitExceeded[0].wordLimit && `Maximum ${MAX_WORDS} words exceeded.`}
                  </p>
                )}
              </div>
              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Question Type - Now fixed to Likert Scale */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Response Type
                  </label>
                  <div className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                    Likert Scale
                  </div>
                  <input type="hidden" value="Likert Scale" />
                </div>
                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    data-field="category"
                    value={formData.category}
                    onChange={(e) => handleFormChange("category", e.target.value)}
                    className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${missingFields.includes("category") ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {missingFields.includes("category") && (
                    <p className="text-red-500 text-sm">Category is required</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            questions.map((q, index) => (
              <div 
                key={index} 
                ref={el => questionRefs.current[index] = el}
                className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
              >
                {/* Question Header */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Question {index + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {/* Question Input */}
                <div className="space-y-2">
                  <textarea
                    data-field={`${index}-question`}
                    rows="3"
                    placeholder="Enter your question..."
                    value={q.question}
                    onChange={(e) => handleChange(index, "question", e.target.value)}
                    className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                      missingFields.includes(`${index}-question`) ? "border-red-500" : 
                      (limitExceeded[index]?.charLimit || limitExceeded[index]?.wordLimit) ? "border-yellow-500" : 
                      "border-gray-300 dark:border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {limitExceeded[index]?.charLimit ? (
                        <span className="text-red-500">{q.question.length}/{MAX_CHARACTERS} characters</span>
                      ) : (
                        <span>{q.question.length}/{MAX_CHARACTERS} characters</span>
                      )}
                    </span>
                    <span>
                      {limitExceeded[index]?.wordLimit ? (
                        <span className="text-red-500">{countWords(q.question)}/{MAX_WORDS} words</span>
                      ) : (
                        <span>{countWords(q.question)}/{MAX_WORDS} words</span>
                      )}
                    </span>
                  </div>
                  {missingFields.includes(`${index}-question`) && (
                    <p className="text-red-500 text-sm">Question is required</p>
                  )}
                  {(limitExceeded[index]?.charLimit || limitExceeded[index]?.wordLimit) && (
                    <p className="text-yellow-600 text-sm">
                      {limitExceeded[index].charLimit && `Maximum ${MAX_CHARACTERS} characters exceeded. `}
                      {limitExceeded[index].wordLimit && `Maximum ${MAX_WORDS} words exceeded.`}
                    </p>
                  )}
                </div>
                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Question Type - Now fixed to Likert Scale */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Response Type
                    </label>
                    <div className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                      Likert Scale
                    </div>
                    <input type="hidden" value="Likert Scale" />
                  </div>
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <select
                      data-field={`${index}-category`}
                      value={q.category}
                      onChange={(e) => handleChange(index, "category", e.target.value)}
                      className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${missingFields.includes(`${index}-category`) ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {missingFields.includes(`${index}-category`) && (
                      <p className="text-red-500 text-sm">Category is required</p>
                    )}
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
                  { question: "", type: "Likert Scale", category: "" }
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