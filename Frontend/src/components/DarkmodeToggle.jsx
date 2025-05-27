import React, { useEffect, useState } from 'react';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else if (saved === 'false') {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      // If nothing saved, fallback to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setDarkMode(false);
      }
    }
  }, []);

  const handleDarkModeToggle = () => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    } else {
      html.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    }
    setDarkMode(!darkMode);
  };

  return (
    <button onClick={handleDarkModeToggle} className="p-2 rounded">
      {darkMode ? (
        <MdOutlineLightMode className="h-5 w-5 text-yellow-400" />
      ) : (
        <MdOutlineDarkMode className="h-5 w-5 text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
};

export default DarkModeToggle;
