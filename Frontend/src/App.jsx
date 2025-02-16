import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import SDashboard from './pages/Student/SDashboard';
import Login from './Auth/Login';
import SEvaluations from './pages/Student/SEvaluations';
import AdminDashboard from './pages/Admin/ADashboard';
import InstructorDashboard from './pages/Instructor/InstrucDashboard';


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} /> */}
        
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="*" element={<MainLayout />}>
          <Route path="SDashboard" element={<SDashboard />} />
          <Route path="SEvaluations" element={<SEvaluations />} />

          <Route path="AdminDashboard" element={<AdminDashboard />} />
          <Route path="InstructorDashboard" element={<InstructorDashboard />} />
        </Route>
      
      </Routes>
    </Router>
  );
}

export default App;
