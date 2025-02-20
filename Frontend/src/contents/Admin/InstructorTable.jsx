import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

function InstructorTable({ instructors }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          textAlign: "center",
          p: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Instructor Evaluation Results
        </Typography>
      </Box>

      {/* Table */}
      <Table sx={{ minWidth: 700 }} aria-label="Instructor Evaluation Table">
        {/* Table Header */}
        <TableHead
          sx={{
            backgroundColor: "background.default",
          }}
        >
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Instructor Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Exceedingly Well (5)
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Very Well (4)
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Moderately (3)
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Slightly (2)
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Not at All (1)
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Comments</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Percentage
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {instructors.map((instructor, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor: index % 2 === 0 ? "background.paper" : "action.hover",
                "&:hover": { backgroundColor: "action.selected" },
              }}
            >
              <TableCell sx={{ fontWeight: "500" }}>{instructor.name}</TableCell>
              <TableCell align="center">{instructor.ratings.five}</TableCell>
              <TableCell align="center">{instructor.ratings.four}</TableCell>
              <TableCell align="center">{instructor.ratings.three}</TableCell>
              <TableCell align="center">{instructor.ratings.two}</TableCell>
              <TableCell align="center">{instructor.ratings.one}</TableCell>
              <TableCell sx={{ fontStyle: "italic", color: "text.secondary" }}>
                {instructor.comments}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: instructor.overallRating >= 85 ? "success.main" : "error.main",
                }}
              >
                {instructor.overallRating}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default InstructorTable;
