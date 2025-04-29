import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../SideBar/CustomerSideBar';

const Login = () => {
  // State for form inputs and UI
  const [username, setUsername] = useState(''); // Stores username input
  const [password, setPassword] = useState(''); // Stores password input
  const [error, setError] = useState(''); // Stores error message if login fails
  const [isFocusedUsername, setIsFocusedUsername] = useState(false); // Tracks focus state of username field
  const [isFocusedPassword, setIsFocusedPassword] = useState(false); // Tracks focus state of password field
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Basic validation logic (hardcoded credentials for demo)
    if (username === 'customeradmin' && password === '1234') {
      navigate('/customers'); // Navigate to dashboard after successful login
    } else {
      setError('Invalid username or password'); // Show error for invalid credentials
    }
  };

  // Style object for the title bar at the top of the page
  const titleBarStyle = {
    backgroundColor: '#1a1a1a',  // Dark background matching sidebar
    padding: '10px',  // Increased padding for better appearance
    margin: 0,
    width: '100%',  // Full width
    position: 'fixed',  // Fixed position at top
    top: 0,  // Align with top of viewport
    boxSizing: 'border-box',
    textAlign: 'center',  // Center the title text
    color: '#fff',  // White text color
    borderBottom: '1px solid #333',  // Darker border at bottom
  };

  return (
    <div>
      {/* Title bar at the top of the page */}
      <div style={titleBarStyle}>
        <h1 style={{ margin: 0, padding: 0 }}>Customer Management</h1>
      </div>
      
      {/* Main container with background image */}
      <div style={styles.container}>
        {/* Form container with semi-transparent background */}
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Customer Admin Login</h2>
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
                ...(isFocusedUsername ? styles.inputFocus : {}), // Apply focus style when focused
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
                ...(isFocusedPassword ? styles.inputFocus : {}), // Apply focus style when focused
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

// Style definitions for all components
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    background: 'url("https://source.unsplash.com/random/1920x1080?event") no-repeat center center fixed',
    backgroundSize: 'cover',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', // Strong shadow for depth
    width: '400px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)', // Blur effect for modern look
  },
  title: {
    fontSize: '26px',
    marginBottom: '10px',
    color: '#333',
    fontWeight: '600',
    fontFamily: '"Poppins", sans-serif', // Modern font
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '20px',
    fontFamily: '"Poppins", sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column', // Stack form elements vertically
  },
  label: {
    fontSize: '14px',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555',
    textAlign: 'left',
    fontFamily: '"Poppins", sans-serif',
  },
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
  inputFocus: {
    borderColor: '#800000', // Maroon color for focus
    boxShadow: '0 0 5px rgba(128, 0, 0, 0.5)', // Glow effect
  },
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
  buttonHover: {
    transform: 'scale(1.05)', // Slight scale on hover
  },
  error: {
    color: 'red',
    marginBottom: '20px',
    fontSize: '14px',
  },
};

export default Login;