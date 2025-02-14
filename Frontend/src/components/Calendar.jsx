import React from "react";

function ResponsiveCalendar() {
  return (
    <div className="flex justify-center items-center min-screen p-1">
      <iframe w-full max-w-4xl
        src="https://calendar.google.com/calendar/embed?src=your_calendar_id&ctz=your_timezone"
        style={{ border: 0 }}
        width="760"
        height="337"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
}

export default ResponsiveCalendar;