import React, { useState, useEffect, useRef } from "react";
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

  const hasRedirected = useRef(false);

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
        const { role, profile_completed } = response.data;
        
        setUser(response.data);
        setRole(role);
        setLoading(false);

        if (!hasRedirected.current && location.pathname !== "/Student-profile-setup") {
          hasRedirected.current = true;

          if (role === "Student" && profile_completed) {
            if (!location.pathname.includes("SDashboard") && !location.pathname.includes("Account")) {
              sessionStorage.setItem("user", JSON.stringify(response.data));
              navigate("/SDashboard");
            }
          } else if (role === "Instructor") {
            if (!location.pathname.includes("InstructorDashboard") && !location.pathname.includes("Account")) {
              navigate("/InstructorDashboard");
            }
          } else if (role === "Admin") {
            if (!location.pathname.includes("AdminDashboard") && !location.pathname.includes("Account")) {
              navigate("/AdminDashboard");
            }
          } else if (role === "Student" && !profile_completed) {
            if (!location.pathname.includes("Student-profile-setup")) {
              navigate("/Student-profile-setup");
            }
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
