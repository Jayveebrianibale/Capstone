import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper } from "@mui/material";
import InstructorTable from "../../../contents/Admin/InstructorTable";

function Bsa() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const instructorsByYear = [
    [
      { name: "Prof. A", ratings: { five: 20, four: 15, three: 5, two: 3, one: 2 }, comments: "Great!", overallRating: 90 },
      { name: "Prof. B", ratings: { five: 18, four: 10, three: 8, two: 5, one: 1 }, comments: "Good!", overallRating: 85 },
    ],
    [
      { name: "Prof. C", ratings: { five: 22, four: 18, three: 6, two: 2, one: 1 }, comments: "Excellent!", overallRating: 92 },
      { name: "Prof. D", ratings: { five: 15, four: 12, three: 10, two: 6, one: 2 }, comments: "Nice!", overallRating: 80 },
    ],
    [
      { name: "Prof. E", ratings: { five: 25, four: 10, three: 8, two: 4, one: 3 }, comments: "Amazing!", overallRating: 95 },
      { name: "Prof. F", ratings: { five: 16, four: 14, three: 9, two: 7, one: 1 }, comments: "Fair!", overallRating: 78 },
    ],
    [
      { name: "Prof. G", ratings: { five: 19, four: 17, three: 6, two: 3, one: 1 }, comments: "Very Good!", overallRating: 88 },
      { name: "Prof. H", ratings: { five: 21, four: 14, three: 8, two: 4, one: 2 }, comments: "Satisfactory!", overallRating: 82 },
    ],
  ];

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}>
        Instructors
      </Typography>

      {/* Tabs */}
      <Paper
        sx={{
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "background.paper",
          width: "100%",
          maxWidth: 650,
          mx: "auto",
          mb: 2,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              fontWeight: "bold",
              textTransform: "none",
            },
          }}
        >
          <Tab label="1st Year" />
          <Tab label="2nd Year" />
          <Tab label="3rd Year" />
          <Tab label="4th Year" />
        </Tabs>
      </Paper>

      <Box>
        <InstructorTable instructors={instructorsByYear[value]} />
      </Box>
    </main>
  );
}

export default Bsa;
