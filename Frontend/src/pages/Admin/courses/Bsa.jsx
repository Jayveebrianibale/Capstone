import React, { useState } from "react";
import { Tab, Tabs, Box, Typography } from "@mui/material";
import InstructorTable from "../../../contents/Admin/InstructorTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function Bsa() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const instructorsByYear = {
    firstYear: [
      { name: "Prof. Alice", ratings: { five: 4, four: 3, three: 2, two: 1, one: 0 }, comments: "Very engaging class.", overallRating: "88%" },
      { name: "Prof. Bob", ratings: { five: 3, four: 3, three: 3, two: 1, one: 0 }, comments: "Explains well, but a bit fast-paced.", overallRating: "82%" }
    ],
    secondYear: [
      { name: "Dr. Charlie", ratings: { five: 5, four: 4, three: 2, two: 0, one: 0 }, comments: "Excellent teaching methods.", overallRating: "92%" },
      { name: "Prof. Daisy", ratings: { five: 2, four: 4, three: 3, two: 1, one: 0 }, comments: "Gives great real-world examples.", overallRating: "85%" }
    ],
    thirdYear: [
      { name: "Prof. Evan", ratings: { five: 3, four: 3, three: 2, two: 1, one: 1 }, comments: "Can be strict but very knowledgeable.", overallRating: "80%" },
      { name: "Dr. Fiona", ratings: { five: 4, four: 4, three: 1, two: 1, one: 0 }, comments: "Encourages class participation.", overallRating: "87%" }
    ],
    fourthYear: [
      { name: "Dr. George", ratings: { five: 5, four: 4, three: 2, two: 0, one: 0 }, comments: "Great mentorship and guidance.", overallRating: "95%" },
      { name: "Prof. Hannah", ratings: { five: 3, four: 4, three: 3, two: 0, one: 0 }, comments: "Highly recommended for thesis advice.", overallRating: "89%" }
    ]
  };

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
        Instructors
      </h1>

      <Tabs value={value} onChange={handleChange} aria-label="course tabs" centered>
        <Tab label="1st Year" />
        <Tab label="2nd Year" />
        <Tab label="3rd Year" />
        <Tab label="4th Year" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <InstructorTable instructors={instructorsByYear.firstYear} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        
        <InstructorTable instructors={instructorsByYear.secondYear} />
      </TabPanel>

      <TabPanel value={value} index={2}>
        
        <InstructorTable instructors={instructorsByYear.thirdYear} />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <InstructorTable instructors={instructorsByYear.fourthYear} />
      </TabPanel>
    </main>
  );
}

export default Bsa;
