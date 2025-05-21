// src/components/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const name = localStorage.getItem('name');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to PlacifyAI, {name} 👋</h1>
      <p>Email: {username}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
