import React, { useEffect, useState } from "react";
import LoginPic from "../assets/Login.jpg";
import Logo from "../assets/Updated-logo.png";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullScreenLoader from "../components/FullScreenLoader";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
  
    if (token) {
      localStorage.setItem("authToken", token);
      setLoading(true);
<<<<<<< HEAD

      axios
        .get("https://capstone-production-bf29.up.railway.app/api/user", {
=======
  
      api.get("/user", {
>>>>>>> Jeibii
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
<<<<<<< HEAD
    window.location.href = "https://capstone-production-bf29.up.railway.app/api/auth/google";
=======
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
>>>>>>> Jeibii
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
    {loading && <FullScreenLoader />}
  
    {!loading && (
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative transition-all duration-300 hover:shadow-2xl">
        {/* Mobile Gradient Overlay */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#1F3463]/90 via-[#1F3463]/70 to-[#1F3463]/30 z-0 rounded-[2rem]" />
        
        {/* Image Section (Desktop only) */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
          <img 
            src={LoginPic} 
            alt="Login background" 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F3463]/90 to-[#1F3463]/30 flex items-end p-10">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-white mb-2">Welcome Back!</h2>
              <p className="text-white/90 text-lg max-w-md">Sign in to access your dashboard and continue your journey</p>
              <div className="w-16 h-1 bg-white/50 rounded-full mt-4"></div>
            </div>
          </div>
        </div>
  
        {/* Form Section */}
        <div className="w-full md:w-[480px] lg:w-[520px] xl:w-[560px] p-8 md:p-12 flex flex-col justify-center mx-auto min-h-[520px] md:min-h-[600px] lg:min-h-[700px] relative z-10 bg-white">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
                <img src={Logo} alt="LVCC Logo" className="w-24 h-24" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Welcome to TPES</h1>
            <p className="text-gray-500">Please sign in using LV account</p>
          </div>
  
          {/* Google Sign In Button */}
          <div className="space-y-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 py-3.5 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md bg-white hover:-translate-y-0.5 active:translate-y-0"
            >
              <FcGoogle className="w-6 h-6" />
              <span>Sign in with Google</span>
            </button>
          </div>
  
          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an LV account?{" "}
            <a href="#" className="font-medium text-[#1F3463] hover:text-[#1A2C56] underline underline-offset-4 decoration-[#1F3463]/30 hover:decoration-[#1F3463]/50 transition-colors">
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