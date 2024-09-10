import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './Auth/Login'
import Signup from './Auth/Signup';
import Dashboard from './pages/Dashboard';
import VerificationCode from './Auth/Verification';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/verification" element={<VerificationCode />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;