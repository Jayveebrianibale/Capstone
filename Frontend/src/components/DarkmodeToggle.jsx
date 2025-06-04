import React, { useEffect } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const DarkModeToggle = ({ darkMode, handleDarkModeToggle }) => {
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={handleDarkModeToggle}
      className="p-2 rounded-lg transition-colors duration-30"
    >
      {darkMode ? (
        <MdOutlineLightMode className="h-5 w-5 text-yellow-400" />
      ) : (
        <MdOutlineDarkMode className="h-5 w-5 text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
};

export default DarkModeToggle;
