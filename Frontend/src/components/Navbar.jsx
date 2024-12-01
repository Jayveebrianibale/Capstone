import React from 'react';
import { FaBars } from 'react-icons/fa';
import { IoMdNotificationsOutline } from "react-icons/io";
import ProfileIcon from "../assets/profile-icon.jpg";
import { MdOutlineDarkMode } from "react-icons/md";

function Navbar({ toggleSidebar, sidebarOpen }) {
  return (
    <div className="bg-white h-16 border-b flex items-center justify-between px-4">
      <button
        className="md:hidden text-gray-800 focus:outline-none"
        onClick={toggleSidebar}
      >
        <FaBars className="h-4 w-4" />
      </button>
      <h1 className="text-2xl font-medium">Dashboard</h1>
      <div className="flex items-center gap-4 mr-5">
        <MdOutlineDarkMode className="h-7 w-7" />
        <IoMdNotificationsOutline className="h-7 w-7" />
        <div className="flex items-center gap-2">
          <img
            src={ProfileIcon}
            alt="Profile"
            className="w-8 h-8 object-cover rounded-full border border-gray-300"
          />
          <span className="text-gray-500 font-normal text-sm">Student</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
