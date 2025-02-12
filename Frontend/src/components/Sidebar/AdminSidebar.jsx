import React from 'react';
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/lvcc-logo.png";
import { CiHome, CiCreditCard2, CiLogout } from "react-icons/ci";


function AdminSidebar({ sidebarOpen, toggleSidebar, activePage, setActivePage }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: CiHome, path: '/SDashboard' },
    { name: 'Evaluations', icon: CiCreditCard2, path: '/SEvaluations' },
  ];

  const closeSidebar = () => {
    if (sidebarOpen && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    navigate("/login");
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-transform transform w-56 bg-white dark:bg-gray-900 border-r dark:border-gray-700 ${
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
                activePage === item.name ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800'
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
          <li 
            className="list-none flex items-center gap-2 p-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={handleLogout}
          >
            <CiLogout className="w-6 h-6" />
            <a>Logout</a>
          </li>
        </div>
      </nav>
    </div>
  );
}

export default AdminSidebar;
