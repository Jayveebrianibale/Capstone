import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (e, page) => {
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <ol className="flex justify-center gap-1 text-xs font-medium">
      <li>
        <a
          href="#"
          onClick={handlePrevPage}
          className={`inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500' : 'dark:bg-gray-800 dark:text-white'}`}
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
        </a>
      </li>

      {[...Array(totalPages)].map((_, index) => (
        <li key={index}>
          <a
            href="#"
            onClick={(e) => handlePageClick(e, index + 1)} 
            className={`block size-8 rounded border text-center leading-8 ${currentPage === index + 1 
              ? 'bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white'
              : 'bg-white text-gray-900 hover:bg-indigo-100 hover:text-indigo-600 dark:bg-gray-800 dark:text-white dark:hover:bg-indigo-700 dark:hover:text-white'}`}
          >
            {index + 1}
          </a>
        </li>
      ))}

      <li>
        <a
          href="#"
          onClick={handleNextPage}
          className={`inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 dark:bg-gray-800 dark:text-white rtl:rotate-180 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        </a>
      </li>
    </ol>
  );
};

export default Pagination;
