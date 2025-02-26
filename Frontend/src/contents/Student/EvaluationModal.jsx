import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EvaluationFormModal = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitNotice, setShowSubmitNotice] = useState(false);
  const [answers, setAnswers] = useState(Array(7).fill(null));
  const [comments, setComments] = useState({});

  const questions = [
    { 
      title: "Teaching Effectiveness", 
      description: <>How effective was the teacher in delivering lessons and engaging students in the learning process? <em>*Gaano kaepektibo ang guro sa paghahatid ng mga aralin at paghikayat sa mga mag-aaral sa proseso ng pagkatuto?*</em></> 
    },
    { 
      title: "Communication Skills", 
      description: <>How well did the teacher communicate concepts clearly and effectively? <em>*Gaano kahusay ang guro sa malinaw at epektibong pagpapaliwanag ng mga konsepto?*</em></> 
    },
    { 
      title: "Classroom Management", 
      description: <>How well did the teacher maintain discipline and keep the class engaged? <em>*Gaano kahusay ang guro sa pagpapanatili ng disiplina at pagpapanatiling aktibo ng klase?*</em></> 
    },
    { 
      title: "Knowledge of Subject Matter", 
      description: <>How knowledgeable was the teacher about the subject matter? <em>*Gaano kalawak ang kaalaman ng guro sa itinuturong paksa?*</em></> 
    },
    { 
      title: "Fairness in Grading", 
      description: <>How fair was the teacher in grading and providing feedback? <em>*Gaano katarungan ang guro sa pagbibigay ng grado at feedback?*</em></> 
    },
    { 
      title: "Provide any specific suggestions for how the teacher could improve their teaching methods or the course.", 
      description: <textarea className="w-full mt-2 p-2 border rounded-lg" value={comments.suggestions || ''} onChange={(e) => setComments({...comments, suggestions: e.target.value})} placeholder="Optional"></textarea>
    },
    { 
      title: "Share any additional comments or thoughts about your experience with the teacher.", 
      description: <textarea className="w-full mt-2 p-2 border rounded-lg" value={comments.additional || ''} onChange={(e) => setComments({...comments, additional: e.target.value})} placeholder="Optional"></textarea>
    },
  ];

  const options = [
    "😍 Exceedingly well", 
    "😊 Very well", 
    "😐 Moderately", 
    "🙁 Slightly", 
    "😡 Not at all"
  ];

  const handleNext = () => {
    if ((answers[currentQuestion] !== null || currentQuestion >= 5) && currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnswerSelection = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = index;
    setAnswers(updatedAnswers);
  
    // Automatically move to the next question if it's not the last one
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 200);
    }
  };

  const handleSubmit = () => {
    if (answers.slice(0, 5).every(answer => answer !== null)) {
      setIsSubmitting(true);
      setTimeout(() => {
        setShowSubmitNotice(true);
      }, 500);
    }
  };

  const handleClose = () => {
    navigate("/CEvaluations");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        {showSubmitNotice ? (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 mt-3">Submission Successful!</h2>
            <p className="text-gray-500 text-sm mt-2">
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
            <div className="text-center mb-4 text-gray-600 text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </div>

            <p className="font-bold text-lg text-gray-700 text-center max-w-lg mx-auto">
              {questions[currentQuestion].title}
            </p>
            <p className="text-gray-600 text-sm text-justify max-w-lg mx-auto">
              {questions[currentQuestion].description}
            </p>

            {currentQuestion < 5 && (
              <div className="flex flex-col gap-3 mt-6">
                <div className="grid grid-cols-2 gap-3">
                  {options.slice(0, 4).map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelection(index)}
                      className={`w-full px-4 py-2 border rounded-lg flex items-center justify-center gap-2 transition-all ${
                        answers[currentQuestion] === index ? "bg-yellow-400 text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-lg">{option.split(" ")[0]}</span>
                      <span className="text-sm">{option.split(" ").slice(1).join(" ")}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleAnswerSelection(4)}
                  className={`w-full px-4 py-2 border rounded-lg flex items-center justify-center gap-2 transition-all ${
                    answers[currentQuestion] === 4 ? "bg-yellow-400 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-lg">😡</span>
                  <span className="text-sm">Not at all</span>
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-6">
              {currentQuestion === 0 ? (
                <button onClick={handleClose} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                  Close
                </button>
              ) : (
                <button onClick={handleBack} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all">
                  Back
                </button>
              )}
              {currentQuestion < questions.length - 1 ? (
                <button
                onClick={handleNext}
                disabled={currentQuestion < 5 && answers[currentQuestion] === null}
                className={`px-6 py-2 rounded-lg transition-all ${
                  currentQuestion < 5 && answers[currentQuestion] === null
                    ? "bg-gray-500 text-white-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
              ) : (
                <button onClick={handleSubmit} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                  Submit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EvaluationFormModal;
