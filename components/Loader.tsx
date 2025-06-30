import React from 'react'

const Loader = () => {
    const spinnerStyle: React.CSSProperties = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 999,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };
    
    const spinnerCircleStyle: React.CSSProperties = {
      width: "48px",
      height: "48px",
      border: "6px solid #ccc",
      borderTop: "6px solid #007bff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    };
    
    // Add keyframe animation globally
    const styleTag = typeof window !== "undefined" ? document.getElementById("spinner-style") : null;
    if (!styleTag && typeof window !== "undefined") {
      const style = document.createElement("style");
      style.id = "spinner-style";
      style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  return (
        <div style={spinnerStyle}>
          <div style={spinnerCircleStyle}></div>
        </div>
  )
}

export default Loader