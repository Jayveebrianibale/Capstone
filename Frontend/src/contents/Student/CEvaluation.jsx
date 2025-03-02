import React, { useState } from 'react';
import { FaSort, FaSearch, FaStar } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import EvaluationFormModal from '../Student/EvaluationModal';

function CEvaluation() {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedColumn, setSortedColumn] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const instructors = [
    { name: 'John Doe', status: 'Completed' },
    { name: 'Gary Barlow', status: 'Not Started' },
    { name: 'Jane Smith', status: 'Completed' },
    { name: 'Alice Johnson', status: 'Not Started' },
    { name: 'Bob Brown', status: 'Completed' },
    { name: 'Emily Davis', status: 'Completed' },
    { name: 'Michael Clark', status: 'Not Started' },
    { name: 'Olivia Martin', status: 'Completed' },
    { name: 'Sophia Lopez', status: 'Completed' },
    { name: 'Daniel Wilson', status: 'Not Started' },
    { name: 'Emma Taylor', status: 'Completed' }
  ];

  const handleSort = (column) => {
    const order = sortedColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    setSortedColumn(column);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const sortedInstructors = [...instructors].sort((a, b) => {
    if (sortedColumn === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    return 0;
  });

  const filteredInstructors = sortedInstructors.filter((instructor) =>
    instructor.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);
  const handleChangePage = (page) => setCurrentPage(page);

  const currentInstructors = filteredInstructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 flex-col sm:flex-row">
        <h1 className="text-2xl font-medium dark:text-white mb-2 sm:mb-0">Instructors</h1>
        <div className="relative w-full sm:w-auto">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search instructors"
            className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg shadow bg-white dark:bg-gray-900">
        <div className="hidden sm:grid grid-cols-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold text-center p-3">
          <div className="cursor-pointer" onClick={() => handleSort('name')}>
            Name <FaSort className="inline ml-1" />
          </div>
          <div>Status</div>
          <div>Evaluate</div>
        </div>

        
        {currentInstructors.map((instructor, index) => (
          <div key={index} className="grid grid-cols-3 p-2 items-center text-center border-b border-gray-300 dark:border-gray-700 text-sm md:text-base">
          <div className="truncate px-2">{instructor.name}</div>
          <div className={`font-medium px-2 ${instructor.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
            {instructor.status}
          </div>
          <div className="flex justify-center">
            <button 
              className="flex items-center gap-2 bg-indigo-500 text-white px-3 py-2 text-sm md:px-4 md:py-2 rounded-md font-medium shadow-md transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300"
              onClick={handleOpenModal}
            >
              <FaStar className="text-xs md:text-sm" />
              <span className="hidden md:inline">Evaluate</span>
            </button>
          </div>
        </div>
        
        ))}
      </div>

      
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handleChangePage} />
 
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
            <EvaluationFormModal />
            <button 
              onClick={handleCloseModal} 
              className="mt-4 w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-lg text-sm font-medium transition-all hover:bg-red-700 focus:ring-2 focus:ring-red-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CEvaluation;
