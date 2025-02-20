import React, { useState } from "react";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";

function Bsa() {
  const [activeTab, setActiveTab] = useState(0);
  const tabLabels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const handleSearch = (query) => {
    console.log("Search:", query);
  };

  const handleExport = () => {
    console.log("Export to PDF");
  };

  const handleAddInstructor = () => {
    console.log("Add Instructor");
  };

  const instructorsByYear = [
    [
      { name: "Prof. A", ratings: { five: 20, four: 15, three: 5, two: 3, one: 2 }, comments: "Great!", overallRating: 90 },
      { name: "Prof. B", ratings: { five: 18, four: 10, three: 8, two: 5, one: 1 }, comments: "Good!", overallRating: 85 },
      { name: "Prof. A", ratings: { five: 20, four: 15, three: 5, two: 3, one: 2 }, comments: "Great!", overallRating: 90 },
      { name: "Prof. B", ratings: { five: 18, four: 10, three: 8, two: 5, one: 1 }, comments: "Good!", overallRating: 85 },
      { name: "Prof. A", ratings: { five: 20, four: 15, three: 5, two: 3, one: 2 }, comments: "Great!", overallRating: 90 },
      { name: "Prof. B", ratings: { five: 18, four: 10, three: 8, two: 5, one: 1 }, comments: "Good!", overallRating: 85 },
      { name: "Prof. A", ratings: { five: 20, four: 15, three: 5, two: 3, one: 2 }, comments: "Great!", overallRating: 90 },
      { name: "Prof. B", ratings: { five: 18, four: 10, three: 8, two: 5, one: 1 }, comments: "Good!", overallRating: 85 },
    
    ],
    [
      { name: "Prof. C", ratings: { five: 22, four: 18, three: 6, two: 2, one: 1 }, comments: "Excellent!", overallRating: 92 },
      { name: "Prof. D", ratings: { five: 15, four: 12, three: 10, two: 6, one: 2 }, comments: "Nice!", overallRating: 80 },
      { name: "Prof. C", ratings: { five: 22, four: 18, three: 6, two: 2, one: 1 }, comments: "Excellent!", overallRating: 92 },
      { name: "Prof. D", ratings: { five: 15, four: 12, three: 10, two: 6, one: 2 }, comments: "Nice!", overallRating: 80 },
      { name: "Prof. C", ratings: { five: 22, four: 18, three: 6, two: 2, one: 1 }, comments: "Excellent!", overallRating: 92 },
      { name: "Prof. D", ratings: { five: 15, four: 12, three: 10, two: 6, one: 2 }, comments: "Nice!", overallRating: 80 },
      { name: "Prof. C", ratings: { five: 22, four: 18, three: 6, two: 2, one: 1 }, comments: "Excellent!", overallRating: 92 },
      { name: "Prof. D", ratings: { five: 15, four: 12, three: 10, two: 6, one: 2 }, comments: "Nice!", overallRating: 80 },
    ],
    [
      { name: "Prof. E", ratings: { five: 25, four: 10, three: 8, two: 4, one: 3 }, comments: "Amazing!", overallRating: 95 },
      { name: "Prof. F", ratings: { five: 16, four: 14, three: 9, two: 7, one: 1 }, comments: "Fair!", overallRating: 78 },
      { name: "Prof. E", ratings: { five: 25, four: 10, three: 8, two: 4, one: 3 }, comments: "Amazing!", overallRating: 95 },
      { name: "Prof. F", ratings: { five: 16, four: 14, three: 9, two: 7, one: 1 }, comments: "Fair!", overallRating: 78 },
      { name: "Prof. E", ratings: { five: 25, four: 10, three: 8, two: 4, one: 3 }, comments: "Amazing!", overallRating: 95 },
      { name: "Prof. F", ratings: { five: 16, four: 14, three: 9, two: 7, one: 1 }, comments: "Fair!", overallRating: 78 },
      { name: "Prof. E", ratings: { five: 25, four: 10, three: 8, two: 4, one: 3 }, comments: "Amazing!", overallRating: 95 },
      { name: "Prof. F", ratings: { five: 16, four: 14, three: 9, two: 7, one: 1 }, comments: "Fair!", overallRating: 78 },
    ],
    [
      { name: "Prof. G", ratings: { five: 19, four: 17, three: 6, two: 3, one: 1 }, comments: "Very Good!", overallRating: 88 },
      { name: "Prof. H", ratings: { five: 21, four: 14, three: 8, two: 4, one: 2 }, comments: "Satisfactory!", overallRating: 82 },
      { name: "Prof. G", ratings: { five: 19, four: 17, three: 6, two: 3, one: 1 }, comments: "Very Good!", overallRating: 88 },
      { name: "Prof. H", ratings: { five: 21, four: 14, three: 8, two: 4, one: 2 }, comments: "Satisfactory!", overallRating: 82 },
      { name: "Prof. G", ratings: { five: 19, four: 17, three: 6, two: 3, one: 1 }, comments: "Very Good!", overallRating: 88 },
      { name: "Prof. H", ratings: { five: 21, four: 14, three: 8, two: 4, one: 2 }, comments: "Satisfactory!", overallRating: 82 },
      { name: "Prof. G", ratings: { five: 19, four: 17, three: 6, two: 3, one: 1 }, comments: "Very Good!", overallRating: 88 },
      { name: "Prof. H", ratings: { five: 21, four: 14, three: 8, two: 4, one: 2 }, comments: "Satisfactory!", overallRating: 82 },

    ],
  ];

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
        <div>
      <ContentHeader
        title="Instructors"
        stats={["Students: 35", "Submitted: 30"]}
        onSearch={handleSearch}
        onExport={handleExport}
        onAdd={handleAddInstructor}
      />
    </div>
    {/* <div className="grid gap-4 lg:grid-cols-2 items-center mb-4">
      <div className="font-bold text-gray-800 dark:text-white">
        <h1 className="text-2xl">Instructors</h1>
        <h1 className="mt-2">Students: 35</h1>
        <h1 className="mt-2">Submitted: 30</h1>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search instructors..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200 flex items-center justify-center"
          title="Export to PDF"
        >
          <FileDown size={20} />
        </button>

        <button
          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200 flex items-center justify-center"
          title="Add Instructor"
        >
          <Plus size={20} />
        </button>
      </div>
    </div> */}
  
      {/* <div className="flex mb-4">
        <div className="flex border-b w-full max-w-lg">
          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((label, index) => (
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
      </div> */}

    <div className="flex flex-col">
      <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>

      <div className="mt-4">
        <InstructorTable instructors={instructorsByYear[activeTab]} />
      </div>
    </main>
  );
}

export default Bsa;
