import React from 'react';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

const DarkModeToggle = ({ darkMode, handleDarkModeToggle }) => {
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
