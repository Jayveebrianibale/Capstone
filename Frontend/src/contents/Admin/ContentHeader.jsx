import React from "react";
import { 
  Search, 
  FileDown, 
  Mail, 
  ChevronDown, 
  Calendar,
  BookOpen,

} from "lucide-react";

const ContentHeader = ({ 
  title, 
  stats = [], 
  onExport, 
  onBulkSend,
  onSchoolYearChange,
  onSemesterChange,
  selectedSchoolYear,
  selectedSemester,
  schoolYearOptions = [],
  semesterOptions = []
}) => {
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
          title="Export to PDF"
          onClick={onExport}
        >
          <FileDown size={20} />
        </button>
      </div>
    </div>

  );
};

export default ContentHeader;