import { useState, useEffect } from 'react';
import Lvlogo from '../assets/lvcc-logo.png';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from session storage
    const storedData = sessionStorage.getItem('user');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUser(parsedData.user); // Access the user object inside the stored data
    }
  }, []);

  const navigate = useNavigate();

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSignout = () => {
    sessionStorage.clear(); 
    navigate('/login'); 
  };

  const handleSettings = () => {
    navigate('/settings');
  }

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                aria-controls="logo-sidebar"
                aria-expanded={sidebarOpen ? 'true' : 'false'}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="" className="flex ms-2 md:me-24 items-center">
                <img src={Lvlogo} className="h-8 me-3" alt="Lvlogo" />
                <span className="text-xl font-semibold sm:text-2xl whitespace-nowrap">
                  Hello, {user ? user.name : ''}
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="relative ms-3">
                <button
                  onClick={toggleUserMenu}
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                  aria-expanded={userMenuOpen ? 'true' : 'false'}
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user? user.profile_picture : ''} // Replace with user.photo when available
                    alt="user photo"
                  />
                </button>
                {userMenuOpen && user && (
                  <div
                    className="z-50 absolute right-0 mt-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow"
                    id="dropdown-user"
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-900">{user.name}</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <a
                         onClick={handleSettings}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={handleSignout}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Sign out
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } bg-white border-r border-gray-200 sm:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 21"
                                >
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                                <span className="ms-3">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                            >
                                <svg
                                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 18 18"
                                >
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 16.169.831 17 1.857 17h4.286A1.857 1.857 0 0 0 8 15.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286C10 16.169 10.831 17 11.857 17h4.286A1.857 1.857 0 0 0 18 15.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="ms-3">Reports</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                            >
                                <svg
                                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 18 18"
                                >
                                    <path d="M9 0c-.867 0-1.73.143-2.558.427-.403.128-.759.327-1.078.584l-4.25 2.938A2 2 0 0 0 1 6.155v5.689c0 .73.395 1.402 1.031 1.758l4.25 2.938c.32.222.682.357 1.047.404A8.984 8.984 0 0 0 9 18c2.333 0 4.479-.875 6.122-2.32A8.984 8.984 0 0 0 17 9a8.985 8.985 0 0 0-.878-3.782l-4.25-2.938A1.997 1.997 0 0 0 10 2.844V7.5h2.5c.255 0 .5.124.65.334L15.9 9l-2.75 1.916c-.15.21-.395.334-.65.334H10V15a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3.25H5v3.25a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8.464l-2.5-1.73a1 1 0 0 1 0-1.738l2.5-1.73V2.5A1.999 1.999 0 0 1 3 0h6Z" />
                                </svg>
                                <span className="ms-3">Payments</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                            >
                                <svg
                                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6 2.5A1.5 1.5 0 0 1 7.5 1h5A1.5 1.5 0 0 1 14 2.5V4h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2V2.5zM5 6v8h10V6H5z"
                                    />
                                </svg>
                                <span className="ms-3">Transactions</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
