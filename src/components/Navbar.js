import React, { useEffect, useState } from 'react';
import placifyLogo from '../assets/Placify.svg';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const [active, setActive] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
   const username = localStorage.getItem('username');
const email = localStorage.getItem('email') || username; // fallback if only username is stored

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await fetch('http://localhost:5000/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email })
      });
      alert('Your account has been deleted. Check your email for a message from Placify.');
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      alert('Error deleting account. Please try again.');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={placifyLogo} alt="Placify Logo" className="logo1" />
        <Link to="/" className={`navbar-link${active === '/' ? ' active' : ''}`}>Home</Link>
        <a href="#code-evaluator" className="navbar-link">CodeEvaluator</a>
<a href="#resume-evaluator" className="navbar-link">ResumeEvaluator</a>
<a href="#chatbot" className="navbar-link">Chatbot</a></div>
      <div className="user-menu">
        <button className="user-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰ Your Account
        </button>
        {menuOpen && (
          <div className="user-menu-dropdown">
            <button onClick={onLogout} className="logout-button">Logout</button>
            <button onClick={handleDeleteAccount} className="delete-account-button">Delete Account</button>
          </div>
        )}
      </div>
    </nav>
        );
        };

        export default Navbar;
