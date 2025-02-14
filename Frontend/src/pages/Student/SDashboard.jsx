import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      console.log("No token found, redirecting to login...");
      navigate("/login");
      return;
    }
  
    axios.get("http://127.0.0.1:8000/api/user", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log("User authenticated:", response.data);
      setUser(response.data);
    })
    .catch(error => {
      console.error("Authentication failed:", error);
      alert("Invalid token, please log in again.");
      localStorage.removeItem("authToken");
      navigate("/login");
    });

  }, [navigate]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);
  
  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <h1>Welcome to Dashboard</h1>
      {user && <p>Hello, {user.name}!</p>}
    </main>
  );
}

export default SDashboard;
