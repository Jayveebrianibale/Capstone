import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from './Layout/MainLayout';
import SDashboard from './pages/Student/SDashboard';
import Login from './Auth/Login';
import SEvaluations from './pages/Student/SEvaluations';
import ADashboard from './pages/Admin/ADashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<StudentLayout />}>
          <Route path="SDashboard" element={<SDashboard />} />
          <Route path="SEvaluations" element={<SEvaluations />} />
        </Route>
        <Route path="/ADashboard" element={<ADashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
