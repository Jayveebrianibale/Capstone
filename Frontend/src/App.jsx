// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SDashboard from './pages/Student/SDashboard';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import VerificationCode from './Auth/Verification';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verification" element={<VerificationCode />} />
        <Route path="/SDashboard" element={<SDashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
