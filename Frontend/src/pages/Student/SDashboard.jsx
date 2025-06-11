import { FiCheckCircle, FiCalendar, FiInfo, FiUsers, FiChevronRight } from "react-icons/fi";
import bgImage from "../../assets/Login.jpg";
import { useEffect, useState } from "react";
import InstructorService from '../../services/InstructorService';

const SDashboard = () => {
  const [user, setUser] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const greeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning,";
    } else if (currentHour < 18) {
      return "Good Afternoon,";
    } else {
      return "Good Evening,";
    }
  };

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      if (parsedUser.program_id) {
        if (parsedUser.educationLevel === "Higher Education" && parsedUser.yearLevel) {
          const yearLevelMatch = parsedUser.yearLevel.match(/^(\d+)(?:st|nd|rd|th)?/);
          const yearLevelNumber = yearLevelMatch ? parseInt(yearLevelMatch[1]) : null;
          
          if (yearLevelNumber && yearLevelNumber >= 1 && yearLevelNumber <= 4) {
            InstructorService.getInstructorsByProgramAndYear(
              parseInt(parsedUser.program_id),
              yearLevelNumber
            )
              .then((data) => setInstructors(data))
              .catch((error) => {
                console.error("Failed to fetch instructors", error);
                setInstructors([]);
              })
              .finally(() => setLoading(false));
          } else {
            console.error("Invalid year level format");
            setInstructors([]);
            setLoading(false);
          }
        } else {
          InstructorService.getInstructorsByProgramName(parsedUser.program_name)
            .then((data) => setInstructors(data))
            .catch((error) => {
              console.error("Failed to fetch instructors", error);
              setInstructors([]);
            })
            .finally(() => setLoading(false));
        }
      }
    }
  }, []);

  useEffect(() => {
    const submissionInfoRaw = sessionStorage.getItem('submissionInfo');
    let completed = 0;
    let total = instructors.length;
    if (submissionInfoRaw) {
      const submissionInfo = JSON.parse(submissionInfoRaw);
      completed = Object.values(submissionInfo).filter(info => info.status === 'Evaluated').length;
    }
    setCompletedCount(completed);
    setTotalCount(total);
  }, [instructors]);

  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <main className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-all duration-300">
      {/* Hero Header */}
      <div className="relative mb-6 md:mb-8 rounded-2xl overflow-hidden shadow-lg bg-[#1F3463] p-6 sm:p-8 text-white">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#1F3463]/90 to-[#1F3463]/70 z-0"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'multiply'
          }}
        />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {greeting()} {user ? `${user.name.split(" ")[0]}${user.name.split(" ").length > 1 ? " " + user.name.split(" ")[1] : ""}!` : "Student"}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/90">
            {user ? (
              user.educationLevel === "Higher Education" 
                ? `${user.program_name} - ${user.yearLevel}`
                : user.program_name
            ) : ""}
          </p>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid gap-5 sm:gap-6 md:gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {/* Completed Evaluations Card */}
        <div className="group relative p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FiCheckCircle className="text-green-600 dark:text-green-400 text-xl sm:text-2xl" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Completed</h2>
              </div>
              <FiChevronRight className="text-gray-400 mt-1" />
            </div>
            <div className="mb-4">
              <p className="text-base text-gray-600 dark:text-gray-300 mb-2">
                You've completed <span className="font-bold text-green-600 dark:text-green-400">{completedCount}</span> out of <span className="font-bold">{totalCount}</span> evaluations
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Next Evaluations Card */}
        <div className="group relative p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <FiCalendar className="text-yellow-600 dark:text-yellow-400 text-xl sm:text-2xl" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Next Evaluations</h2>
              </div>
              <FiChevronRight className="text-gray-400 mt-1" />
            </div>
            <div className="flex items-center justify-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">⏳</div>
                <p className="text-base text-gray-600 dark:text-gray-300">
                  Evaluation schedule will be announced soon
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructors Card */}
        <div className="group relative p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <FiUsers className="text-purple-600 dark:text-purple-400 text-xl sm:text-2xl" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Instructors</h2>
              </div>
              <FiChevronRight className="text-gray-400 mt-1" />
            </div>
            <div className="flex items-center justify-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              {loading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-10 w-10 bg-purple-200 dark:bg-purple-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-purple-200 dark:bg-purple-700 rounded w-3/4"></div>
                    <div className="h-4 bg-purple-200 dark:bg-purple-700 rounded"></div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{instructors.length}</p>
                  <p className="text-base text-gray-600 dark:text-gray-300">
                    {instructors.length === 1 ? 'Instructor to evaluate' : 'Instructors to evaluate'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Announcements Card */}
        <div className="group relative p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-800 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-100 dark:bg-red-900 rounded-lg">
                  <FiInfo className="text-red-600 dark:text-red-400 text-xl sm:text-2xl" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Announcements</h2>
              </div>
              <FiChevronRight className="text-gray-400 mt-1" />
            </div>
            <div className="flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">📢</div>
                <p className="text-base text-gray-600 dark:text-gray-300">
                  Announcements feature coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SDashboard;