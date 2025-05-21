import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OTPVerification({ email, onVerified }) { // Use email prop
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', {
        email, // Use the email prop
        otp,
      });

      if (response.data.message === 'OTP verified successfully') {
        setMessage('OTP verified successfully. You can now log in.');
        onVerified(); // Call the onVerified callback
        setTimeout(() => navigate('/'), 2000); // Redirect to login page
      } else {
        setMessage(response.data.message || 'Invalid OTP or verification failed.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error verifying OTP.');
    }
  };

  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default OTPVerification;