import React, { useEffect, useState } from "react";
import LoginPic from "../assets/Login.jpg";
import Logo from "../assets/Updated-logo.png";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullScreenLoader from "../components/FullScreenLoader";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
          const { role, ...user } = response.data;
          localStorage.setItem("role", role);
          localStorage.setItem("user", JSON.stringify(user));
          if (user.programCode) {
            localStorage.setItem("programCode", user.programCode);
          }
          if (user.id) {
            localStorage.setItem("instructorId", user.id);
          }
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

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = "http://127.0.0.1:8000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      {loading && <FullScreenLoader />}

      {!loading && (
        <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 relative">
          {/* Mobile Gradient Overlay */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#1F3463]/90 to-[#1F3463]/30 z-0" />
          
          {/* Image Section (Desktop only) */}
          <div className="hidden md:block md:w-1/2 relative">
            <img 
              src={LoginPic} 
              alt="Login background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F3463]/90 to-[#1F3463]/30 flex items-end p-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                <p className="text-white/90">Sign in to access your dashboard and continue your journey</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-[480px] lg:w-[520px] xl:w-[560px] p-8 md:p-12 flex flex-col justify-center mx-auto min-h-[520px] md:min-h-[600px] lg:min-h-[700px] relative z-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img src={Logo} alt="LVCC Logo" className="w-16 h-16" />
              </div>
              <h1 className="text-3xl font-bold text-white md:text-gray-800 mb-2">Welcome to LVCC</h1>
              <p className="text-white/80 md:text-gray-500">Please sign in using LV account</p>
            </div>

            {/* Google Sign In Button */}
            <div className="space-y-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md bg-white"
              >
                <FcGoogle className="w-6 h-6" />
                <span>Sign in with Google</span>
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-white/80 md:text-gray-500">
              Don't have an LV account?{" "}
              <a href="#" className="font-medium text-white md:text-[#1F3463] hover:text-white md:hover:text-[#1A2C56]">
                Please contact Admins
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;