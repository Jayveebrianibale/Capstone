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
  useTheme,
} from "@mui/material";

function InstructorTable({ instructors }) {
  const theme = useTheme();
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        boxShadow: theme.palette.mode === "dark" ? "0px 4px 10px rgba(255, 255, 255, 0.1)" : "0px 4px 10px rgba(0, 0, 0, 0.1)",
        overflowX: "auto",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          padding: 2,
          fontWeight: "bold",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        Instructor Evaluation Results
      </Typography>

      <Table sx={{ minWidth: 650 }} aria-label="modern instructor table">
        <TableHead
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f4f6f8",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>Instructor Name</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: theme.palette.text.primary }}>Exceedingly Well</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: theme.palette.text.primary }}>Very Well</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: theme.palette.text.primary }}>Moderately</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: theme.palette.text.primary }}>Slightly</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: theme.palette.text.primary }}>Not at All</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "left", color: theme.palette.text.primary }}>Comments</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: theme.palette.text.primary }}>Percentage</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {instructors.map((instructor, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor: theme.palette.mode === "dark"
                  ? (index % 2 === 0 ? "#424242" : "#303030") 
                  : (index % 2 === 0 ? "#ffffff" : "#f9f9f9"),
                "&:hover": { backgroundColor: theme.palette.mode === "dark" ? "#555" : "#e3f2fd" },
              }}
            >
              <TableCell sx={{ fontWeight: "500", color: theme.palette.text.primary }}>
                {instructor.name}
              </TableCell>
              <TableCell align="center" sx={{ color: theme.palette.text.primary }}>
                {instructor.ratings.five}
              </TableCell>
              <TableCell align="center" sx={{ color: theme.palette.text.primary }}>
                {instructor.ratings.four}
              </TableCell>
              <TableCell align="center" sx={{ color: theme.palette.text.primary }}>
                {instructor.ratings.three}
              </TableCell>
              <TableCell align="center" sx={{ color: theme.palette.text.primary }}>
                {instructor.ratings.two}
              </TableCell>
              <TableCell align="center" sx={{ color: theme.palette.text.primary }}>
                {instructor.ratings.one}
              </TableCell>
              <TableCell sx={{ fontStyle: "italic", color: theme.palette.text.secondary }}>
                {instructor.comments}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: instructor.overallRating >= 85 ? "green" : "red",
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
