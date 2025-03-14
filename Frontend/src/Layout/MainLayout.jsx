import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios"; 

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
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
  
    axios
      .get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { role, has_profile } = response.data;
  
        if (role === "Student" && !has_profile) {
          setTimeout(async () => {
            const checkResponse = await axios.get("http://127.0.0.1:8000/api/user", {
              headers: { Authorization: `Bearer ${token}` },
            });
  
            if (checkResponse.data.has_profile) {
              sessionStorage.setItem("user", JSON.stringify(checkResponse.data));
              navigate("/SDashboard");
            }
          }, 1500);
        }
  
        setRole(role);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        navigate("/login");
      });
  }, [navigate]);
  

  if (loading) return null;

  const isProfileSetupPage = location.pathname === "/Student-profile-setup";

  return (
    <div className={`flex ${isDarkMode ? "dark" : ""}`}>
      {!isProfileSetupPage && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePage={activePage}
          setActivePage={setActivePage}
          role={role}
          isMobile={isMobile}
        />
      )}
      <div
        className={`flex-grow ${!isProfileSetupPage && sidebarOpen ? "ml-56" : "ml-0"} transition-all duration-300`}
      >
        {!isProfileSetupPage && (
          <Navbar
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            darkMode={isDarkMode}
            handleDarkModeToggle={() => {
              setIsDarkMode(!isDarkMode);
              localStorage.setItem("darkMode", !isDarkMode);
            }}
            title={activePage}
          />
        )}
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;