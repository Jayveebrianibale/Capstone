import React, { useState } from 'react';
import { FaSort, FaSearch, FaStar, FaEye } from 'react-icons/fa';
import Pagination from '../components/Pagination';
import EvaluationFormModal from '../contents/EvaluationModal';
import EvaluationResultsModal from '../contents/EvaluationResults'; // ✅ Fixed import

function CEvaluation() {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedColumn, setSortedColumn] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false); // ✅ State for results modal
  const [selectedEvaluation, setSelectedEvaluation] = useState(null); // ✅ Store selected evaluation data
  const itemsPerPage = 10;

  const instructors = [
    { name: 'John Doe', subject: 'CRM', status: 'COMPLETED' },
    { name: 'Jane Doe', subject: 'ETHICS', status: 'COMPLETED' },
    { name: 'Gary Barlow', subject: 'Entrepreneurial Mind', status: 'NOT COMPLETED' },
    { name: 'Gary Barlow', subject: 'Math Logic', status: 'COMPLETED' },
    { name: 'Gary Barlow', subject: 'Capstone 1', status: 'COMPLETED' },
    { name: 'Gary Barlow', subject: 'Capstone 2', status: 'NOT COMPLETED' },
    { name: 'Gary Barlow', subject: 'Web Development', status: 'COMPLETED' }
  ];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenResultsModal = (evaluation) => {
    setSelectedEvaluation(evaluation); // ✅ Store selected evaluation data
    setIsResultsModalOpen(true);
  };
  const handleCloseResultsModal = () => {
    setIsResultsModalOpen(false);
    setSelectedEvaluation(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-col lg:flex-row">
        <h1 className="text-xl font-medium dark:text-white mb-2 lg:mb-0">Instructors</h1>
        <div className="relative w-full lg:w-auto">
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search instructors"
            className="pl-8 pr-4 py-2 w-full border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="min-w-full divide-y-2 text-center bg-white text-sm dark:bg-gray-900">
          <thead>
            <tr>
              <th className="px-4 py-2 text-gray-900 dark:text-white">Name</th>
              <th className="px-4 py-2 text-gray-900 dark:text-white">Subject</th>
              <th className="px-4 py-2 text-gray-900 dark:text-white">Status</th>
              <th className="px-4 py-2 text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {instructors.map((instructor, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{instructor.name}</td>
                <td className="px-4 py-2">{instructor.subject}</td>
                <td className="px-4 py-2">{instructor.status}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <button className="bg-indigo-600 text-white px-3 py-1 text-xs rounded-full" onClick={handleOpenModal}>
                      <FaStar />
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 text-xs rounded-full" onClick={() => handleOpenResultsModal(instructor)}>
                      <FaEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={Math.ceil(instructors.length / itemsPerPage)} onPageChange={setCurrentPage} />

      {/* Evaluation Form Modal */}
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

      {/* Evaluation Results Modal */}
      {isResultsModalOpen && selectedEvaluation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <EvaluationResultsModal results={selectedEvaluation} />
            <button onClick={handleCloseResultsModal} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CEvaluation;
