import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-grow transition-all duration-300 ${
          sidebarOpen ? 'ml-56' : 'ml-0'
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className='p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
