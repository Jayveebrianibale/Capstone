import React, { useState } from "react";
import { 
  FileDown, 
  Mail, 
  ChevronDown, 
  Calendar,
  BookOpen,
  FileText,
  FileSpreadsheet,
  Loader2,
  X
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Export Results</h2>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* PDF Option */}
              <button
                onClick={() => setSelectedExportType('pdf')}
                className={`w-full p-4 rounded-lg border transition-all ${
                  selectedExportType === 'pdf'
                    ? 'border-[#1F3463] bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#1F3463]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    selectedExportType === 'pdf'
                      ? 'bg-[#1F3463] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-[#1F3463]'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">PDF Format</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Portable Document Format</div>
                  </div>
                </div>
              </button>

              {/* CSV Option */}
              <button
                onClick={() => setSelectedExportType('csv')}
                className={`w-full p-4 rounded-lg border transition-all ${
                  selectedExportType === 'csv'
                    ? 'border-[#1F3463] bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#1F3463]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    selectedExportType === 'csv'
                      ? 'bg-[#1F3463] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-[#1F3463]'
                  }`}>
                    <FileSpreadsheet size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">CSV Format</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Spreadsheet Format</div>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Export Button */}
            {selectedExportType && !isExporting && (
              <button
                className="w-full py-2.5 bg-[#1F3463] hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                onClick={handleExport}
              >
                Export as {selectedExportType.toUpperCase()}
              </button>
            )}
            
            {/* Loading state */}
            {isExporting && (
              <div className="w-full py-2.5 bg-[#1F3463] text-white rounded-lg flex items-center justify-center font-medium">
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