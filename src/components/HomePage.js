import React from 'react';
import placifyLogo from '../assets/Placify.svg';
import './HomePage.css';
const HomePage = () => {

  return (
    <div className="homepage">
      <div className="logo-title-row">
        <img
          src={placifyLogo}
          alt="Placify Logo"
          className="logo"
          style={{ height: "50px", marginRight: "2px" }}
        />
        <h1 className="placify-title" >PlacifyAI</h1>
      </div>
    </div>
  );
};

export default HomePage;