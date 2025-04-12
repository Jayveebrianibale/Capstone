import React from "react";
import { CircularProgress, Box } from "@mui/material";

const CompletionIndicator = ({ value, size = 200 }) => {
  return (
    <div
      className="flex flex-col items-center"
      style={{ width: size, height: size }}
    >
      <Box position="relative" display="inline-flex" width={size} height={size}>
        <CircularProgress
          variant="determinate"
          value={value}
          size={size}
          thickness={6}
          sx={{
            color: "#1F3463",
            backgroundColor: "transparent",
          }}
        />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <div
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100"
          >
            {`${value}%`}
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default CompletionIndicator;
