import React, { useEffect } from 'react';
import LoginPic from '../assets/Login.jpg';
import Logo from '../assets/lvcc-logo.png';
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      alert(error);
      navigate("/login"); 
      return;
    }

    if (token) {
      console.log("Received Token:", token); 
      localStorage.setItem("authToken", token); 
      navigate("/SDashboard");
    }
  }, [location, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/auth/google";
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <section className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="grid lg:grid-cols-12">
        
          <section className="hidden lg:block lg:col-span-5 xl:col-span-6 relative">
            <img
              alt="Login background"
              src={LoginPic}
              className="h-full w-full object-cover"
            />
          </section>

         
          <main className="lg:col-span-7 xl:col-span-6 p-10">
            <div className="text-center">
             
              <div className="flex justify-center mb-4">
                <img src={Logo} alt="LVCC Logo" className="w-16 h-16" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Welcome to Sign In!
              </h1>
              <p className="mt-2 text-gray-600 text-sm">
                Please sign in using your La Verdad account.
              </p>
            </div>

        
            <form className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md text-sm transition duration-200"
                >
                  Sign In
                </button>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  id="marketing_accept"
                  name="marketing_accept"
                  className="h-5 w-5 rounded-md border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="marketing_accept">
                  I accept the data privacy agreement and agree to the processing of my personal data.
                </label>
              </div>

              <p className="text-xs text-gray-500 text-center">
                By signing in, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
              </p>

              <div className="flex items-center my-4">
                <hr className="w-full border-gray-300" />
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <hr className="w-full border-gray-300" />
              </div>

              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center bg-white border border-gray-400 py-3 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  <FcGoogle className="w-6 h-6 mr-2" />
                  <span>Sign in with Google</span>
                </button>
              </div>
            </form>
          </main>
        </div>
      </section>
    </div>
  );
}

export default Login;
