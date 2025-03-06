import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios"; 

function MainLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [role, setRole] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const cachedRole = localStorage.getItem("role");
    if (cachedRole) {
      setRole(cachedRole);
      setLoading(false);
    } else {
      axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const userRole = response.data.role;
        setRole(userRole);
        localStorage.setItem("role", userRole);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        navigate("/login");
      });
    }
  }, [navigate]);

  if (loading) return null; 

  return (
    <div className={`flex ${isDarkMode ? "dark" : ""}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage={activePage} setActivePage={setActivePage} role={role} isMobile={isMobile} />
      <div className={`flex-grow ${sidebarOpen ? "ml-56" : "ml-0"} transition-all duration-300`}>
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} darkMode={isDarkMode} handleDarkModeToggle={() => {
          setIsDarkMode(!isDarkMode);
          localStorage.setItem("darkMode", !isDarkMode);
        }} title={activePage} />
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
