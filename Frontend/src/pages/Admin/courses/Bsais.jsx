import React, { useState } from "react";
import InstructorTable from "../../../contents/Admin/InstructorTable";
import Tabs from "../../../components/Tabs";
import ContentHeader from "../../../contents/Admin/ContentHeader";


function Bsais() {

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

      <div className="flex flex-col">
        <Tabs tabs={tabLabels} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="mt-4">
        <InstructorTable instructors={instructorsByYear[activeTab]} />
      </div>
    </main>
  )
}

export default Bsais