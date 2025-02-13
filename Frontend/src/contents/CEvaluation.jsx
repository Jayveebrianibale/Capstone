import React, { useState } from 'react';
import { FaSort, FaSearch, FaStar, FaEdit } from 'react-icons/fa';
import Pagination from '../components/Pagination';
import EvaluationFormModal from '../contents/EvaluationModal';


function CEvaluation() {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedColumn, setSortedColumn] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const itemsPerPage = 10;

  const instructors = [
    { name: 'John Doe', subject: 'CRM', status: 'COMPLETED' },
    { name: 'Jane Doe', subject: 'ETHICS', status: 'COMPLETED' },
    { name: 'Gary Barlow', subject: 'Entrepreneurial Mind', status: 'NOT COMPLETED' },
    { name: 'Gary Barlow', subject: 'Math Logic', status: 'COMPLETED' },
    { name: 'Gary Barlow', subject: 'Capstone 1', status: 'COMPLETED' },
    { name: 'Gary Barlow', subject: 'Capstone 2', status: 'NOT COMPLETED' },
    { name: 'Gary Barlow', subject: 'Web Development', status: 'COMPLETED' },
    { name: 'Gary Barlow', subject: 'Entrepreneurial Mind', status: 'NOT COMPLETED' },
    { name: 'Gary Barlow', subject: 'Math Logic', status: 'COMPLETED' },
    { name: 'Gary Barlow', subject: 'Capstone 1', status: 'COMPLETED' },
    { name: 'Gary Barlow', subject: 'Capstone 2', status: 'NOT COMPLETED' },
    { name: 'Gary Barlow', subject: 'Web Development', status: 'COMPLETED' }
  ];

  

  const handleSort = (column) => {
    const order = sortedColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    setSortedColumn(column);
  };


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const sortedInstructors = [...instructors].sort((a, b) => {
    if (sortedColumn === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortedColumn === 'subject') {
      return sortOrder === 'asc'
        ? a.subject.localeCompare(b.subject)
        : b.subject.localeCompare(a.subject);
    }
    if (sortedColumn === 'status') {
      return sortOrder === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  const filteredInstructors = sortedInstructors.filter((instructor) =>
    instructor.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const currentInstructors = filteredInstructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div >
      <div className="flex justify-between items-center mb-4 flex-col lg:flex-row">
        <h1 className="text-xl font-medium dark:text-white mb-2 lg:mb-0">Instructors</h1>
        {/* <h1 className="text-slate-500 font-normal text-sm text-center dark:text-slate-400 ">
        Evaluate your instructors with your honest and best ratings.
          </h1>  */}
        <div className="relative w-full lg:w-auto">
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search instructors"
            className="pl-8 pr-4 py-2 w-full lg:w-auto border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-9">
        <div className="h-auto lg:col-span-2">
          <div className="h-full min-h-[500px] overflow-x-auto p-4">
            <table className="min-w-full divide-y-2 text-center divide-gray-200 bg-white text-sm dark:bg-gray-900 dark:divide-gray-700">
              <thead className="ltr:text-left rtl:text-right">
                <tr>
                  <th
                    className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    <FaSort className={`inline ml-1 ${sortedColumn === 'name' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  </th>
                  <th
                    className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white cursor-pointer"
                    onClick={() => handleSort('subject')}
                  >
                    Subject
                    <FaSort className={`inline ml-1 ${sortedColumn === 'subject' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  </th>
                  <th
                    className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    <FaSort className={`inline ml-1 ${sortedColumn === 'status' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                    Evaluate
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentInstructors.map((instructor, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">{instructor.name}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{instructor.subject}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{instructor.status}</td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <button className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white" onClick={handleOpenModal}>
                          <FaStar />
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handleChangePage}
      />
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <EvaluationFormModal />
            <button onClick={handleCloseModal} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CEvaluation;