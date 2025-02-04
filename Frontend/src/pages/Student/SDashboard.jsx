import React from 'react';
import Content from '../../components/Content';
import Stats from '../../components/Stats';
import Upcoming from '../../components/Upcoming';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/SDashboard"); // Redirect to dashboard
    }
  }, []);
  
  return (
    <main className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <Content />
      <Stats />
      <Upcoming />
    </main>
  );
}

export default SDashboard;
