import React, { useEffect, useState } from 'react';
import Content from '../../components/Content';
import Stats from '../../components/Stats';
import Upcoming from '../../components/Upcoming';
import { useNavigate } from "react-router-dom";

function SDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate("/login"); // Redirect to login if no token
    }
  }, []);

  if (!isAuthenticated) {
    return null; // Prevent rendering until auth state is determined
  }

  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <Content />
      <Stats />
      <Upcoming />
    </main>
  );
}

export default SDashboard;
