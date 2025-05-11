import React, { useState } from "react";
import ViewResultsModal from "./Modals/ViewResultsModal";

function InstructorTable({ instructors, questions }) {
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewAll = (instructor) => {
    setSelectedInstructor(instructor);
    setIsModalOpen(true);
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "No comments";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="bg-[#1F3463] text-white text-center p-4 font-bold rounded-t-lg dark:bg-[#1F3463]">
        Evaluation Results
      </div>
      <div className="hidden lg:block">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 font-semibold">Instructor Name</th>
              {[...Array(9)].map((_, i) => (
                <th key={i} className="px-6 py-3 font-semibold text-center">
                  #{i + 1}
                </th>
              ))}
              <th className="px-6 py-3 font-semibold w-1/4">Comments</th>
              <th className="px-6 py-3 font-semibold text-center">Percentage</th>
              <th className="px-6 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor, index) => {
              const ratings = instructor.ratings || {};
              const comments = instructor.comments || "No comments";
              const percentage = instructor.overallRating ?? 0;

              return (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "dark:bg-gray-800"
                  } hover:bg-gray-200 dark:hover:bg-gray-700 h-16`}
                >
                  <td className="px-6 py-3 font-medium">{instructor.name}</td>
                  {[...Array(9)].map((_, i) => (
                    <td key={i} className="px-6 py-3 text-center">
                      {ratings[`q${i + 1}`]?.toFixed(2) || "-"}
                    </td>
                  ))}
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400 w-1/4">
                    <div className="truncate max-w-xs" title={comments}>
                      {truncateText(comments)}
                    </div>
                  </td>
                  <td
                    className={`px-6 py-3 text-center font-bold ${
                      percentage >= 85
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {percentage.toFixed(2)}%
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleViewAll(instructor)}
                      className="bg-[#1F3463] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      View All
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 p-6 lg:hidden">
        {instructors.map((instructor, index) => {
          const ratings = instructor.ratings || {};
          const comments = instructor.comments || "No comments";
          const percentage = instructor.overallRating ?? 0;

          return (
            <div
              key={index}
              className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-900"
            >
              <h3 className="font-bold text-lg text-[#1F3463] dark:text-white">
                {instructor.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                {truncateText(comments, 100)}
              </p>
              <div className="grid grid-cols-3 gap-4 mt-3">
                {[...Array(9)].map((_, i) => (
                  <span key={i} className="text-gray-700 dark:text-gray-300">
                    Q{i + 1} : {ratings[`q${i + 1}`]?.toFixed(2) || "-"}
                  </span>
                ))}
              </div>
              <div
                className={`mt-3 font-bold text-center ${
                  percentage >= 85
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {percentage.toFixed(2)}%
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => handleViewAll(instructor)}
                  className="bg-[#1F3463] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
                >
                  View All
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <ViewResultsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        instructor={selectedInstructor}
        questions={questions}
      />
    </div>
  );
}

export default InstructorTable;
