import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('Dashboard');
  const location = useLocation();
  const navigate = useNavigate();

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
    const pathToPage = {
      '/SDashboard': 'Dashboard',
      '/SEvaluations': 'Evaluations',
      '/SHistory': 'History',
      '/SAccount': 'My Account',
    };
    setActivePage(pathToPage[location.pathname] || 'Dashboard');
  }, [location.pathname]);

  const handlePageNavigation = (path, page) => {
    setActivePage(page);
    navigate(path);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activePage={activePage}
        setActivePage={handlePageNavigation}
      />
      <div className={`flex-grow ${sidebarOpen ? 'ml-56' : 'ml-0'} transition-all duration-300`}>
        <Navbar toggleSidebar={toggleSidebar} title={activePage} />
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
