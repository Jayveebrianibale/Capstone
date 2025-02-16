import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme);
  }, []);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     const parsedUser = JSON.parse(storedUser);
  //     setRole(parsedUser.role);
  //   }
  // }, []);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "student");
  }, []);

  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <div className={`flex ${isDarkMode ? "dark" : ""}`}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage={activePage}
        setActivePage={setActivePage}
        role={role}
      />
      <div className={`flex-grow ${sidebarOpen ? "ml-56" : "ml-0"} transition-all duration-300`}>
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          darkMode={isDarkMode}
          handleDarkModeToggle={handleDarkModeToggle}
        />
        <Outlet context={{ isDarkMode, handleDarkModeToggle }} />
      </div>
    </div>
  );
}

export default MainLayout;
