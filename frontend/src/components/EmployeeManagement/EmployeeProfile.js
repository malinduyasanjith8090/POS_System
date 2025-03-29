import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/AdminEmployeeSideBar.js";

export default function UpdateEmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    mobile: "",
    nic: "",
    designation: "",
    basicsal: "",
    empid: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Error states for each field
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [nicError, setNicError] = useState("");
  const [designationError, setDesignationError] = useState("");
  const [basicsalError, setBasicsalError] = useState("");
  const [empidError, setEmpidError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/employee/get/${id}`)
      .then((res) => {
        setEmployee(res.data.employee);
      })
      .catch((err) => {
        setAlertMessage("Error fetching employee data");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  }, [id]);

  const handleNameInput = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setEmployee(prev => ({...prev, name: value}));
      setNameError("");
    } else {
      setNameError("Name can only contain letters");
    }
  };

  const handleMobileInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setEmployee(prev => ({...prev, mobile: value}));
      setMobileError("");
    } else {
      setMobileError("Mobile must contain only numbers (10 digits)");
    }
  };

  const handleNicInput = (e) => {
    const value = e.target.value;
    if (/^[0-9vV]*$/.test(value) && (value.length <= 12 && value.length >= 8)) {
      setEmployee(prev => ({...prev, nic: value}));
      setNicError("");
    } else {
      setNicError("NIC must be 8-12 digits with optional V/v at end");
    }
  };

  const handleDesignationInput = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setEmployee(prev => ({...prev, designation: value}));
      setDesignationError("");
    } else {
      setDesignationError("Designation cannot contain numbers");
    }
  };

  const handleBasicsalInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setEmployee(prev => ({...prev, basicsal: value}));
      setBasicsalError("");
    } else {
      setBasicsalError("Salary must contain only numbers");
    }
  };

  const handleEmpidInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setEmployee(prev => ({...prev, empid: value}));
      setEmpidError("");
    } else {
      setEmpidError("Employee ID must contain only numbers");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmployee(prev => ({...prev, email: value}));
    setEmailError("");
  };

  function validateForm() {
    let isValid = true;

    if (!employee.name) {
      setNameError("Name is required");
      isValid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(employee.email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }

    if (!/^\d{10}$/.test(employee.mobile)) {
      setMobileError("Mobile must be exactly 10 digits");
      isValid = false;
    }

    if (!/^(?:\d{9}[vV]|\d{12})$/.test(employee.nic)) {
      setNicError("NIC must be 9 digits with V/v or 12 digits");
      isValid = false;
    }

    if (!employee.designation) {
      setDesignationError("Designation is required");
      isValid = false;
    }

    if (!employee.basicsal || employee.basicsal <= 0) {
      setBasicsalError("Salary must be a positive number");
      isValid = false;
    }

    if (!employee.empid) {
      setEmpidError("Employee ID is required");
      isValid = false;
    }

    return isValid;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      setAlertMessage("Please fix the form errors");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    axios
      .put(`http://localhost:5000/employee/update/${id}`, employee)
      .then(() => {
        setAlertMessage("Employee updated successfully!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((err) => {
        setAlertMessage("Error updating employee");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  }

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  };

  const formStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
  };

  const labelStyle = {
    color: "#333333",
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block"
  };

  const inputStyle = {
    backgroundColor: "#f2f2f2",
    border: "1px solid #cccccc",
    borderRadius: "5px",
    padding: "10px",
    color: "#333333",
    width: "100%",
  };

  const invalidInputStyle = {
    ...inputStyle,
    borderColor: "red"
  };

  const buttonStyle = {
    backgroundColor: "#800000",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "15px",
  };

  const alertStyle = {
    backgroundColor: "#ffffff",
    color: "#800000",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    position: "fixed",
    top: "80px",
    right: "20px",
    zIndex: 1000,
    width: "300px",
    transform: "translateX(100%)",
  };

  const errorMessageStyle = {
    color: "red",
    fontSize: "14px",
    marginTop: "5px"
  };

  return (
    <>
      <SideBar/>
      <div style={{
        padding: "50px",
        width: "calc(100% - 250px)",
        boxSizing: "border-box",
        marginLeft: "250px",
      }}>
        <h1>Update Employee Profile</h1>
        <div style={formStyle}>
          <form onSubmit={handleSubmit}>
            <div style={containerStyle}>
              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name" style={labelStyle}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Name"
                  value={employee.name}
                  onChange={handleNameInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^[A-Za-z\s]*$/.test(pasteData)) {
                      e.preventDefault();
                      setNameError("Cannot paste numbers or special characters");
                    }
                  }}
                  style={nameError ? invalidInputStyle : inputStyle}
                  required
                />
                {nameError && <div style={errorMessageStyle}>{nameError}</div>}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" style={labelStyle}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                  value={employee.email}
                  onChange={handleEmailChange}
                  style={emailError ? invalidInputStyle : inputStyle}
                  required
                />
                {emailError && <div style={errorMessageStyle}>{emailError}</div>}
              </div>

              {/* Mobile Field */}
              <div className="form-group">
                <label htmlFor="mobile" style={labelStyle}>
                  Mobile No
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  value={employee.mobile}
                  onChange={handleMobileInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^\d+$/.test(pasteData)) {
                      e.preventDefault();
                      setMobileError("Cannot paste non-numeric characters");
                    }
                  }}
                  maxLength={10}
                  style={mobileError ? invalidInputStyle : inputStyle}
                  required
                />
                {mobileError && <div style={errorMessageStyle}>{mobileError}</div>}
              </div>

              {/* NIC Field */}
              <div className="form-group">
                <label htmlFor="nic" style={labelStyle}>
                  NIC
                </label>
                <input
                  type="text"
                  id="nic"
                  name="nic"
                  placeholder="Enter NIC (9 digits with V/v or 12 digits)"
                  value={employee.nic}
                  onChange={handleNicInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^[0-9vV]+$/.test(pasteData)) {
                      e.preventDefault();
                      setNicError("Cannot paste invalid NIC format");
                    }
                  }}
                  maxLength={12}
                  style={nicError ? invalidInputStyle : inputStyle}
                  required
                />
                {nicError && <div style={errorMessageStyle}>{nicError}</div>}
              </div>

              {/* Designation Field */}
              <div className="form-group">
                <label htmlFor="designation" style={labelStyle}>
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  placeholder="Enter Designation"
                  value={employee.designation}
                  onChange={handleDesignationInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^[A-Za-z\s]*$/.test(pasteData)) {
                      e.preventDefault();
                      setDesignationError("Cannot paste numbers or special characters");
                    }
                  }}
                  style={designationError ? invalidInputStyle : inputStyle}
                  required
                />
                {designationError && <div style={errorMessageStyle}>{designationError}</div>}
              </div>

              {/* Basic Salary Field */}
              <div className="form-group">
                <label htmlFor="basicsal" style={labelStyle}>
                  Basic Salary
                </label>
                <input
                  type="text"
                  id="basicsal"
                  name="basicsal"
                  placeholder="Enter Basic Salary"
                  value={employee.basicsal}
                  onChange={handleBasicsalInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^\d+$/.test(pasteData)) {
                      e.preventDefault();
                      setBasicsalError("Cannot paste non-numeric characters");
                    }
                  }}
                  style={basicsalError ? invalidInputStyle : inputStyle}
                  required
                />
                {basicsalError && <div style={errorMessageStyle}>{basicsalError}</div>}
              </div>

              {/* Employee ID Field */}
              <div className="form-group">
                <label htmlFor="empid" style={labelStyle}>
                  Employee ID
                </label>
                <input
                  type="text"
                  id="empid"
                  name="empid"
                  placeholder="Enter Employee ID"
                  value={employee.empid}
                  onChange={handleEmpidInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^\d+$/.test(pasteData)) {
                      e.preventDefault();
                      setEmpidError("Cannot paste non-numeric characters");
                    }
                  }}
                  style={empidError ? invalidInputStyle : inputStyle}
                  required
                />
                {empidError && <div style={errorMessageStyle}>{empidError}</div>}
              </div>
            </div>

            <button type="submit" style={buttonStyle}>
              Update
            </button>
          </form>
        </div>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              style={alertStyle}
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, x: "100%" }}
            >
              {alertMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}