import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginAs() {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  // Handle click for employee login button
  const handleEmployeeLogin = () => {
    navigate('/Emp_Login'); // Navigate to employee login page
  };

  // Handle click for admin login button
  const handleAdminLogin = () => {
    navigate('/Admin_Login'); // Navigate to admin login page
  };

  // Style for the main container
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #8e9eab, #eef2f3)',
    color: '#333',
  };

  // Style for the title
  const titleStyle = {
    fontSize: '36px',
    marginBottom: '40px',
    textAlign: 'center',
    fontFamily: '"Poppins", sans-serif',
  };

  // Style for the buttons
  const buttonStyle = {
    padding: '15px 30px',
    borderRadius: '6px',
    cursor: 'pointer',
    margin: '10px',
    fontSize: '18px',
    width: '200px',
    border: 'none',
    color: '#ffffff',
    background: 'linear-gradient(45deg, #800000, #800000)',
    transition: 'background 0.3s',
  };

  // Style for button hover state
  const buttonHoverStyle = {
    background: '#A52A2A', // Lighter shade of maroon
  };

  // Style for the title bar
  const titleBarStyle = {
    backgroundColor: '#1a1a1a',
    padding: '10px',
    margin: 0,
    width: '100%',
    position: 'fixed',
    top: 0,
    boxSizing: 'border-box',
    textAlign: 'center',
    color: '#fff',
    borderBottom: '1px solid #333',
  };

  return (
    <>
      {/* Title bar at the top of the page */}
      <div style={titleBarStyle}>
        <h1 style={{ margin: 0, padding: 0 }}>Employee Management</h1>
      </div>
      
      {/* Main container for the login selection */}
      <div style={containerStyle}>
        <h1 style={titleStyle}>Log In As</h1>
        
        {/* Employee login button */}
        <button
          style={buttonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(45deg, #800000, #800000)')}
          onClick={handleEmployeeLogin}
        >
          Employee
        </button>
        
        {/* Admin login button */}
        <button
          style={buttonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.background = buttonHoverStyle.background)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(45deg, #800000, #800000)')}
          onClick={handleAdminLogin}
        >
          Admin
        </button>
      </div>
    </>
  );
}