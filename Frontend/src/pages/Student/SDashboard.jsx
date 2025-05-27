import { FiCheckCircle, FiCalendar, FiInfo, FiUsers } from "react-icons/fi";
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

      if (parsedUser.program_id && parsedUser.yearLevel) {
        InstructorService.getInstructorsByProgramAndYear(
          parseInt(parsedUser.program_id),
          parseInt(parsedUser.yearLevel)
        )
          .then((data) => setInstructors(data))
          .catch((error) => {
            console.error("Failed to fetch instructors", error);
            setInstructors([]);
          })
          .finally(() => setLoading(false));
      }
    }
  }, []);

  useEffect(() => {
    // Track completed evaluations from sessionStorage.submissionInfo
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

  return (
    <main className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-all duration-300">
      <div
        className="relative mb-5 rounded-2xl overflow-hidden shadow-md bg-[#1F3463] p-6 sm:p-8 text-white"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30 z-0" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight break-words leading-tight drop-shadow-sm">
            {greeting()} {user ? `${user.name.split(" ")[0]}${user.name.split(" ").length > 1 ? " " + user.name.split(" ")[1] : ""}!` : "Student"}
          </h1>
          <span>{user ? `${user.program_name} - ${user.yearLevel}` : ""}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {/* Completed Evaluations */}
        <div className="p-4 sm:p-5 md:p-6 bg-white/80 dark:bg-white/5 backdrop-blur-lg rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-800 rounded-full">
              <FiCheckCircle className="text-green-600 text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white">Completed</h2>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-center text-gray-600 dark:text-gray-400 mb-3">
            You’ve completed <strong>
              {completedCount} out of {totalCount}
            </strong> evaluations.
          </p>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{
                width: `${
                  totalCount === 0
                    ? 0
                    : (completedCount / totalCount) * 100
                }%`
              }}
            ></div> 
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 bg-white/80 dark:bg-white/5 backdrop-blur-lg rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-800 rounded-full">
              <FiCalendar className="text-yellow-600 text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white">Next Evaluations</h2>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-center text-gray-600 dark:text-gray-400">
            <h1>⏳ Evaluation schedule will be announced soon.</h1>
          </p>
        </div>

        {/* Instructors */}
        <div className="p-4 sm:p-5 md:p-6 bg-white/80 dark:bg-white/5 backdrop-blur-lg rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-full">
              <FiUsers className="text-purple-600 text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white">Instructors</h2>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-center text-gray-600 dark:text-gray-400">
            {loading ? "Loading..." : `You’re evaluating ${instructors.length} instructor(s) this semester.`}
          </p>
        </div>

        {/* Announcements */}
        <div className="p-4 sm:p-5 md:p-6 bg-white/80 dark:bg-white/5 backdrop-blur-lg rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-800 rounded-full">
              <FiInfo className="text-red-600 text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white truncate">Announcements</h2>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-center text-gray-600 dark:text-gray-400">
             <h1>📢 Announcements feature coming soon.</h1>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SDashboard;

