import React, { useState } from 'react';
import Calendar from '../components/Calendar';

const data = [
  { name: 'John Doe', subject: 'Enterprise Architecture', dueDate: 'October 15, 2024' },
  { name: 'Jane Doe', subject: 'Ethics', dueDate: 'October 15, 2024' },
  { name: 'Gary Barlow', subject: 'CRM', dueDate: 'October 15, 2024' },
  { name: 'Peter Sthanlie Rayos', subject: 'Christian Teaching 7', dueDate: 'October 15, 2024' },
  { name: 'Rachelle Fualo', subject: 'Capstone 1', dueDate: 'October 15, 2024' },
  { name: 'Evelyn Pagente', subject: 'ISSMA', dueDate: 'October 15, 2024' },
  { name: 'Jireh Belen', subject: 'PM', dueDate: 'October 15, 2024' },
  { name: 'Raven Dela Rama', subject: 'Threads', dueDate: 'October 15, 2024' },
  { name: 'John Carlo Diga', subject: 'Capstone 2', dueDate: 'October 15, 2024' },
  { name: 'Jayvee Brian Ibale', subject: 'Computer Programming', dueDate: 'October 15, 2024' },
];

const ITEMS_PER_PAGE = 5;

function Upcoming() {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="pt-5">
      <h1 className="text-xl pb-5 ml-2 font-medium">Upcoming Evaluations</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7">
        <div className="h-auto rounded-xl border shadow-md lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Subjects</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Due Date</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Evaluate</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-center">
                {currentData.map((item, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{item.name}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{item.subject}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{item.dueDate}</td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <a
                        href="#"
                        className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center gap-1 text-xs font-medium mt-2 pb-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
              >
                <span className="sr-only">Prev Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`block size-8 rounded border ${currentPage === index + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-100 bg-white text-gray-900'}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center rounded border border-gray-100 bg-white text-gray-900"
              >
                <span className="sr-only">Next Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="h-auto rounded-xl border shadow-md">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default Upcoming;
