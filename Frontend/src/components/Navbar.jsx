import React, { useState, useEffect } from "react";
import { FaBars, FaBell } from "react-icons/fa";
import DarkModeToggle from "../components/DarkmodeToggle";
import EvaluationService from "../services/EvaluationService";

const baseURL = import.meta.env.VITE_API_URL.replace('/api', '');

function Navbar({ toggleSidebar, title, darkMode, handleDarkModeToggle, user, activePage }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [submissionStats, setSubmissionStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const abbreviationMap = {
    "Bachelor of Science in Accountancy": "BSA",
    "Bachelor of Science in Accounting Information System": "BSAIS",
    "Bachelor of Science in Social Work": "BSSW",
    "Bachelor of Arts in Broadcasting": "BAB",
    "Bachelor of Science in Information Systems": "BSIS",
    "Associate in Computer Technology": "ACT",
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("User object:", user);
    console.log("User role:", user?.role);
  }, [user]);

  // Fetch submission stats and create notifications
  useEffect(() => {
    const fetchSubmissionStats = async () => {
      if (user?.role?.toLowerCase() === "admin") {
        try {
          setLoading(true);
          const stats = await EvaluationService.getProgramEvaluationStats();
          console.log("Fetched submission stats:", stats);
          setSubmissionStats(stats);
          
          // Create notifications from stats
          const newNotifications = stats
            .filter(stat => stat.not_submitted > 0)
            .map(stat => ({
              id: `${stat.program_code}-${stat.yearLevel}`,
              program: stat.program,
              yearLevel: stat.yearLevel,
              notSubmitted: stat.not_submitted,
              timestamp: new Date().toISOString(),
              read: false
            }));

          setNotifications(prev => {
            // Keep existing notifications and add new ones
            const existingIds = new Set(prev.map(n => n.id));
            const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.id));
            return [...prev, ...uniqueNewNotifications];
          });

          // Update unread count
          setUnreadCount(prev => prev + newNotifications.length);
        } catch (error) {
          console.error("Error fetching submission stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSubmissionStats();
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchSubmissionStats, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const displayTitle = windowWidth < 768 ? abbreviationMap[title] || title : title;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center">
        <button
          className="md:hidden text-gray-800 dark:text-gray-200 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars className="h-4 w-4" />
        </button>
        <h1 className="sm:text-lg md:text-xl lg:text-[130%] font-medium text-center sm:text-left ml-4 md:ml-0 dark:text-gray-200">
          {displayTitle}
        </h1>
      </div>

      <div className="flex items-center mr-2">
        {/* Notification icon for admins with dropdown */}
        {user && (user.role.toLowerCase() === "admin") && (
          <div className="relative">
            <button
              className="relative mt-2 mr-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              aria-label="Notifications"
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            >
              <FaBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  {loading ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg transition-colors ${
                            notification.read
                              ? 'bg-gray-50 dark:bg-gray-700'
                              : 'bg-blue-50 dark:bg-blue-900/20'
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {notification.program}
                            </span>
                            {!notification.yearLevel?.includes('Section') && (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {notification.yearLevel}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex justify-between text-sm">
                            <span className="text-red-600 dark:text-red-400">
                              {notification.notSubmitted} students haven't submitted
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-2 mr-2">
          <DarkModeToggle darkMode={darkMode} handleDarkModeToggle={handleDarkModeToggle} />
        </div>

        {/* User profile button with gap between image and text */}
        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          {user && (
            <button className="flex items-center gap-2 focus:outline-none">
              {user.profile_picture && (
                <img
                  src={`${baseURL}${user.profile_picture}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
                />
              )}
              <span className="hidden sm:block text-gray-700 dark:text-gray-200 font-normal text-sm">
                {user.role}
              </span>
            </button>
          )}

          {showDropdown && user && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow-sm z-50">
              <div className="px-4 py-3">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {user.email}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
