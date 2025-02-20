import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b w-full max-w-lg">
      {tabs.map((label, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`flex-1 py-2 text-center font-semibold transition-colors duration-200 border-b-2 
            ${activeTab === index ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
