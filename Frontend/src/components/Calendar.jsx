import React, { useEffect, useRef, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import ResizeObserver from 'resize-observer-polyfill';

function ResponsiveCalendar() {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
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
    <div ref={containerRef} className="flex flex-col h-auto rounded-xl border shadow-md lg:col-span-1 flex-grow">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar className="pt-6" style={{ width: containerWidth }} />
      </LocalizationProvider>
    </div>
  );
}

export default ResponsiveCalendar;
