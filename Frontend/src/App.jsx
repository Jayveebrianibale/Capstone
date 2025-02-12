import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import SDashboard from './pages/Student/SDashboard';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import SEvaluations from './pages/Student/SEvaluations';


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="*" element={<MainLayout />}>
          <Route path="SDashboard" element={<SDashboard />} />
          <Route path="SEvaluations" element={<SEvaluations />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
