import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import SideBar from '../SideBar/EmployeeSideBar copy';

function AddLeaveForm() {
  // Get employee ID from URL parameters
  const { empid } = useParams();
  
  // Form data state
  const [formData, setFormData] = useState({
    empid: empid || "", // Initialize with URL parameter or empty string
    email: "",
    startdate: "",
    enddate: "",
    reason: ""
  });

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Inline styles
  const formContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  };

  const labelStyle = {
    color: '#333333',
    fontWeight: 'bold',
  };

  const inputStyle = {
    backgroundColor: '#f2f2f2',
    border: '1px solid #cccccc',
    borderRadius: '5px',
    padding: '10px',
    color: '#333333',
    width: '100%',
  };

  const buttonStyle = {
    backgroundColor: '#800000',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  };

  const alertStyle = {
    backgroundColor: '#ffffff',
    color: '#800000',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '20px',
    textAlign: 'center',
    position: 'fixed',
    top: '20px',
    right: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    width: '300px',
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email
    if (!isValidEmail(formData.email)) {
      setAlertMessage('Please enter a valid email address.');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }

    // Validate date range
    if (new Date(formData.startdate) >= new Date(formData.enddate)) {
      setAlertMessage('Start date must be before the end date.');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }

    // Submit leave request
    axios.post('http://localhost:5000/leave/add', formData)
      .then((res) => {
        setAlertMessage('Leave request added successfully');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        // Reset form
        setFormData({
          empid: empid || "",
          email: "",
          startdate: "",
          enddate: "",
          reason: ""
        });
      })
      .catch((err) => {
        setAlertMessage('Error adding leave request');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
  };

  return (
    <>
      <SideBar/>
      <div style={{ 
        padding: '50px', 
        marginLeft: '250px', 
        marginTop: '60px', 
        boxSizing: 'border-box', 
        width: 'calc(100% - 250px)', 
        height: 'calc(100vh - 60px)' 
      }}>
        <form style={formContainerStyle} onSubmit={handleSubmit}>
          <h1>Add New Leave Request</h1>
          <div style={formGridStyle}>
            {/* Employee ID Field */}
            <div className="mb-3">
              <label style={labelStyle}>Employee ID:</label>
              <input
                type="text"
                name="empid"
                value={formData.empid}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label style={labelStyle}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>

            {/* Start Date Field */}
            <div className="mb-3">
              <label style={labelStyle}>Start Date:</label>
              <input
                type="date"
                name="startdate"
                value={formData.startdate}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>

            {/* End Date Field */}
            <div className="mb-3">
              <label style={labelStyle}>End Date:</label>
              <input
                type="date"
                name="enddate"
                value={formData.enddate}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>

            {/* Reason Field */}
            <div className="mb-3">
              <label style={labelStyle}>Reason:</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                style={{ ...inputStyle, height: '100px' }}
                required
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" style={buttonStyle}>Submit Leave Request</button>
        </form>

        {/* Alert Notification */}
        <AnimatePresence>
          {showAlert && (
            <motion.div 
              style={alertStyle} 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: '0%' }} 
              exit={{ opacity: 0, x: '100%' }}
            >
              {alertMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default AddLeaveForm;