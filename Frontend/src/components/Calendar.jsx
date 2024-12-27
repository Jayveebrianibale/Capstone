import React, { useEffect, useRef, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import ResizeObserver from "resize-observer-polyfill";
import dayjs from "dayjs";

function ResponsiveCalendar() {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Track selected date
  const today = dayjs();

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
    setSelectedDate(newDate); // Update selected date when clicked
  };

  const renderDay = (day, pickersDayProps) => {
    const isToday = day.isSame(today, "day");
    const isSelected = day.isSame(selectedDate, "day"); // Check if the day is selected

    return (
      <PickersDay
        {...pickersDayProps}
        day={day}
        onClick={() => handleDateChange(day)} 
        className={`${
          isToday
            ? "bg-blue-500 text-white" 
            : isSelected
            ? "bg-blue-500 text-white" 
            : "" // No default background color, remove it
        } ${pickersDayProps.dayOutsideMonth ? "text-gray-400" : "text-black"}`}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-auto rounded-xl shadow-md lg:col-span-1 flex-grow dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-300 justify-center items-center"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          renderDay={renderDay}
          onChange={handleDateChange}
          sx={{
            fontFamily: "'Inter', sans-serif",
            padding: '16px',
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
              backgroundColor: "transparent", 
              ".dark &": {
              backgroundColor: "transparent", 
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
