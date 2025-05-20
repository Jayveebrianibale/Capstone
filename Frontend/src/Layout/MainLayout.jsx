import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import LogoutModal from "../contents/Admin/Modals/LogoutModal";


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
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

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

  axios.get("https://capstone-production-bf29.up.railway.app/api/user", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      const updatedUser = response.data;
      const { role, profile_completed } = updatedUser;

      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("profileCompleted", profile_completed);
      setUser(updatedUser);
      setRole(role);
      setLoading(false);

      if (role === "Student") {
        if (!profile_completed && location.pathname !== "/Student-profile-setup") {
          navigate("/Student-profile-setup");
        } else if (profile_completed && location.pathname === "/") {
          navigate("/SDashboard");
        }
      } else if (role === "Instructor" && location.pathname === "/") {
        navigate("/InstructorDashboard");
      } else if (role === "Admin" && location.pathname === "/") {
        navigate("/AdminDashboard");
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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("activePage");
    // sessionStorage.removeItem('selectedYear');
    // sessionStorage.removeItem('selectedSemester');
    navigate("/login");
  };

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
          openLogoutModal={() => setLogoutModalOpen(true)}
        />
      )}
      <div
        className={`flex-grow ${!isProfileSetupPage && sidebarOpen ? "ml-64" : "ml-0"} transition-all duration-300`}
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

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default MainLayout;