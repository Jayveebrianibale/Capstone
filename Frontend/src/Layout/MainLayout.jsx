import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('Dashboard');
  const location = useLocation();
  const navigate = useNavigate();

  // Function to update active page based on route
  useEffect(() => {
    const pathToPage = {
      '/SDashboard': 'Dashboard',
      '/evaluations': 'Evaluations',
      '/SHistory': 'History',
      '/my-account': 'My Account'
    };
    setActivePage(pathToPage[location.pathname] || 'Dashboard');
  }, [location.pathname]);

  // Function to handle page navigation
  const handlePageNavigation = (path, page) => {
    setActivePage(page);
    navigate(path);
  };

  return (
    <div className="flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        activePage={activePage}
        setActivePage={handlePageNavigation}
      />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
