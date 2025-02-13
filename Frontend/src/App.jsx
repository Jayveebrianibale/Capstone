import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import SDashboard from "./pages/Student/SDashboard";
import SEvaluations from "./pages/Student/SEvaluations";
import EvaluationFormModal from "./contents/EvaluationModal";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}

        {/* Protected Routes */}
        <Route path="*" element={<MainLayout />}>
          <Route path="SDashboard" element={<SDashboard />} />
          <Route path="SEvaluations" element={<SEvaluations />} />
          <Route path="evaluation-form" element={<EvaluationFormModal />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
