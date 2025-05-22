import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import placifyLogo from '../assets/Placify.svg';


const Login = ({ onLoginSuccess, setOtpEmail }) => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  console.log('isOtpStep:', isOtpStep);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setFormData({ name: '', username: '', password: '' });
    setOtp('');
    setIsOtpStep(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const url = isSignup ? `${process.env.REACT_APP_API_URL}/api/signup` : `${process.env.REACT_APP_API_URL}/api/login`;
      const res = await axios.post(url, formData);
  
      console.log('Response:', res.data);
  
      if (res.data.token) {
        // Login successful
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', formData.username);
        localStorage.setItem('name', res.data.name || formData.name);
        localStorage.setItem('is_active', 'true'); // Ensure is_active is set to true
        onLoginSuccess(navigate);
        console.log('Login successful');
      } else if (res.data.otp_required) {
        // OTP verification required
        setIsOtpStep(true); // Enable OTP step
        setOtpEmail(formData.username); // Save the email for OTP resend
        setError('Please verify your email via OTP first.');
        console.log('OTP verification required');
      } else {
        setError(res.data.message);
        console.log('Error:', res.data.message);
      }
    } catch (err) {
      console.error('Error:', err.response?.data?.message || err.message);
  
      // Handle OTP verification required (403)
      if (err.response?.status === 403 && err.response?.data?.otp_required) {
        setIsOtpStep(true); // Enable OTP step
        setOtpEmail(formData.username); // Save the email for OTP resend
        setError('Please verify your email via OTP first.');
        console.log('OTP verification required');
      } else {
        setError(err.response?.data?.message || `Error: ${err.message}`);
      }
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/verify-otp`, {
        email: formData.username,
        otp: otp,
      });

      if (res.data.token) {
        // OTP verified + login success
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', formData.username);
        localStorage.setItem('name', res.data.name || formData.name);
        onLoginSuccess();
      } else {
        // Signup OTP verified → return to login
        setIsOtpStep(false);
        setIsSignup(false);
        setError(res.data.message || 'OTP verified. Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/resend-otp`, {
        email: formData.username, // Use formData.username directly
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setError(res.data.message || 'OTP resent successfully. Please check your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="login-container">
      <img
                src={placifyLogo}
                alt="Placify Logo"
                className="logo"
                style={{ height: "50px", marginRight: "2px" }}
              />
      <h1 style={{ textAlign: 'center', color: '#4F46E5',marginTop:"0" }}>PlacifyAI</h1>
      <h2>{isSignup ? 'Sign Up' : 'Login'} to Placify</h2>

      {!isOtpStep ? (
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Your Name"
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="username"
            value={formData.username}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              required
              className="password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? '🙉' : '🙈'}
            </button>
          </div>

          <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
          {error && <p className="error">{error}</p>}
          <p>
            {isSignup ? 'Already have an account?' : 'New here?'}{' '}
            <span onClick={toggleMode} className="toggle-link">
              {isSignup ? 'Login' : 'Sign Up'}
            </span>
          </p>
        </form>
      ) : (
        <div>
          <p>OTP sent to your email. Please verify to continue.</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
          <button onClick={handleResendOtp} style={{ marginLeft: '10px' }}>
            Resend OTP
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;