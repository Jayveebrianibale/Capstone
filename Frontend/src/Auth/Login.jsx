import React, { useEffect, useState } from "react";
import LoginPic from "../assets/Login.jpg";
import Logo from "../assets/Updated-logo.png";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullScreenLoader from "../components/FullScreenLoader";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      setLoading(true);

      axios
        .get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const { role } = response.data;
          localStorage.setItem("role", role);

          const dashboardRoutes = {
            Student: "/SDashboard",
            Instructor: "/InstructorDashboard",
            Admin: "/AdminDashboard",
          };

          navigate(dashboardRoutes[role] || "/", { replace: true });
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          navigate("/login");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("authToken", token);

      const userResponse = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { role } = userResponse.data;
      localStorage.setItem("role", role);

      const dashboardRoutes = {
        Student: "/SDashboard",
        Instructor: "/InstructorDashboard",
        Admin: "/AdminDashboard",
      };

      navigate(dashboardRoutes[role] || "/");
    } catch (error) {
      setErrorMessage("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = "http://127.0.0.1:8000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      {loading && <FullScreenLoader />}

      {!loading && (
        <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="hidden md:block md:w-1/2 relative">
            <img 
              src={LoginPic} 
              alt="Login background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-end p-5">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img src={Logo} alt="LVCC Logo" className="w-16 h-16" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to LVCC</h1>
              <p className="text-gray-500">Please sign in to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1F3463] focus:border-[#1F3463]"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1F3463] focus:border-[#1F3463]"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#1F3463] focus:ring-[#1F3463] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-[#1F3463]">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-[#1F3463] hover:text-[#1A2C56]">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
                  isHovered ? "shadow-lg" : "shadow-md"
                } bg-[#1F3463] hover:bg-[#1A2C56]`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Sign In
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                <FcGoogle className="w-5 h-5" />
                <span>Sign in with Google</span>
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-[#1F3463] hover:text-[#1A2C56]">
                Sign up
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;