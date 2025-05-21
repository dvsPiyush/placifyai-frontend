import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Chatbot from './components/Chatbot';
import CodeEvaluator from './components/CodeEvaluator';
import ResumeEvaluator from './components/ResumeEvaluator';
import Signup from './components/Signup';
import Login from './components/Login';
import OTPVerification from './components/OtpVerification';
import SystemAsks from './components/SystemAsks';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import AdBanner from './components/AdBanner';


function App() {
  const [user, setUser] = useState(false);
  const [isOtpPending, setIsOtpPending] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [externalMessage, setExternalMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isActive = localStorage.getItem('is_active');
    if (token && isActive === 'true') {
      setUser(true);
    } else if (isActive === 'false') {
      setIsOtpPending(true);
    } else {
      setUser(false);
    }
  }, []);

  const handleLoginSuccess = (navigate) => {
    const isActive = localStorage.getItem('is_active');
    if (isActive === 'true') {
      setUser(true);
      setIsOtpPending(false);
      navigate('/');
    } else {
      setIsOtpPending(true);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(false);
    setIsOtpPending(false);
    setOtpEmail('');
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
                <Login onLoginSuccess={handleLoginSuccess} setOtpEmail={setOtpEmail} />
              ) : (
                <>
                  <Navbar onLogout={logout} />
                  <HomePage />
                  <div className="section">
                    <div className="left-panel" id="code-evaluator">
                      <CodeEvaluator setExternalMessage={setExternalMessage}/>
                    </div>
                    <div className="right-panel" id="chatbot">
                      <Chatbot externalMessage={externalMessage} />                    </div>
                  </div>
  <div className="resume-section" id="resume-evaluator">
        <AdBanner />

  <div className="resume-flex-row">
    <AdBanner width="120px" height="350px" />
    <div style={{ flex: 1, minWidth: 0 }}>
      <ResumeEvaluator />
    </div>
    <AdBanner width="120px" height="350px" />
  </div>
</div>
                </>
              )
            }
          />

          <Route path="api/signup" element={<Signup setOtpEmail={setOtpEmail} />} />

          <Route
            path="api/verify-otp"
            element={
              isOtpPending ? (
                <OTPVerification
                  email={otpEmail}
                  onVerified={() => {
                    localStorage.setItem('is_active', 'true');
                    setUser(true);
                    setIsOtpPending(false);
                  }}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navbar onLogout={logout} />
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* You can remove this route if you only want the layout on the homepage */}
          <Route
            path="/code-editor"
            element={
              <ProtectedRoute>
                <Navbar onLogout={logout} />
                <div className="section">
                  <div className="left-panel" id="code-evaluator">
    <CodeEvaluator setExternalMessage={setExternalMessage}/>
                  </div>
                  <div className="right-panel" id="chatbot">
    <Chatbot externalMessage={externalMessage} />
                  </div>
                </div>
                <div className="resume-section" id="resume-evaluator">
                  <ResumeEvaluator />
                  <AdBanner width="100%" height="90px" />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/system-asks"
            element={
              <ProtectedRoute>
                <Navbar onLogout={logout} />
                <SystemAsks />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;