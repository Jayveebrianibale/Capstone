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
    {/* Header */}
    <div className="bg-[#1F3463] text-white text-center p-4 font-bold rounded-t-lg dark:bg-[#1F3463]">
      Evaluation Results
    </div>
  
    {/* Desktop Table View */}
    <div className="hidden lg:block">
      <table
        className="w-full text-sm text-left text-gray-700 dark:text-gray-300 min-w-[900px] table-auto"
        style={{ tableLayout: "auto" }} // let browser adjust columns flexibly
      >
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 font-semibold whitespace-nowrap max-w-[150px] uppercase tracking-wider">
              Name
            </th>
            {[...Array(9)].map((_, i) => (
              <th
                key={i}
                className="px-2 py-2 font-semibold text-center whitespace-nowrap"
              >
                Qn{i + 1}
              </th>
            ))}
            <th className="px-4 py-2 font-semibold max-w-xs truncate uppercase tracking-wider">
              Comments
            </th>
            <th className="px-4 py-2 font-semibold text-center whitespace-nowrap uppercase tracking-wider">
              Percentage
            </th>
            <th className="px-4 py-2 font-semibold text-center whitespace-nowrap uppercase tracking-wider">
              Actions
            </th>
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
                  index % 2 === 0 ? "bg-white dark:bg-gray-900" : "dark:bg-gray-800"
                } hover:bg-gray-200 dark:hover:bg-gray-700`}
                style={{ height: "4rem" }}
              >
                <td className="px-4 py-2 font-medium max-w-[150px] truncate">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#1F3463] flex items-center justify-center">
                      <span className="text-white font-medium">
                        {instructor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {instructor.name}
                      </div>
                    </div>
                  </div>
                </td>
                {[...Array(9)].map((_, i) => (
                  <td
                    key={i}
                    className="px-2 py-2 text-center whitespace-nowrap"
                    style={{ minWidth: "2.5rem" }}
                  >
                    {ratings[`q${i + 1}`]?.toFixed(2) || "-"}
                  </td>
                ))}
                <td
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 max-w-xs truncate"
                  title={comments}
                >
                  {comments}
                </td>
                <td
                  className="px-4 py-2 text-center font-bold whitespace-nowrap text-gray-900 dark:text-gray-100"
                >
                  {percentage.toFixed(2)}%
                </td>
                <td className="px-4 py-2 text-center whitespace-nowrap">
                  <button
                    onClick={() => handleViewAll(instructor)}
                    className="bg-[#1F3463] text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
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
  
    {/* Mobile Grid View */}
    <div className="grid gap-6 p-6 lg:hidden grid-cols-1 sm:grid-cols-2">
      {instructors.map((instructor, index) => {
        const ratings = instructor.ratings || {};
        const comments = instructor.comments || "No comments";
        const percentage = instructor.overallRating ?? 0;
  
        return (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-900 break-words"
          >
            <h3 className="font-bold text-lg text-[#1F3463] dark:text-white truncate">
              {instructor.name}
            </h3>
  
            <p className="text-gray-600 dark:text-gray-400 text-sm italic mt-2 break-words">
              {truncateText(comments, 100)}
            </p>
  
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between text-[#1F3463] dark:text-[#1F3463] text-sm whitespace-nowrap"
                >
                  <span>Q{i + 1}:</span>
                  <span>{ratings[`q${i + 1}`]?.toFixed(2) || "-"}</span>
                </div>
              ))}
            </div>
  
            <div
              className="mt-4 font-bold text-center text-gray-900 dark:text-gray-100 whitespace-nowrap"
            >
              {percentage.toFixed(2)}%
            </div>
  
            <div className="mt-4">
              <button
                onClick={() => handleViewAll(instructor)}
                className="w-full bg-[#1F3463] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
