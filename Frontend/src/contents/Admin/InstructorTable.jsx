import React from "react";

function InstructorTable({ instructors }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="bg-[#1F3463] text-white text-center p-4 font-bold rounded-t-lg dark:bg-[#1F3463]">
        Instructor Evaluation Results
      </div>
      <div className="hidden lg:block">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 font-semibold">Instructor Name</th>
              <th className="px-6 py-3 font-semibold text-center">Exceedingly Well (5)</th>
              <th className="px-6 py-3 font-semibold text-center">Very Well (4)</th>
              <th className="px-6 py-3 font-semibold text-center">Moderately (3)</th>
              <th className="px-6 py-3 font-semibold text-center">Slightly (2)</th>
              <th className="px-6 py-3 font-semibold text-center">Not at All (1)</th>
              <th className="px-6 py-3 font-semibold w-1/4">Comments</th>
              <th className="px-6 py-3 font-semibold text-center">Percentage</th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {instructors.map((instructor, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white dark:bg-gray-900" : "dark:bg-gray-800"
                } hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                <td className="px-6 py-3 font-medium">{instructor.name}</td>
                <td className="px-6 py-3 text-center">{instructor.ratings.five}</td>
                <td className="px-6 py-3 text-center">{instructor.ratings.four}</td>
                <td className="px-6 py-3 text-center">{instructor.ratings.three}</td>
                <td className="px-6 py-3 text-center">{instructor.ratings.two}</td>
                <td className="px-6 py-3 text-center">{instructor.ratings.one}</td>
                <td className="px-6 py-3 italic text-gray-600 dark:text-gray-400 w-1/4 max-w-xs whitespace-normal break-words">
                  {instructor.comments}
                </td>
                <td
                  className={`px-6 py-3 text-center font-bold ${
                    instructor.overallRating >= 85
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {instructor.overallRating}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-6 p-6 lg:hidden">
        {instructors.map((instructor, index) => (
          <div
            key={index}
            className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-900"
          >
            <h3 className="font-bold text-lg text-[#1F3463] dark:text-white">
              {instructor.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm italic">
              {instructor.comments}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <span className="text-gray-700 dark:text-gray-300">Exceedingly Well (5): {instructor.ratings.five}</span>
              <span className="text-gray-700 dark:text-gray-300">Very Well (4): {instructor.ratings.four}</span>
              <span className="text-gray-700 dark:text-gray-300">Moderately (3): {instructor.ratings.three}</span>
              <span className="text-gray-700 dark:text-gray-300">Slightly (2): {instructor.ratings.two}</span>
              <span className="text-gray-700 dark:text-gray-300">Not at all (1): {instructor.ratings.one}</span>
            </div>
            <div
              className={`mt-3 font-bold text-center ${
                instructor.overallRating >= 85
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {instructor.overallRating}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructorTable;
