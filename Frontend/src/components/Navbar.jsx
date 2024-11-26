import Logo from '../assets/lvcc-logo.png';
import ProfileIcon from '../assets/profile-icon.jpg';
import React from 'react';
import { CiSearch } from "react-icons/ci";
import { FaBell } from "react-icons/fa";

function Navbar() {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-2">
            <img className='w-12 mt-1' src={Logo} alt="LVCC Logo" />
            <h1 className='text-2xl mt-3 '>TPES</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center border rounded-md px-3 py-1">
              <input
                type="text"
                placeholder="Search..."
                className="border-none focus:outline-none"
              />
              <CiSearch className="ml-2 text-gray-600" />
            </div>

            {/* Notification Icon */}
            <div className="relative">
              <button className="text-gray-600 hover:text-gray-800">
                <FaBell className="h-6 w-6" />
              </button>
              {/* Optional: Notification badge */}
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600"></span>
            </div>

            {/* Profile Photo and Student Label */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
              >
                <img
                  src={ProfileIcon}
                  alt="Profile"
                  className="w-10 h-10 object-cover"
                />
              </button>
              <span className="text-sm font-medium">Student</span>
            </div>

            {/* Mobile Menu Button */}
            <div className="block md:hidden">
              <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
