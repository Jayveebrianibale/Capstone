import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./Layout/MainLayout";
import SDashboard from "./pages/Student/SDashboard";
import Login from "./Auth/Login";
import SEvaluations from "./pages/Student/SEvaluations";
import AdminDashboard from "./pages/Admin/ADashboard";
import InstructorDashboard from "./pages/Instructor/InstrucDashboard";
import Bsa from "./pages/Admin/Courses/Bsa";
import Bsais from "./pages/Admin/Courses/Bsais";
import Bssw from "./pages/Admin/Courses/Bssw";
import Bab from "./pages/Admin/Courses/Bab";
import Bsis from "./pages/Admin/Courses/Bsis";
import Act from "./pages/Admin/Courses/Act";
import Grade4 from "./pages/Admin/Intermediate/Grade4";
import Grade5 from "./pages/Admin/Intermediate/Grade5";
import Grade6 from "./pages/Admin/Intermediate/Grade6";
import Grade7 from "./pages/Admin/JuniorHigh/Grade7";
import Grade8 from "./pages/Admin/JuniorHigh/Grade8";
import Grade9 from "./pages/Admin/JuniorHigh/Grade9";
import Grade10 from "./pages/Admin/JuniorHigh/Grade10";
import Grade11 from "./pages/Admin/SeniorHigh/Grade11";
import Grade12 from "./pages/Admin/SeniorHigh/Grade12";
import Accounts from "./pages/Admin/Accounts";
import Questionnaires from "./pages/Admin/Questionnaires";
import Instructors from "./pages/Admin/Instructors";
import StudentProfileSetup from "./pages/Student/StudentProfileSetup";
import Programs from "./pages/Admin/Programs";


const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");
  return authToken ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="overflow-x-hidden">
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Login Route (Outside MainLayout) */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes with MainLayout */}
          <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            {/* Student Routes */}
            <Route path="Student-profile-setup" element={<StudentProfileSetup/>} />
            <Route path="SDashboard" element={<SDashboard />} />
            <Route path="SEvaluations" element={<SEvaluations />} />


            {/* Admin Routes */}
            <Route path="AdminDashboard" element={<AdminDashboard />} />
            <Route path="InstructorDashboard" element={<InstructorDashboard />} />
            <Route path="Accounts" element={<Accounts />} />
            <Route path="Questions" element={<Questionnaires />} />
            <Route path="Instructors" element={<Instructors/>} />
            <Route path="Programs" element={<Programs/>} />
            
            {/* Courses */}
            <Route path="BSA" element={<Bsa />} />
            <Route path="BSAIS" element={<Bsais />} />
            <Route path="BSSW" element={<Bssw />} />
            <Route path="BAB" element={<Bab />} />
            <Route path="BSIS" element={<Bsis />} />
            <Route path="ACT" element={<Act />} />

            {/* Intermediate */}
            <Route path="Grade4" element={<Grade4 />} />
            <Route path="Grade5" element={<Grade5 />} />
            <Route path="Grade6" element={<Grade6 />} />

            {/* Junior High */}
            <Route path="Grade7" element={<Grade7 />} />
            <Route path="Grade8" element={<Grade8 />} />
            <Route path="Grade9" element={<Grade9 />} />
            <Route path="Grade10" element={<Grade10 />} />

            {/* Senior High */}
            <Route path="Grade11" element={<Grade11 />} />
            <Route path="Grade12" element={<Grade12 />} />
          

           
          </Route>

          {/* 404 - Redirect to Login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
