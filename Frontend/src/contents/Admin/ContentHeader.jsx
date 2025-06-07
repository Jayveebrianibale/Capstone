import React, { useState } from "react";
import { 
  FileDown, 
  Mail, 
  ChevronDown, 
  Calendar,
  BookOpen,
  FileText,
  FileSpreadsheet,
  Loader2
} from "lucide-react";
import EvaluationService from "../../services/EvaluationService";

const ContentHeader = ({ 
  title, 
  stats = [], 
  onBulkSend,
  onSchoolYearChange,
  onSemesterChange,
  selectedSchoolYear,
  selectedSemester,
  schoolYearOptions = [],
  semesterOptions = []
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState(null);

  const handleExport = async () => {
    if (!selectedExportType) return;
    
    setIsExporting(true);
    
    try {
      let response;
      const filename = `instructor-evaluation-results.${selectedExportType}`;
      
      if (selectedExportType === 'pdf') {
        response = await EvaluationService.exportInstructorResultsPdf();
      } else {
        response = await EvaluationService.exportInstructorResultsCsv();
      }
      
      EvaluationService.downloadFile(response.data, filename);
    } catch (error) {
      console.error('Export failed:', error);
      // Add error handling (e.g., toast notification)
    } finally {
      setIsExporting(false);
      setIsExportModalOpen(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2 items-start mb-4">
      {/* Title and stats */}
      <div className="font-bold flex flex-wrap md:gap-6 lg:gap-10 text-gray-800 dark:text-white">
        <h1 className="text-2xl w-full md:w-auto">{title}</h1>
        {stats.map((stat, index) => (
          <h1 key={index} className="mt-2">{stat}</h1>
        ))}
      </div>

      {/* Filter + Buttons Section */}
      <div className="flex flex-wrap gap-2 justify-start sm:justify-end w-full">
        
        {/* School Year Dropdown */}
        <div className="relative min-w-[180px] flex-1 sm:flex-none">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <select
            value={selectedSchoolYear}
            onChange={(e) => onSchoolYearChange && onSchoolYearChange(e.target.value)}
            className="block w-full pl-10 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-gray-700 dark:text-gray-200"
          >
            <option value="" className="text-gray-400">School Year</option>
            {schoolYearOptions.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>

        {/* Semester Dropdown */}
        <div className="relative min-w-[180px] flex-1 sm:flex-none">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BookOpen className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <select
            value={selectedSemester}
            onChange={(e) => onSemesterChange && onSemesterChange(e.target.value)}
            className="block w-full pl-10 pr-8 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-gray-700 dark:text-gray-200"
          >
            <option value="" className="text-gray-400">Semester</option>
            {semesterOptions.map((semester) => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>

        {/* Bulk Send Button */}
        {onBulkSend && (
          <button
            className="p-2 bg-[#1F3463] hover:bg-blue-600 text-white rounded-lg transition duration-200 flex items-center justify-center"
            title="Send All Results"
            onClick={onBulkSend}
          >
            <Mail size={20} />
          </button>
        )}

        {/* Export Button */}
        <button
          className="p-2 bg-[#1F3463] hover:bg-blue-600 text-white rounded-lg transition duration-200 flex items-center justify-center"
          title="Export"
          onClick={() => setIsExportModalOpen(true)}
        >
          <FileDown size={20} />
        </button>
      </div>

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Export Options</h2>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="text-gray-500 text-3xl hover:text-gray-700 dark:hover:text-gray-300"
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* PDF Card */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedExportType === 'pdf' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
                onClick={() => setSelectedExportType('pdf')}
              >
                <div className="flex flex-col items-center text-center">
                  <FileText className="h-8 w-8 text-[#1F3463] mb-2" />
                  <span className="font-medium text-gray-800 dark:text-white">PDF</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Portable Document</span>
                </div>
              </div>
              
              {/* CSV Card */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedExportType === 'csv' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
                onClick={() => setSelectedExportType('csv')}
              >
                <div className="flex flex-col items-center text-center">
                  <FileSpreadsheet className="h-8 w-8 text-[#1F3463] mb-2" />
                  <span className="font-medium text-gray-800 dark:text-white">CSV</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Spreadsheet Format</span>
                </div>
              </div>
            </div>
            
            {/* Export Button */}
            {selectedExportType && !isExporting && (
              <button
                className="w-full py-2 bg-[#1F3463] hover:bg-blue-700 text-white rounded-lg transition duration-200 flex items-center justify-center"
                onClick={handleExport}
              >
                Export as {selectedExportType.toUpperCase()}
              </button>
            )}
            
            {/* Loading state */}
            {isExporting && (
              <div className="w-full py-2 bg-[#1F3463] text-white rounded-lg flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Exporting {selectedExportType.toUpperCase()}...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentHeader;