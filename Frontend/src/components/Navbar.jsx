import React, { useState, useEffect } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import DarkModeToggle from "../components/DarkmodeToggle";

const baseURL = import.meta.env.VITE_API_URL.replace('/api', '');

function Navbar({ toggleSidebar, title, darkMode, handleDarkModeToggle, user, activePage }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const abbreviationMap = {
    "Bachelor of Science in Accountancy": "BSA",
    "Bachelor of Science in Accounting Information System": "BSAIS",
    "Bachelor of Science in Social Work": "BSSW",
    "Bachelor of Arts in Broadcasting": "BAB",
    "Bachelor of Science in Information Systems": "BSIS",
    "Associate in Computer Technology": "ACT",
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("User object:", user);
    console.log("User role:", user?.role);
  }, [user]);

  const displayTitle = windowWidth < 768 ? abbreviationMap[title] || title : title;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center">
        <button
          className="md:hidden text-gray-800 dark:text-gray-200 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars className="h-4 w-4" />
        </button>
        <h1 className="sm:text-lg md:text-xl lg:text-[130%] font-medium text-center sm:text-left ml-4 md:ml-0 dark:text-gray-200">
          {displayTitle}
        </h1>
      </div>

      <div className="flex items-center mr-2">
        <div>
          <DarkModeToggle darkMode={darkMode} handleDarkModeToggle={handleDarkModeToggle} />
        </div>

        {/* Notification icon for admins with reduced padding and margin */}
        {user && (user.role.toLowerCase() === "admin") && (
          <button
            className="relative mr-1 px-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            aria-label="Notifications"
          >
            <FaBell className="h-5 w-5" />
          </button>
        )}

        {/* User profile button with gap between image and text */}
        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          {user && (
            <button className="flex items-center gap-2 focus:outline-none">
              {user.profile_picture && (
                <img
                  src={`${baseURL}${user.profile_picture}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
                />
              )}
              <span className="hidden sm:block text-gray-700 dark:text-gray-200 font-normal text-sm">
                {user.role}
              </span>
            </button>
          )}

          {showDropdown && user && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow-sm z-50">
              <div className="px-4 py-3">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {user.email}
                </span>
              </div>
              {/* Add other dropdown items here if needed */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
