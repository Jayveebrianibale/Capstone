import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./Layout/MainLayout";

import Login from "./Auth/Login";
// Student Pages
import SDashboard from "./pages/Student/SDashboard";
import SEvaluations from "./pages/Student/SEvaluations";
import StudentProfileSetup from "./pages/Student/StudentProfileSetup";
// Admin Pages
import AdminDashboard from "./pages/Admin/ADashboard";
import InstructorDashboard from "./pages/Instructor/InstrucDashboard";
import Accounts from "./pages/Admin/Accounts";
import Questionnaires from "./pages/Admin/Questionnaires";
import Instructors from "./pages/Admin/Instructors";
import Programs from "./pages/Admin/Programs";
// Admin Courses
import Bsa from "./pages/Admin/Courses/Bsa";
import Bsais from "./pages/Admin/Courses/Bsais";
import Bssw from "./pages/Admin/Courses/Bssw";
import Bab from "./pages/Admin/Courses/Bab";
import Bsis from "./pages/Admin/Courses/Bsis";
import Act from "./pages/Admin/Courses/Act";
// Intermediate
import Grade4 from "./pages/Admin/Intermediate/Grade4";
import Grade5 from "./pages/Admin/Intermediate/Grade5";
import Grade6 from "./pages/Admin/Intermediate/Grade6";
// Junior High
import Grade7 from "./pages/Admin/JuniorHigh/Grade7";
import Grade8 from "./pages/Admin/JuniorHigh/Grade8";
import Grade9 from "./pages/Admin/JuniorHigh/Grade9";
import Grade10 from "./pages/Admin/JuniorHigh/Grade10";
// Senior High
import Grade11 from "./pages/Admin/SeniorHigh/Grade11";
import Grade12 from "./pages/Admin/SeniorHigh/Grade12";

// Protect routes if no token
const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");
  return authToken ? children : <Navigate to="/login" />;
};

// Role-based route guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("role");

  if (!authToken) return <Navigate to="/login" />;
  if (!allowedRoles.includes(userRole)) {
    // Redirect to their correct dashboard
    if (userRole === "Student") return <Navigate to="/SDashboard" />;
    if (userRole === "Admin") return <Navigate to="/AdminDashboard" />;
    if (userRole === "Instructor") return <Navigate to="/InstructorDashboard" />;
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="overflow-x-hidden">
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes with Layout */}
          <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>

            {/* Student Routes */}
            <Route path="Student-profile-setup" element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <StudentProfileSetup />
              </ProtectedRoute>
            }/>
            <Route path="SDashboard" element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <SDashboard />
              </ProtectedRoute>
            }/>
            <Route path="SEvaluations" element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <SEvaluations />
              </ProtectedRoute>
            }/>

            {/* Admin Routes */}
            <Route path="AdminDashboard" element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }/>
            <Route path="Programs" element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Programs />
              </ProtectedRoute>
            }/>
            <Route path="Accounts" element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Accounts />
              </ProtectedRoute>
            }/>
            <Route path="Questions" element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Questionnaires />
              </ProtectedRoute>
            }/>
            <Route path="Instructors" element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Instructors />
              </ProtectedRoute>
            }/>

            {/* Instructor Dashboard */}
            <Route path="InstructorDashboard" element={
              <ProtectedRoute allowedRoles={["Instructor"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }/>

            {/* Courses - Admin */}
            <Route path="BSA" element={<ProtectedRoute allowedRoles={["Admin"]}><Bsa /></ProtectedRoute>} />
            <Route path="BSAIS" element={<ProtectedRoute allowedRoles={["Admin"]}><Bsais /></ProtectedRoute>} />
            <Route path="BSSW" element={<ProtectedRoute allowedRoles={["Admin"]}><Bssw /></ProtectedRoute>} />
            <Route path="BAB" element={<ProtectedRoute allowedRoles={["Admin"]}><Bab /></ProtectedRoute>} />
            <Route path="BSIS" element={<ProtectedRoute allowedRoles={["Admin"]}><Bsis /></ProtectedRoute>} />
            <Route path="ACT" element={<ProtectedRoute allowedRoles={["Admin"]}><Act /></ProtectedRoute>} />

            {/* Intermediate */}
            <Route path="Grade4" element={<ProtectedRoute allowedRoles={["Admin"]}><Grade4 /></ProtectedRoute>} />
            <Route path="Grade5" element={<ProtectedRoute allowedRoles={["Admin"]}><Grade5 /></ProtectedRoute>} />
            <Route path="Grade6" element={<ProtectedRoute allowedRoles={["Admin"]}><Grade6 /></ProtectedRoute>} />

            {/* Junior High */}
            <Route path="Grade7" element={<ProtectedRoute allowedRoles={["Admin"]}><Grade7 /></ProtectedRoute>} />
            <Route path="Grade8" element={<ProtectedRoute allowedRoles={["Admin"]}><Grade8 /></ProtectedRoute>} />
            <Route path="Grade9" element={<ProtectedRoute allowedRoles={["Admin"]}><Grade9 /></ProtectedRoute>} />
            <Route path="Grade10" element={<ProtectedRoute allowedRoles={["Admin"]}><Grade10 /></ProtectedRoute>} />

            {/* Senior High */}
            <Route path="Grade11" element={<ProtectedRoute allowedRoles={["Admin"]}><Grade11 /></ProtectedRoute>} />
            <Route path="Grade12" element={<ProtectedRoute allowedRoles={["Admin"]}><Grade12 /></ProtectedRoute>} />
          </Route>

          {/* Catch-all: Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
