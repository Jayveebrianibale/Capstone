import Logo from "../assets/lvcc-logo.png"
import React from 'react';
import { CiHome } from "react-icons/ci";

function Sidebar({ sidebarOpen, toggleSidebar }) {
  return (
    <div
      className={`fixed inset-0 z-40 transition-transform transform bg-white border-x w-56 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:static md:translate-x-0`}
    >
      <nav className="flex flex-col p-4 space-y-2">
        <div className="flex items-center mb-10 gap-2">
          <img className="h-11 w-11" src={Logo} alt="" />
          <h2 className="mb-2 font-bold mt-2 text-2xl">TPES</h2>
        </div>

        <div className="flex">
            <li className="list-none flex items-center gap-2">
              <CiHome className="w-6 h-6" />  
              <a href="" className="mt-1 font">Dashboard</a>
            </li>
        </div>
       
      </nav>
    </div>
  );
}

export default Sidebar;
