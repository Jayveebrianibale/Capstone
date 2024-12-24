import React from 'react';
import Logo from "../assets/lvcc-logo.png";
import { CiHome, CiCreditCard2, CiUser, CiLogout } from "react-icons/ci";
import { VscHistory } from "react-icons/vsc";

function Sidebar({ sidebarOpen, toggleSidebar, activePage, setActivePage }) {
  const menuItems = [
    { name: 'Dashboard', icon: CiHome, path: '/SDashboard' },
    { name: 'Evaluations', icon: CiCreditCard2, path: '/SEvaluations' },
    { name: 'History', icon: VscHistory, path: '/SHistory' },
    { name: 'My Account', icon: CiUser, path: '/SAccount' },
  ];

  const closeSidebar = () => {
    if (sidebarOpen && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-transform transform w-56 bg-white border-r ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <nav className="flex flex-col h-full p-4 space-y-2">
        <div className="flex items-center justify-center pb-6 pt-5 gap-2">
          <img className="h-16 w-16" src={Logo} alt="LVCC Logo" />
        </div>

        <div className="flex flex-col gap-2 flex-grow">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`list-none flex text-sm items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors duration-200 ${
                activePage === item.name ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'
              }`}
              onClick={() => {
                setActivePage(item.path);
                closeSidebar();
              }}
            >
              <item.icon className="w-5 h-5" />
              <a>{item.name}</a>
            </li>
          ))}
        </div>

        <div className="flex">
          <li className="list-none flex items-center gap-2 cursor-pointer p-2 rounded-lg text-sm text-gray-700">
            <CiLogout className="w-6 h-6" />
            <a>Logout</a>
          </li>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
