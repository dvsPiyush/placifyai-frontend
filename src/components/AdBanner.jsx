import React from 'react';

const AdBanner = ({ width = "100%", height = "90px" }) => (
  <div
    style={{
      width,
      height,
      background: "#f3f3f3",
      border: "2px dashed #bbb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#888",
      fontSize: "1.1rem",
      margin: "18px auto",
      borderRadius: "10px"
    }}
  >
    Advertisement Space
  </div>
);

export default AdBanner;