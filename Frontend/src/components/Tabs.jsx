import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  const primaryColor = "#1F3463";
  const hoverColor = "#172a4d";

  return (
    <div className="flex overflow-x-auto">
      {tabs.map((label, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`flex-shrink-0 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === index
              ? `bg-[${primaryColor}] text-white rounded-lg shadow-sm`
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
