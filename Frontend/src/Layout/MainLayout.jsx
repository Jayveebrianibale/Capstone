import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [role, setRole] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const fullTitleMap = {
    BSA: "Bachelor of Science in Accountancy",
    BSAIS: "Bachelor of Science in Accounting Information System",
    BSSW: "Bachelor of Science in Social Work",
    BAB: "Bachelor of Arts in Broadcasting",
    BSIS: "Bachelor of Science in Information Systems",
    ACT: "Associate in Computer Technology",
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    if (windowWidth < 768) {
      setIsMobile(true);
      setSidebarOpen(false);
    } else {
      setIsMobile(false);
      setSidebarOpen(true);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "Admin");
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
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
        role={role}
        isMobile={isMobile}
      />
      <div className={`flex-grow ${sidebarOpen ? "ml-56" : "ml-0"} transition-all duration-300`}>
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          darkMode={isDarkMode}
          handleDarkModeToggle={handleDarkModeToggle}
          title={fullTitleMap[activePage] || activePage}
        />
        <Outlet context={{ isDarkMode, handleDarkModeToggle }} />
      </div>
    </div>
  );
}

export default MainLayout;
