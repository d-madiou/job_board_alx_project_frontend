// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Import from AuthContext.jsx
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DashboardPage from './pages/DashboardPage';
import Companies from './pages/Companies';
import Jobs from './pages/Jobs';
import CompanyProfile from './pages/CompanyProfile';
import JobDetails from './pages/JobDetails';
import JobApplicationForm from './pages/JobApplicationForm';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={<LoginForm onSuccess={() => window.location.href = '/dashboard'} />} 
            />
            <Route 
              path="/register" 
              element={<RegisterForm onSuccess={() => window.location.href = '/dashboard'} />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/jobs" element={<Jobs/>} />
            <Route path="/companies" element={<Companies/>} />
            <Route path="/companies/:slug" element={<CompanyProfile />} />
            <Route path="/:slug/" element={<JobDetails />} />
            <Route path="/:slug/apply/" element={<JobApplicationForm />} />

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;