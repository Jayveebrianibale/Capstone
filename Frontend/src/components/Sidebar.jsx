import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Updated-logo.png";
import { CiHome, CiCreditCard2, CiLogout } from "react-icons/ci";
import { PiStudent } from "react-icons/pi";
import { LiaChildSolid } from "react-icons/lia";
import { MdExpandMore, MdExpandLess, MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlineCastForEducation } from "react-icons/md";
import { VscPerson } from "react-icons/vsc";
import { TbMessageQuestion } from "react-icons/tb";
import { SlPeople } from "react-icons/sl";
import axios from "axios";

function Sidebar({ sidebarOpen, setSidebarOpen, activePage, setActivePage, role, isMobile, openLogoutModal }) {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);


  useEffect(() => {
    const savedActivePage = localStorage.getItem("activePage");
    if (savedActivePage) {
      setActivePage(savedActivePage);
    }
  }, [setActivePage]);

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
          { name: "BSA", fullName: "Bachelor of Science in Accountancy", path: "/BSA" },
          { name: "BSAIS", fullName: "Bachelor of Science in Accounting Information System", path: "/BSAIS" },
          { name: "BSSW", fullName: "Bachelor of Science in Social Work", path: "/BSSW" },
          { name: "BAB", fullName: "Bachelor of Arts in Broadcasting", path: "/BAB" },
          { name: "BSIS", fullName: "Bachelor of Science in Information Systems", path: "/BSIS" },
          { name: "ACT", fullName: "Associate in Computer Technology", path: "/ACT" },
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
      { name: "Instructors", icon: SlPeople, path: "/Instructors" },
      { name: "Programs/Levels", icon: MdOutlineCastForEducation, path: "/Programs" },
    ],
    Instructor: [{ name: "Dashboard", icon: CiHome, path: "/InstructorDashboard" }],
  };

  const menuItems = menus[role] || [];

  const closeSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const handleDropdownToggle = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleNavigation = (path, name, fullName = null) => {
    setActivePage(fullName || name);
    localStorage.setItem("activePage", fullName || name);
    navigate(path);
    closeSidebar();
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
  
      if (token) {
        await axios.post("http://localhost:8000/api/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("activePage");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <div
      className={`fixed inset-0 z-40 transition-transform transform w-56 bg-[#1F3463] dark:bg-gray-800 border-r border-gray-700 overflow-y-auto h-screen ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <nav className="flex flex-col h-full p-4 space-y-2 text-white dark:text-gray-200">
        <div className="flex items-center justify-center pb-6 pt-5 gap-2">
          <img className="h-20 w-20" src={Logo} alt="Updated logo" />
        </div>
        <div className="flex flex-col gap-2 flex-grow overflow-y-auto max-h-[80vh]">
          {menuItems.map((item) => (
            <div key={item.name}>
              {!item.submenu ? (
                <button
                  className={`flex w-full items-center gap-2 text-sm p-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    activePage === item.name ? "bg-indigo-700 dark:bg-gray-800" : ""
                  }`}
                  onClick={() => handleNavigation(item.path, item.name)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ) : (
                <div>
                  <button
                    className="flex w-full items-center gap-2 text-sm p-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => handleDropdownToggle(item.name)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {openDropdown === item.name ? <MdExpandLess className="ml-auto" /> : <MdExpandMore className="ml-auto" />}
                  </button>
                  {openDropdown === item.name && (
                    <div className="ml-6 max-h-[300px] overflow-y-auto">
                      {item.submenu.map((sub) => (
                        <button
                          key={sub.name}
                          className={`flex w-full items-center gap-2 text-sm p-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-gray-700 transition-colors duration-200 ${
                            activePage === sub.fullName ? "bg-indigo-600 dark:bg-gray-800" : ""
                          }`}
                          onClick={() => handleNavigation(sub.path, sub.name, sub.fullName)}
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
       <button
        className="flex w-full items-center gap-2 p-2 rounded-lg text-sm hover:bg-red-600 transition-colors duration-200"
        onClick={openLogoutModal}
      >
        <CiLogout className="w-6 h-6" />
        <span>Logout</span>
      </button>
      </nav>

    </div>
  );
}

export default Sidebar;
