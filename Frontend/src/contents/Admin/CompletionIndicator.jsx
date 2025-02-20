import React from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

const CompletionIndicator = ({ value, size = 180 }) => {
  return (
    <div className="flex flex-col items-center" style={{ width: size, height: size }}>
      <Box position="relative" display="inline-flex" width={size} height={size}>
        <CircularProgress
          variant="determinate"
          value={value}
          size={size} 
          thickness={5}
          sx={{
            color: value === 100 ? "green" : "blue",
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
          <Typography
            variant="h6"
            component="div"
            className="text-gray-900 dark:text-gray-100 font-bold"
          >
            {`${value}%`}
          </Typography>
        </Box>
      </Box>
      <p className="mt-4 mb-6 text-gray-900 dark:text-gray-100 font-medium">
        Completion Rate
      </p>
    </div>
  );
};

export default CompletionIndicator;
