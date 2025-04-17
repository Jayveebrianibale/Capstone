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
  const [user, setUser] = useState(null);

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
    const savedActivePage = localStorage.getItem("activePage");
    if (savedActivePage) {
      setActivePage(savedActivePage);
    }
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
        const { role, profile_completed } = response.data;
  
        setUser(response.data);
        setRole(role);
        setLoading(false);
  
        const isProfileSetupPage = location.pathname.includes("Student-profile-setup");
        if (location.pathname === "/" || location.pathname === "/login") {
          if (role === "Student") {
            if (profile_completed) {
              sessionStorage.setItem("user", JSON.stringify(response.data));
              navigate("/SDashboard");
            } else {
              navigate("/Student-profile-setup");
            }
          } else if (role === "Instructor") {
            navigate("/InstructorDashboard");
          } else if (role === "Admin") {
            navigate("/AdminDashboard");
          }
        }
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        navigate("/login");
      });
  }, [navigate, location.pathname]);

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
            user={user}
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
