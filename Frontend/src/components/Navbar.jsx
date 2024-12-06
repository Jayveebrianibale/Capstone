import React from 'react';
import { FaBars } from 'react-icons/fa';
import { IoMdNotificationsOutline } from "react-icons/io";
import ProfileIcon from "../assets/profile-icon.jpg";
import { MdOutlineDarkMode } from "react-icons/md";

function Navbar({ toggleSidebar }) {
  return (
    <div className="bg-white h-16 border-b flex items-center justify-between px-4">
      <button
        className="md:hidden text-gray-800 focus:outline-none"
        onClick={toggleSidebar}
      >
        <FaBars className="h-4 w-4" />
      </button>
      <h1 className="text-2xl font-medium text-center sm:text-left">Dashboard</h1>
      <div className="flex items-center gap-3 mr-5">
        <MdOutlineDarkMode className="h-6 w-6 " />
        <IoMdNotificationsOutline className="h-6 w-6" />
        <div className="flex items-center gap-2">
          <img
            src={ProfileIcon}
            alt="Profile"
            className="w-6 h-6 object-cover rounded-full border border-gray-300"
          />
          <span className="text-gray-500 font-normal text-sm">Student</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
