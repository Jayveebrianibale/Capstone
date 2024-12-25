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
      <h1 className="text-xl text-gray-600 dark:text-gray-300 pb-5 ml-2 font-medium">Upcoming Evaluations</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7">
        <div className="flex flex-col h-auto rounded-xl shadow-md lg:col-span-2">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 flex-grow">
            <div className="overflow-x-auto rounded-t-lg">
              <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 text-sm text-center">
                <thead className="ltr:text-left rtl:text-right">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-gray-300">Name</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-gray-300">Subjects</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-gray-300">Due Date</th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-gray-300">Evaluate</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentData.map((item, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-400">{item.subject}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-400">{item.dueDate}</td>
                      <td className="whitespace-nowrap px-4 py-2">
                        <a
                          href="#"
                          className="inline-block rounded bg-blue-600 dark:bg-blue-500 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-b-lg border-t border-gray-200 dark:border-gray-700 px-4 py-2">
              <ol className="flex justify-end gap-1 text-xs font-medium">
                <li>
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="inline-flex size-8 items-center justify-center rounded border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rtl:rotate-180"
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
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      className={`block size-8 rounded border ${currentPage === index + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="inline-flex size-8 items-center justify-center rounded border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rtl:rotate-180"
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
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-auto rounded-xl shadow-md lg:col-span-1 flex-grow dark:bg-gray-800 dark:border-gray-700">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default Upcoming;
