import React, { useState, useEffect } from 'react';
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme);
  }, []);

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <button onClick={handleDarkModeToggle}>
      {darkMode ? (
        <MdOutlineLightMode className="h-5 w-5 sm:h-5 sm:w-5 text-gray-800 dark:text-gray-200" />
      ) : (
        <MdOutlineDarkMode className="h-5 w-5 sm:h-5 sm:w-5 text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
};

export default DarkModeToggle;
