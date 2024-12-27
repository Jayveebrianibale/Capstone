import React, { useState } from 'react';
import { FaSort, FaSearch, FaEye } from 'react-icons/fa';
import Pagination from '../components/Pagination';

function CHistory() {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedColumn, setSortedColumn] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const instructors = [
    { name: 'John Doe', email: 'john@example.com', subject: 'CRM', course: 'BSIS4', status: 'completed' },
    { name: 'Jane Doe', email: 'jane@example.com', subject: 'ETHICS', course: 'BSIS4', status: 'pending' },
    { name: 'Gary Barlow', email: 'gary@example.com', subject: 'Entrepreneurial Mind', course: 'BSIS4', status: 'incomplete' },
    { name: 'Gary Barlow', email: 'gary@example.com', subject: 'Math Logic', course: 'BSIS4', status: 'completed' },
    { name: 'Gary Barlow', email: 'gary@example.com', subject: 'Capstone 1', course: 'BSIS4', status: 'pending' },
    { name: 'Gary Barlow', email: 'gary@example.com', subject: 'Capstone 2', course: 'BSIS4', status: 'incomplete' },
    { name: 'Gary Barlow', email: 'gary@example.com', subject: 'Web Development', course: 'BSIS4', status: 'completed' },
    { name: 'John Doe', email: 'john@example.com', subject: 'CRM', course: 'BSIS4', status: 'pending' },
    { name: 'Jane Doe', email: 'jane@example.com', subject: 'ETHICS', course: 'BSIS4', status: 'completed' },
    { name: 'Gary Barlow', email: 'gary@example.com', subject: 'Entrepreneurial Mind', course: 'BSIS4', status: 'incomplete' },
    { name: 'Gary Barlow', email: 'gary@example.com', subject: 'Math Logic', course: 'BSIS4', status: 'pending' },
    { name: 'Gary Barlow', email: 'gary@example.com', subject: 'Capstone 1', course: 'BSIS4', status: 'completed' },
    { name: 'Gary Barlow', email: 'gary@example.com', subject: 'Capstone 2', course: 'BSIS4', status: 'pending' },
    { name: 'Gary Barlow', email: 'gary@example.com', subject: 'Web Development', course: 'BSIS4', status: 'completed' }
  ];

  const handleSort = (column) => {
    const order = sortedColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    setSortedColumn(column);
  };

  const sortedInstructors = [...instructors].sort((a, b) => {
    if (sortedColumn === 'name') {
      return sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortedColumn === 'email') {
      return sortOrder === 'asc'
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    }
    if (sortedColumn === 'subject') {
      return sortOrder === 'asc'
        ? a.subject.localeCompare(b.subject)
        : b.subject.localeCompare(a.subject);
    }
    if (sortedColumn === 'course') {
      return sortOrder === 'asc'
        ? a.course.localeCompare(b.course)
        : b.course.localeCompare(a.course);
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
    <div>
      <div className="flex justify-between items-center mb-4 flex-col lg:flex-row">
        <h1 className="text-xl font-medium dark:text-white mb-2 lg:mb-0">Evaluation History</h1>

        <div className="relative w-full lg:w-auto">
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history"
            className="pl-8 pr-4 py-2 w-full lg:w-auto border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div className="h-auto lg:col-span-2">
          <div className="overflow-x-auto p-4">
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
                    onClick={() => handleSort('email')}
                  >
                    Email
                    <FaSort className={`inline ml-1 ${sortedColumn === 'email' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  </th>
                  <th
                    className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white cursor-pointer"
                    onClick={() => handleSort('subject')}
                  >
                    Subject
                    <FaSort className={`inline ml-1 ${sortedColumn === 'subject' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                    View
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentInstructors.map((instructor, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">{instructor.name}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{instructor.email}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{instructor.subject}</td>
                 
                    <td className="whitespace-nowrap px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        {instructor.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                            Completed
                          </span>
                        )}
                        {instructor.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-600 px-3 py-1 text-xs font-semibold text-white">
                            Pending
                          </span>
                        )}
                        {instructor.status === 'incomplete' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                            Incomplete
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <button
                        onClick={() => alert('View Course for ' + instructor.name)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        <FaEye />
                      </button>
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
    </div>
  );
}

export default CHistory
