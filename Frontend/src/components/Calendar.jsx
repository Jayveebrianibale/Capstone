import React, { useEffect, useRef, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ResizeObserver from "resize-observer-polyfill";

function ResponsiveCalendar() {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-auto rounded-xl border lg:col-span-1 flex-grow dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-300"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          sx={{
           
            "& .MuiTypography-root": {
              color: "black", 
              ".dark &": {
                color: "white",
              },
            },
            "& .MuiPickersCalendarHeader-label": {
              color: "black", 
              ".dark &": {
                color: "white",
              },
            },
            "& .MuiSvgIcon-root": {
              color: "black",
              ".dark &": {
                color: "white", 
              },
            },
            "& .MuiPickersDay-root": {
              color: "black",
              ".dark &": {
                color: "white", 
              },
            },
            "& .MuiPickersDay-root.Mui-selected": {
              backgroundColor: "rgba(0, 0, 0, 0.2)", 
              ".dark &": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            },
           
            "& .MuiPickersDay-root:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.1)", 
              ".dark &": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            },
          }}
          style={{ width: containerWidth }}
        />
      </LocalizationProvider>
    </div>
  );
}

export default ResponsiveCalendar;
