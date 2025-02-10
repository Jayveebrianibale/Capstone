import React, { useEffect, useRef, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import ResizeObserver from "resize-observer-polyfill";
import dayjs from "dayjs";

function ResponsiveCalendar() {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // ✅ Always has an initial value

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

  const handleDateChange = (newDate) => {
    if (!newDate) return; // ✅ Prevent setting an undefined value
    console.log("New Date Selected:", newDate.format("YYYY-MM-DD")); // Debugging
    setSelectedDate(newDate);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-auto rounded-xl shadow-md lg:col-span-1 flex-grow dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-300 justify-center items-center"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate} // ✅ Fully controlled component
          onChange={handleDateChange}
          defaultValue={dayjs()} // ✅ Prevents uncontrolled behavior
          sx={{
            fontFamily: "'Inter', sans-serif",
            padding: "16px",
            "& .MuiTypography-root": {
              color: "black",
              "&.dark": { color: "white" },
            },
            "& .MuiPickersCalendarHeader-label": {
              color: "black",
              "&.dark": { color: "white" },
            },
            "& .MuiSvgIcon-root": {
              color: "black",
              "&.dark": { color: "white" },
            },
            "& .MuiPickersDay-root": {
              color: "black",
              "&.dark": { color: "white" },
            },
            "& .MuiPickersDay-root.Mui-selected": {
              backgroundColor: "blue",
              color: "white",
              "&.dark": { backgroundColor: "blue", color: "white" },
            },
          }}
          style={{ width: containerWidth }}
        />
      </LocalizationProvider>
    </div>
  );
}

export default ResponsiveCalendar;
