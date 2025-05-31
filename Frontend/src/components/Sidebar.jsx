import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const savedActivePage = localStorage.getItem("activePage");
    if (savedActivePage) {
      setActivePage(savedActivePage);
    } else if (role === "Instructor" && location.pathname === "/InstructorDashboard") {
      setActivePage("Evaluation Results");
      localStorage.setItem("activePage", "Evaluation Results");
    }
  }, [setActivePage, role, location.pathname]);

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
        name: "Basic Education",
        icon: LiaChildSolid,
        submenu: [
          { name: "Intermediate", path: "/Intermediate" },
          { name: "Junior High", path: "/JuniorHigh" },
          { name: "Senior High", path: "/SeniorHigh" },
        ],
      },
      { name: "Questionnaires", icon: TbMessageQuestion, path: "/Questions" },
      { name: "Programs/Levels", icon: MdOutlineCastForEducation, path: "/Programs" },
      { name: "Instructors", icon: SlPeople, path: "/Instructors" },
      
    ],
    Instructor: [{ name: "Evaluation Results", icon: CiHome, path: "/InstructorDashboard" }],
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

  return (
    <div
      className={`fixed inset-0 z-40 transition-transform transform w-64 bg-[#1F3463] dark:bg-gray-800 border-r border-gray-700 overflow-y-auto h-screen ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <nav className="flex flex-col h-full p-5 space-y-3 text-white dark:text-gray-200">
        <div className="flex items-center justify-center pb-6 pt-5 gap-2">
          <img className="h-24 w-24" src={Logo} alt="Updated logo" />
        </div>
        <div className="flex flex-col gap-3 flex-grow overflow-y-auto max-h-[80vh]">
          {menuItems.map((item) => (
            <div key={item.name}>
              {!item.submenu ? (
                <button
                  className={`flex w-full items-center gap-3 text-sm p-3 rounded-lg hover:bg-[#2a4585] dark:hover:bg-[#2a4585] transition-colors duration-200 ${
                    activePage === item.name ? "bg-[#2a4585] dark:bg-[#2a4585]" : ""
                  }`}
                  onClick={() => handleNavigation(item.path, item.name)}
                >
                  <item.icon className="w-5 h-5 min-w-[1.25rem]" />
                  <span className="truncate">{item.name}</span>
                </button>
              ) : (
                <div>
                  <button
                    className="flex w-full items-center gap-3 text-sm p-3 rounded-lg hover:bg-[#2a4585] dark:hover:bg-[#2a4585] transition-colors duration-200"
                    onClick={() => handleDropdownToggle(item.name)}
                  >
                    <item.icon className="w-5 h-5 min-w-[1.25rem]" />
                    <span className="truncate">{item.name}</span>
                    {openDropdown === item.name ? <MdExpandLess className="ml-auto" /> : <MdExpandMore className="ml-auto" />}
                  </button>
                  {openDropdown === item.name && (
                    <div className="ml-8 pl-2">
                      {item.submenu.map((sub) => (
                        <button
                          key={sub.name}
                          className={`flex w-full items-center gap-3 text-sm p-2 rounded-lg hover:bg-[#2a4585] dark:hover:bg-[#2a4585] transition-colors duration-200 ${
                            (activePage === sub.fullName || activePage === sub.name) ? "bg-[#2a4585] dark:bg-[#2a4585]" : ""
                          }`}
                          onClick={() => handleNavigation(sub.path, sub.name, sub.fullName)}
                        >
                          <span className="truncate">{sub.name}</span>
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
          className="flex w-full items-center gap-3 p-3 rounded-lg text-sm hover:bg-[#2a4585] transition-colors duration-200"
          onClick={openLogoutModal}
        >
          <CiLogout className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;