import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  // State for form inputs and error message
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  
  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  // Style for the title bar at the top of the page
  const titleBarStyle = {
    backgroundColor: '#1a1a1a',  // Dark background color
    padding: '10px',            // Padding around the title
    margin: 0,                  // No margin
    width: '100%',              // Full width
    position: 'fixed',          // Fixed position at top
    top: 0,                     // Align to top of viewport
    boxSizing: 'border-box',    // Box sizing model
    textAlign: 'center',        // Center align text
    color: '#fff',              // White text color
    borderBottom: '1px solid #333',  // Bottom border
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const res = await axios.post(`http://localhost:5000/employee/login`, { email, mobile });

      if (res.status === 200 && res.data.employee) {
        // Store employee data in sessionStorage for persistence
        sessionStorage.setItem('employee', JSON.stringify(res.data.employee));
        // Navigate to employee update profile page on successful login
        navigate(`/employee/update/${res.data.employee._id}`);
      } else {
        // Set error message for invalid credentials
        setError("Invalid email or mobile number");
      }
    } catch (err) {
      // Handle login error
      setError("Invalid email or mobile number");
      console.error(err); // Log error for debugging
    }
  };

  // Container style for the login form
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #8e9eab, #eef2f3)',
  };

  // Style for the form container
  const formStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    width: '320px',
    textAlign: 'center',
  };

  // Style for input fields
  const inputStyle = {
    marginBottom: '20px',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontFamily: '"Poppins", sans-serif',
    transition: 'border 0.3s',
  };

  // Style for the login button
  const buttonStyle = {
    padding: '12px',
    background: 'linear-gradient(45deg, #800000, #800000)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: '"Poppins", sans-serif',
    transition: 'background 0.3s',
  };

  // Style for the form heading
  const headingStyle = {
    fontSize: '26px',
    marginBottom: '10px',
    color: '#333',
    fontWeight: '600',
    fontFamily: '"Poppins", sans-serif',
  };

  // Style for form labels
  const labelStyle = {
    fontSize: '14px',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555',
    textAlign: 'left',
    fontFamily: '"Poppins", sans-serif',
  };

  return (
    <>
      {/* Title bar at the top of the page */}
      <div style={titleBarStyle}>
        <h1 style={{ margin: 0, padding: 0 }}>Employee Management</h1>
      </div>
      
      {/* Main container for the login form */}
      <div style={containerStyle}>
        {/* Login form */}
        <form style={formStyle} onSubmit={handleLogin}>
          <h2 style={headingStyle}>Log In</h2>
          
          {/* Email input field */}
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            placeholder="Enter your email"
          />
          
          {/* Mobile number input field */}
          <label style={labelStyle}>Mobile Number</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            style={inputStyle}
            placeholder="Enter your mobile number"
          />
          
          {/* Error message display */}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          
          {/* Login button */}
          <button type="submit" style={buttonStyle}>Log In</button>
        </form>
      </div>
    </>
  );
}