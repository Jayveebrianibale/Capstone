import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Updated-logo.png";
import { CiHome, CiCreditCard2, CiLogout } from "react-icons/ci";
import { PiStudent } from "react-icons/pi";
import { LiaChildSolid } from "react-icons/lia";
import { MdExpandMore, MdExpandLess, MdOutlineManageAccounts } from "react-icons/md";
import { VscPerson } from "react-icons/vsc";
import { TbMessageQuestion } from "react-icons/tb";

function Sidebar({ sidebarOpen, setSidebarOpen, activePage, setActivePage, role, isMobile }) {
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const menus = {
    Student: [
      { name: "Dashboard", icon: CiHome, path: "/SDashboard" },
      { name: "Evaluations", icon: CiCreditCard2, path: "/SEvaluations" },
    ],
    Admin: [
      { name: "Dashboard", icon: CiHome, path: "/AdminDashboard" },
      {
        name: "Higher Education",
        icon: PiStudent,
        submenu: [
          { name: "BSA", path: "/BSA" },
          { name: "BSAIS", path: "/BSAIS" },
          { name: "BSSW", path: "/BSSW" },
          { name: "BAB", path: "/BAB" },
          { name: "BSIS", path: "/BSIS" },
          { name: "ACT", path: "/ACT" },
        ],
      },
      {
        name: "Intermediate",
        icon: LiaChildSolid,
        submenu: [
          { name: "Grade 4", path: "/Grade4" },
          { name: "Grade 5", path: "/Grade5" },
          { name: "Grade 6", path: "/Grade6" },
        ],
      },
      {
        name: "Junior Highschool",
        icon: VscPerson,
        submenu: [
          { name: "Grade 7", path: "/Grade7" },
          { name: "Grade 8", path: "/Grade8" },
          { name: "Grade 9", path: "/Grade9" },
          { name: "Grade 10", path: "/Grade10" },
        ],
      },
      {
        name: "Senior Highschool",
        icon: VscPerson,
        submenu: [
          { name: "Grade 11", path: "/Grade11" },
          { name: "Grade 12", path: "/Grade12" },
        ],
      },
      { name: "Accounts", icon: MdOutlineManageAccounts, path: "/Accounts" },
      { name: "Questionnaires", icon: TbMessageQuestion, path: "/Questions" },
    ],
    Instructor: [{ name: "Dashboard", icon: CiHome, path: "/InstructorDashboard" }],
  };

  const menuItems = menus[role] || [];

  const closeSidebar = () => {
    if (sidebarOpen && isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleDropdownToggle = (name) => {
    setOpenDropdowns((prev) => ({
      [name]: !prev[name] ? true : false,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-transform transform w-56 bg-[#1F3463] dark:bg-gray-800 border-r border-gray-700 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <nav className="flex flex-col h-full p-4 space-y-2 text-white dark:text-gray-200">
      
        <div className="flex items-center justify-center pb-6 pt-5 gap-2">
          <img className="h-20 w-20" src={Logo} alt="Updated logo" />
        </div>

        <div className="flex flex-col gap-2 flex-grow">
          {menuItems.map((item) => (
            <div key={item.name}>
              {!item.submenu ? (
                <button
                  className={`flex w-full items-center gap-2 text-sm p-2 rounded-lg hover:bg-indigo-500 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    activePage === item.name ? "bg-indigo-600 dark:bg-gray-800" : ""
                  }`}
                  onClick={() => {
                    setActivePage(item.name);
                    navigate(item.path);
                    closeSidebar();
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ) : (
                <div>
                  {/* Dropdown Button */}
                  <button
                    className="flex w-full items-center gap-2 text-sm p-2 rounded-lg hover:bg-indigo-500 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => handleDropdownToggle(item.name)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {openDropdowns[item.name] ? <MdExpandLess className="ml-auto" /> : <MdExpandMore className="ml-auto" />}
                  </button>
                  {/* Dropdown Menu */}
                  {openDropdowns[item.name] && (
                    <div className="ml-6 max-h-[300px] overflow-y-auto">
                      {item.submenu.map((sub) => (
                        <button
                          key={sub.name}
                          className={`flex w-full items-center gap-2 text-sm p-2 rounded-lg hover:bg-indigo-500 dark:hover:bg-gray-700 transition-colors duration-200 ${
                            activePage === sub.name ? "bg-indigo-600 dark:bg-gray-800" : ""
                          }`}
                          onClick={() => {
                            setActivePage(sub.name);
                            navigate(sub.path);
                            closeSidebar();
                          }}
                        >
                          <span>{sub.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="flex">
          <button
            className="flex w-full items-center gap-2 p-2 rounded-lg text-sm hover:bg-red-600 dark:hover:bg-red-700 transition-colors duration-200"
            onClick={handleLogout}
          >
            <CiLogout className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
