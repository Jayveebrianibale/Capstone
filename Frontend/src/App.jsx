import{ useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MainLayout from "./Layout/MainLayout";

import Login from "./Auth/Login";
// Student Pages
import SDashboard from "./pages/Student/SDashboard";
import SEvaluations from "./pages/Student/SEvaluations";
import StudentProfileSetup from "./pages/Student/StudentProfileSetup";
// Admin Pages
import AdminDashboard from "./pages/Admin/ADashboard";
import InstructorDashboard from "./pages/Instructor/InstructorDashboard";
import Questionnaires from "./pages/Admin/Questionnaires";
import Instructors from "./pages/Admin/Instructors";
import Programs from "./pages/Admin/Programs";
// Admin Courses
import Bsa from "./pages/Admin/courses/Bsa.jsx";
import Bsais from "./pages/Admin/courses/Bsais.jsx";
import Bssw from "./pages/Admin/courses/Bssw.jsx";
import Bab from "./pages/Admin/courses/Bab.jsx";
import Bsis from "./pages/Admin/courses/Bsis.jsx";
import Act from "./pages/Admin/courses/Act.jsx";
// Basic Education
import Intermediate from "./pages/Admin/Intermediate";
import JuniorHigh from "./pages/Admin/JuniorHigh";
import SeniorHigh from "./pages/Admin/SeniorHigh";

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

  useEffect(() => {
    const channel = window.Echo.channel("test-channel");
  
    channel.listen(".test-event", (e) => {
      console.log("Received WebSocket Event:", e);
      alert("WebSocket event received: " + e.message);
    });
  
    return () => {
      window.Echo.leave("test-channel");
    };
  }, []);
  
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
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
            <Route path="Intermediate" element={<ProtectedRoute allowedRoles={["Admin"]}><Intermediate /></ProtectedRoute>} />
            <Route path="JuniorHigh" element={<ProtectedRoute allowedRoles={["Admin"]}><JuniorHigh /></ProtectedRoute>} />
            <Route path="SeniorHigh" element={<ProtectedRoute allowedRoles={["Admin"]}><SeniorHigh /></ProtectedRoute>} />

          </Route>

          {/* Catch-all: Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
