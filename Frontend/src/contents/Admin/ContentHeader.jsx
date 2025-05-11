import React from "react";
import { Search, FileDown } from "lucide-react";

const ContentHeader = ({ title, stats = [], onSearch, onExport }) => {
  return (
    <div className="grid gap-4 lg:grid-cols-2 items-center mb-4">
      <div className="font-bold flex flex-wrap gap-4 md:gap-6 lg:gap-10 text-gray-800 dark:text-white">
        <h1 className="text-2xl w-full md:w-auto">{title}</h1>
        {stats.map((stat, index) => (
        <h1 key={index} className="mt-2">{stat}</h1>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] lg:justify-self-end gap-4 w-full sm:w-auto">
        
        <div className="relative w-full sm:w-[250px]">
          <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

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
