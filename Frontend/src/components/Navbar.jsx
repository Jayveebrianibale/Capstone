import React from 'react';
import { FaBars } from 'react-icons/fa';
import ProfileIcon from "../assets/profile-icon.jpg";
import { MdOutlineDarkMode } from "react-icons/md";

function Navbar({ toggleSidebar, title }) {
  return (
    <div className="bg-white h-16 border-b flex items-center justify-between px-4">
      <div className="flex items-center">
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars className="h-4 w-4" />
        </button>
        <h1 className="text-2xl font-medium text-center sm:text-left ml-4 md:ml-0 hidden sm:block">{title}</h1>
      </div>
      <div className="flex items-center gap-2 mr-2">
        <MdOutlineDarkMode className="h-5 w-5 sm:h-6 sm:w-6" />
        <div className="flex items-center gap-2">
          <img
            src={ProfileIcon}
            alt="Profile"
            className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded-full border border-gray-300"
          />
          <span className="text-gray-500 font-normal text-sm hidden sm:block">Student</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
