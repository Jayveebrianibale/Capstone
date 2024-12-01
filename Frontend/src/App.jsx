import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './Auth/Login'
import Signup from './Auth/Signup';
import Dashboard from './pages/Student/SDashboard';
import VerificationCode from './Auth/Verification';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            <Route path="/navbar" element={<Navbar/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/verification" element={<VerificationCode />} />
            {/* <Route path="*" element={<Navigate to="/login" />} /> */}
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;