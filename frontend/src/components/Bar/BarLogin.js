import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Login component for Bar Management System
 * Handles user authentication and redirects to dashboard on successful login
 */
const Login = () => {
  // State for form inputs and UI
  const [username, setUsername] = useState(''); // Stores username input
  const [password, setPassword] = useState(''); // Stores password input
  const [error, setError] = useState(''); // Stores error message if login fails
  const [isFocusedUsername, setIsFocusedUsername] = useState(false); // Tracks username input focus state
  const [isFocusedPassword, setIsFocusedPassword] = useState(false); // Tracks password input focus state
  
  // Navigation hook for redirecting after login
  const navigate = useNavigate();

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation logic (in a real app, this would call an API)
    if (username === 'baradmin' && password === '1234') {
      navigate('/bardashboard'); // Navigate to dashboard after successful login
    } else {
      setError('Invalid username or password'); // Show error for invalid credentials
    }
  };

  // Style for the title bar at the top of the page
  const titleBarStyle = {
    backgroundColor: '#1a1a1a',  // Dark background
    padding: '10px',  // Increased padding for better appearance
    margin: 0,
    width: '100%',  // Full width
    position: 'fixed',
    top: 0,  // Align with the top of the viewport
    boxSizing: 'border-box',
    textAlign: 'center',  // Center the title text
    color: '#fff',  // White text
    borderBottom: '1px solid #333',  // Border for separation
  };

  return (
    <div>
      {/* Title bar at the top of the page */}
      <div style={titleBarStyle}>
        <h1 style={{ margin: 0, padding: 0 }}>Bar Management</h1>
      </div>
      
      {/* Main login container */}
      <div style={styles.container}>
        {/* Form container with glassmorphism effect */}
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Bar Admin Login</h2>
          <p style={styles.subtitle}>Please log in to your system</p>
          
          {/* Login form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Username input field */}
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setIsFocusedUsername(true)}
              onBlur={() => setIsFocusedUsername(false)}
              style={{
                ...styles.input,
                ...(isFocusedUsername ? styles.inputFocus : {}),
              }}
              placeholder="Enter your username"
              required
            />
            
            {/* Password input field */}
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocusedPassword(true)}
              onBlur={() => setIsFocusedPassword(false)}
              style={{
                ...styles.input,
                ...(isFocusedPassword ? styles.inputFocus : {}),
              }}
              placeholder="Enter your password"
              required
            />
            
            {/* Error message display */}
            {error && <p style={styles.error}>{error}</p>}
            
            {/* Submit button */}
            <button type="submit" style={styles.button}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Styles object containing all CSS-in-JS styles
const styles = {
  // Main container styling
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    background: 'url("https://source.unsplash.com/random/1920x1080?event") no-repeat center center fixed',
    backgroundSize: 'cover',
  },
  
  // Form container styling
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', // Strong shadow for depth
    width: '400px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)', // Glassmorphism effect
  },
  
  // Title styling
  title: {
    fontSize: '26px',
    marginBottom: '10px',
    color: '#333',
    fontWeight: '600',
    fontFamily: '"Poppins", sans-serif',
  },
  
  // Subtitle styling
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '20px',
    fontFamily: '"Poppins", sans-serif',
  },
  
  // Form styling
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  // Label styling
  label: {
    fontSize: '14px',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555',
    textAlign: 'left',
    fontFamily: '"Poppins", sans-serif',
  },
  
  // Input field base styling
  input: {
    marginBottom: '20px',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontFamily: '"Poppins", sans-serif',
    transition: 'border 0.3s, box-shadow 0.3s', // Smooth transition for focus
    outline: 'none',
  },
  
  // Input field focus state styling
  inputFocus: {
    borderColor: '#800000', // Maroon color
    boxShadow: '0 0 5px rgba(128, 0, 0, 0.5)', // Glow effect
  },
  
  // Button styling
  button: {
    padding: '12px',
    background: 'linear-gradient(45deg, #800000, #ff6347)', // Gradient from maroon to tomato
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: '"Poppins", sans-serif',
    transition: 'background 0.3s, transform 0.2s', // Smooth hover effects
    marginTop: '10px',
  },
  
  // Button hover state styling (not currently used, could be added to button with onMouseEnter/Leave)
  buttonHover: {
    transform: 'scale(1.05)',
  },
  
  // Error message styling
  error: {
    color: 'red',
    marginBottom: '20px',
    fontSize: '14px',
  },
};

export default Login;