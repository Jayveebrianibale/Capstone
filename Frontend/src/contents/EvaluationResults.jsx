import React from "react";

const dummyData = [
  { title: "Teaching Effectiveness", question: "How effective was the teacher in delivering lessons and engaging students in the learning process? <em>*Gaano kaepektibo ang guro sa paghahatid ng mga aralin at paghikayat sa mga mag-aaral sa proseso ng pagkatuto?*</em>", rating: "😊 Very well" },
  { title: "Communication Skills", question: "How well did the teacher communicate concepts clearly and effectively? <em>*Gaano kahusay ang guro sa malinaw at epektibong pagpapaliwanag ng mga konsepto?*</em>", rating: "😍 Exceedingly well"},
  { title: "Classroom Management", question: "How well did the teacher maintain discipline and keep the class engaged? <em>*Gaano kahusay ang guro sa pagpapanatili ng disiplina at pagpapanatiling aktibo ng klase?*</em>", rating: "😐 Moderately"},
  { title: "Knowledge of Subject Matter", question: "How knowledgeable was the teacher about the subject matter? <em>*Gaano kalawak ang kaalaman ng guro sa itinuturong paksa?*</em>", rating: "😊 Very well"},
  { title: "Fairness in Grading", question: "How fair was the teacher in grading and providing feedback? <em>*Gaano katarungan ang guro sa pagbibigay ng grado at feedback?*</em>", rating: "🙁 Slightly" },
  { title: "Provide any specific suggestions for how the teacher could improve their teaching methods or the course.", comments: "Provide more real-world examples to enhance understanding." },
  { title: "Share any additional comments or thoughts about your experience with the teacher.", comments: "Overall, a good learning experience, but some improvements needed in grading fairness." },
];

const EvaluationResultsModal = ({ isOpen, onClose }) => {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl shadow-2xl w-full sm:w-[80%] md:w-[700px] lg:w-[600px] max-h-[85vh] overflow-y-auto relative animate-fade-in border border-gray-200 dark:border-gray-600">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 text-2xl font-bold focus:outline-none"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-justify">Evaluation Results</h2>
        <div className="space-y-6">
          {dummyData.map((result, index) => (
            <div
              key={index}
              className="border p-6 rounded-xl shadow-md bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{result.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-md leading-relaxed">
                <span className="font-medium">Question:</span> {" "}
                <span dangerouslySetInnerHTML={{ __html: result.question }} />
              </p>
              {result.rating && (
                <p className="text-gray-700 dark:text-gray-300 text-md mt-3 font-medium">
                  <span className="font-semibold">Rating:</span> {result.rating}
                </p>
              )}
              {result.comments && (
                <p className="text-gray-600 dark:text-gray-400 text-md mt-4 italic border-l-4 border-blue-500 dark:border-blue-400 pl-3">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Comments:</span> {result.comments}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationResultsModal;
