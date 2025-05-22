import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [otp, setOtp] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async e => {
    e.preventDefault();
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/signup`, form, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setMessage(res.data.message);
      setIsOtpStep(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/verify-otp`, {
        email: form.username, // Ensure this matches the backend's expected field
        otp: otp,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (res.data.message === 'OTP verified successfully') {
        setMessage('OTP verified! Please log in.');
        setIsOtpStep(false); // Redirect to login step
      } else {
        setMessage(res.data.message || 'OTP verification failed');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    }
  };
  const handleResendOtp = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/resend-otp`, {
        email: form.username, // Ensure this matches the backend's expected field
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      setMessage(res.data.message || 'OTP resent successfully. Please check your email.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };
  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', color: '#4F46E5' }}>PlacifyAI</h1>
      <h2 style={{ textAlign: 'center' }}>{isOtpStep ? 'Verify OTP' : 'Sign Up to PlacifyAI'}</h2>

      {!isOtpStep ? (
        <form onSubmit={handleSignUp}>
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="username" placeholder="Email" value={form.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button type="submit">Sign Up</button>
        </form>
      ) : (
        <>
          <p>OTP sent to your email. Please verify to activate your account.</p>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
          <button onClick={handleResendOtp} style={{ marginLeft: '10px' }}>Resend OTP</button>
        </>
      )}

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

export default Signup;
