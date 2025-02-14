import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('Dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [role, setRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setRole(parsedUser.role);
    }
  }, []);

  useEffect(() => {
    const pathToPage = {
      student: {
        '/SDashboard': 'Dashboard',
        '/SEvaluations': 'Evaluations',
      },
      admin: {
        '/ADashboard': 'Dashboard',
        '/ManageUsers': 'Manage Users',
      },
      instructor: {
        '/IDashboard': 'Dashboard',
        '/IClasses': 'Classes',
      }
    };
    setActivePage(pathToPage[role]?.[location.pathname] || 'Dashboard');
  }, [location.pathname, role]);

  const handlePageNavigation = (path, page) => {
    setActivePage(page);
    navigate(path);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className={`flex ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activePage={activePage}
        setActivePage={handlePageNavigation}
        role={role}
      />
      <div className={`flex-grow ${sidebarOpen ? 'ml-56' : 'ml-0'} transition-all duration-300`}>
        <Navbar
          toggleSidebar={toggleSidebar}
          title={activePage}
          darkMode={isDarkMode}
          handleDarkModeToggle={handleDarkModeToggle}
        />
        <Outlet context={{ isDarkMode, handleDarkModeToggle }} />
      </div>
    </div>
  );
}

export default MainLayout;