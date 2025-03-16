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
        { 
          name: "Prof. A", 
          ratings: { q1: 5, q2: 4.8, q3: 4.7, q4: 4.5, q5: 4.6, q6: 4.4, q7: 4.9, q8: 4.3, q9: 4.2 }, 
          comments: "Great!", 
          overallRating: 90 
        },
        { 
          name: "Prof. B", 
          ratings: { q1: 4.9, q2: 4.7, q3: 4.6, q4: 4.8, q5: 4.5, q6: 4.2, q7: 4.6, q8: 4.3, q9: 4.1 }, 
          comments: "Good!", 
          overallRating: 85 
        },
      ],
      // 2nd Year
      [
        { 
          name: "Prof. C", 
          ratings: { q1: 4.5, q2: 4.3, q3: 4.6, q4: 4.2, q5: 4.8, q6: 4.7, q7: 4.6, q8: 4.9, q9: 4.5 }, 
          comments: "Very informative!", 
          overallRating: 88 
        },
        { 
          name: "Prof. D", 
          ratings: { q1: 4.8, q2: 4.6, q3: 4.7, q4: 4.9, q5: 4.5, q6: 4.3, q7: 4.2, q8: 4.4, q9: 4.1 }, 
          comments: "Helpful!", 
          overallRating: 86 
        },
      ],
      // 3rd Year
      [
        { 
          name: "Prof. E", 
          ratings: { q1: 4.9, q2: 4.8, q3: 4.7, q4: 4.6, q5: 4.5, q6: 4.4, q7: 4.3, q8: 4.2, q9: 4.1 }, 
          comments: "Challenging but rewarding!", 
          overallRating: 89 
        },
        { 
          name: "Prof. F", 
          ratings: { q1: 4.7, q2: 4.6, q3: 4.5, q4: 4.4, q5: 4.3, q6: 4.2, q7: 4.1, q8: 4.9, q9: 4.8 }, 
          comments: "Engaging lessons!", 
          overallRating: 87 
        },
      ],
      // 4th Year
      [
        { 
          name: "Prof. G", 
          ratings: { q1: 4.6, q2: 4.5, q3: 4.4, q4: 4.3, q5: 4.2, q6: 4.1, q7: 4.9, q8: 4.8, q9: 4.7 }, 
          comments: "Excellent guidance!", 
          overallRating: 91 
        },
        { 
          name: "Prof. H", 
          ratings: { q1: 4.5, q2: 4.4, q3: 4.3, q4: 4.2, q5: 4.1, q6: 4.9, q7: 4.8, q8: 4.7, q9: 4.6 }, 
          comments: "Well-prepared lectures!", 
          overallRating: 90 
        },
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