import Logo from "../assets/lvcc-logo.png";
import React from 'react';
import { CiHome, CiCreditCard2, CiUser, CiLogout } from "react-icons/ci";
import { VscHistory } from "react-icons/vsc";

function Sidebar({ sidebarOpen, toggleSidebar }) {
  return (
    <div
      className={`fixed inset-0 z-40 transition-transform transform border-x w-56 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:static md:translate-x-0`}
    >
      <nav className="flex flex-col h-full p-4 space-y-2">
        <div className="flex items-center justify-center mb-10 gap-2">
          <img className="h-14 w-14" src={Logo} alt="LVCC Logo" />
        </div>

        <div className="flex flex-col gap-4 flex-grow">
          <li className="list-none flex items-center gap-2">
            <CiHome className="w-6 h-6" />  
            <a href="" className="mt-1">Dashboard</a>
          </li>

          <li className="list-none flex items-center gap-2">
            <CiCreditCard2 className="w-6 h-6" />  
            <a href="" className="mt-1">Evaluations</a>
          </li>

          <li className="list-none flex items-center gap-2">
            <VscHistory className="w-6 h-6" />  
            <a href="" className="mt-1">History</a>
          </li>

          <li className="list-none flex items-center gap-2">
            <CiUser className="w-6 h-6" />  
            <a href="" className="mt-1">My Account</a>
          </li>
        </div>

        <div className="flex">
          <li className="list-none flex items-center gap-2">
            <CiLogout className="w-6 h-6" />  
            <a href="" className="mt-1">Logout</a>
          </li>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
