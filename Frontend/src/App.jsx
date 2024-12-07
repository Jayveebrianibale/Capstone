import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import SDashboard from './pages/Student/SDashboard';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import SEvaluations from './pages/Student/SEvaluations';
import SHistory from './pages/Student/SHistory';
import SAccount from './pages/Student/SAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<MainLayout />}>
          <Route path="SDashboard" element={<SDashboard />} />
          <Route path="SEvaluations" element={<SEvaluations />} />
          <Route path="SHistory" element={<SHistory />} />
          <Route path="SAccount" element={<SAccount />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
