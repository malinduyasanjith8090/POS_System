// Login component (appears to be separate but included in the same file)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State for form fields and error handling
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFocusedUsername, setIsFocusedUsername] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const navigate = useNavigate();

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Example validation logic
    if (username === 'adminlogin' && password === '1234') {
      navigate('/adminpannel'); // Navigate to dashboard after successful login
    } else {
      setError('Invalid username or password');
    }
  };

  // Style for title bar
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
    <div>
      {/* Title bar at the top */}
      <div style={titleBarStyle}>
        <h1 style={{ margin: 0, padding: 0 }}>Admin Pannel</h1>
      </div>
      
      {/* Main login container */}
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Admin Login</h2>
          <p style={styles.subtitle}>Please log in to your system</p>
          
          {/* Login form */}
          <form onSubmit={handleSubmit} style={styles.form}>
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

// Styles for the Login component
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'url("https://source.unsplash.com/random/1920x1080?event") no-repeat center center fixed',
    backgroundSize: 'cover',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    width: '400px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: '26px',
    marginBottom: '10px',
    color: '#333',
    fontWeight: '600',
    fontFamily: '"Poppins", sans-serif',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '20px',
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
    transition: 'border 0.3s, box-shadow 0.3s',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#800000',
    boxShadow: '0 0 5px rgba(128, 0, 0, 0.5)',
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(45deg, #800000, #ff6347)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: '"Poppins", sans-serif',
    transition: 'background 0.3s, transform 0.2s',
    marginTop: '10px',
  },
  buttonHover: {
    transform: 'scale(1.05)',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
    fontSize: '14px',
  },
};

export default Login;