import React, { useEffect, useState } from "react";
import LoginPic from "../assets/Login.jpg";
import Logo from "../assets/lvcc-logo.png";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullScreenLoader from "../components/FullScreenLoader";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
          const { role } = response.data;
          localStorage.setItem("role", role);

          const dashboardRoutes = {
            Student: "/SDashboard",
            Instructor: "/InstructorDashboard",
            Admin: "/AdminDashboard",
          };

          navigate(dashboardRoutes[role] || "/");
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          navigate("/login");
        })
        .finally(() => {
          setLoading(false);
          window.history.replaceState({}, document.title, "/");
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
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      {loading && <FullScreenLoader />}

      {!loading && (
        <section className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl w-full">
          <div className="grid lg:grid-cols-12">
            <section className="hidden lg:block lg:col-span-5 xl:col-span-6 relative">
              <img alt="Login background" src={LoginPic} className="h-full w-full object-cover" />
            </section>

            <main className="lg:col-span-7 xl:col-span-6 p-10">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <img src={Logo} alt="LVCC Logo" className="w-16 h-16" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome to Sign In!</h1>
                <p className="mt-2 text-gray-600 text-sm">Please sign in using your La Verdad Email.</p>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md text-sm">
                  Sign In
                </button>

                <div className="flex items-center my-4">
                  <hr className="w-full border-gray-300" />
                  <span className="px-3 text-gray-500 text-sm">OR</span>
                  <hr className="w-full border-gray-300" />
                </div>

                <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center bg-white border border-gray-400 py-3 rounded-md text-sm">
                  <FcGoogle className="w-6 h-6 mr-2" />
                  <span>Sign in with Google</span>
                </button>
              </form>
            </main>
          </div>
        </section>
      )}
    </div>
  );
}

export default Login;
