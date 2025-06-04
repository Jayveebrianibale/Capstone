import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import LogoutModal from "../contents/Admin/Modals/LogoutModal";
import DataPrivacyModal from "../contents/Admin/Modals/DataPrivacyModal";
import api from "../services/api";

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
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyModalContext, setPrivacyModalContext] = useState("pre-setup");

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
    const savedDarkMode = localStorage.getItem("darkMode");
  
    if (savedDarkMode === "true") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);
  

  const handleDarkModeToggle = () => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    } else {
      html.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    }
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    api.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
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
          } else if (profile_completed) {
            const showPrivacyNotice = localStorage.getItem("showPrivacyNoticeOnDashboard");
            if (showPrivacyNotice === "true" && location.pathname === "/SDashboard") {
              setShowPrivacyModal(true);
              localStorage.removeItem("showPrivacyNoticeOnDashboard");
            } else if (location.pathname === "/") {
              navigate("/SDashboard");
            }
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

  const handleAcceptPrivacy = () => {
    setShowPrivacyModal(false);
  };

  const isProfileSetupPage = location.pathname === "/Student-profile-setup";

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("activePage");
      sessionStorage.removeItem("savedEvaluations");
      localStorage.removeItem("darkMode");
      localStorage.removeItem("showPrivacyNoticeOnDashboard");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLogoutLoading(false);
      setLogoutModalOpen(false);
    }
  };

  if (loading) return null;

  return (
    <div className={`flex ${isDarkMode ? "dark" : ""}`}>
      <DataPrivacyModal
        isOpen={showPrivacyModal}
        onAccept={handleAcceptPrivacy}
      />

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
        loading={logoutLoading}
      />
    </div>
  );
}

export default MainLayout;