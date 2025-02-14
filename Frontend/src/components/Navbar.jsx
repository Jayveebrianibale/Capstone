function Navbar({ toggleSidebar, title, darkMode, handleDarkModeToggle }) {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center">
        <button
          className="md:hidden text-gray-800 dark:text-gray-200 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-medium ml-4 md:ml-0 hidden sm:block dark:text-gray-200">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <DarkModeToggle darkMode={darkMode} handleDarkModeToggle={handleDarkModeToggle} />
        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          {user && (
            <button className="flex items-center gap-2 focus:outline-none">
              <img
                src={user.profile_picture || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
              />
              <span className="hidden sm:block text-gray-700 dark:text-gray-200 font-normal text-sm">
                {user.role === "student" ? "Student" : user.role === "admin" ? "Admin" : "Instructor"}
              </span>
            </button>
          )}

          {showDropdown && user && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow-sm z-50">
              <div className="px-4 py-3">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;