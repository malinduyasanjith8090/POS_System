import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Navigation hook
  const navigate = useNavigate();

  // Title bar style
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (username === 'admin' && password === '1234') {
      navigate('/Employee'); // Redirect on successful login
    } else {
      setError('Invalid username or password');
    }
  };

  // Component styles
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #8e9eab, #eef2f3)',
    },
    formContainer: {
      backgroundColor: '#fff',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      width: '320px',
      textAlign: 'center',
    },
    title: {
      fontSize: '26px',
      marginBottom: '10px',
      color: '#333',
      fontWeight: '600',
      fontFamily: '"Poppins", sans-serif',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
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
      transition: 'border 0.3s',
    },
    button: {
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
    },
    error: {
      color: 'red',
      marginBottom: '20px',
      fontSize: '14px',
    },
  };

  return (
    <>
      {/* Title Bar */}
      <div style={titleBarStyle}>
        <h1 style={{ margin: 0, padding: 0 }}>Employee Management</h1>
      </div>
      
      {/* Login Form Container */}
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Admin Login</h2>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Username Field */}
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Enter your username"
              required
            />
            
            {/* Password Field */}
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
            
            {/* Error Message */}
            {error && <p style={styles.error}>{error}</p>}
            
            {/* Submit Button */}
            <button type="submit" style={styles.button}>Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;