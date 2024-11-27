import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';
import { IoMdNotificationsOutline } from "react-icons/io";
import ProfileIcon from "../assets/profile-icon.jpg"

function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative min-h-screen flex">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-56' : 'translate-x-0'
        }`}
      >
        <header className="bg-white h-16 border-b flex items-center justify-between px-4">
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={toggleSidebar}
          >
            <FaBars className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4 mr-5">
          <IoMdNotificationsOutline className='h-7 w-7' />
            <div className="flex items-center gap-2">
              <img
                src={ProfileIcon}
                alt="Profile"
                className="w-8 h-8 object-cover rounded-full border border-gray-300"
              />
              <span className="text-gray-400">Student</span>
            </div>
          </div>
        </header>

        <main className="p-4">
          <h2 className="text-2xl font-bold">Main Content</ h2>
          {/* Your main content goes here */}
        </main>
      </div>
    </div>
  );
}

export default Navbar;
