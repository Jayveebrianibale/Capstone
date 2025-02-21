import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import SDashboard from './pages/Student/SDashboard';
import Login from './Auth/Login';
import SEvaluations from './pages/Student/SEvaluations';
import AdminDashboard from './pages/Admin/ADashboard';
import InstructorDashboard from './pages/Instructor/InstrucDashboard';
import Bsa from './pages/Admin/courses/Bsa';
import Bsais from './pages/Admin/courses/Bsais';
import Bssw from './pages/Admin/courses/Bssw';
import Bab from './pages/Admin/courses/Bab';
import Bsis from './pages/Admin/courses/Bsis';
import Act from './pages/Admin/courses/Act';
import Questionnaires from './pages/Admin/Questionnaires';

function App() {
  return (
    <Router>
      <div className="overflow-x-hidden">
        <Routes>
          {/* <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} /> */}

          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
          <Route path="*" element={<MainLayout />}>
            {/* Student Routes */}
            <Route path="SDashboard" element={<SDashboard />} />
            <Route path="SEvaluations" element={<SEvaluations />} />

            {/* Admin Routes */}
            <Route path="AdminDashboard" element={<AdminDashboard />} />
            <Route path="InstructorDashboard" element={<InstructorDashboard />} />
            <Route path="BSA" element={<Bsa />} />
            <Route path="BSAIS" element={<Bsais />} />
            <Route path="BSSW" element={<Bssw />} />
            <Route path="BAB" element={<Bab />} />
            <Route path="BSIS" element={<Bsis />} />
            <Route path="ACT" element={<Act />} />
            <Route path="Questions" element={<Questionnaires />} />

          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
