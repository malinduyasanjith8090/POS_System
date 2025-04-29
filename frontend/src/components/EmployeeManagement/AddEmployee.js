import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/AdminEmployeeSideBar";
import "./AddEmployee.css";

export default function AddEmployee() {
  // State for hover effect on submit button
  const [isHovering, setIsHovering] = useState(false);
  
  // State for alert notifications
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Form field states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [nic, setNic] = useState("");
  const [designation, setDesignation] = useState("");
  const [basicsal, setBasicsal] = useState("");
  const [empid, setEmpid] = useState("");

  // Validation error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [nicError, setNicError] = useState("");
  const [designationError, setDesignationError] = useState("");
  const [basicsalError, setBasicsalError] = useState("");
  const [empidError, setEmpidError] = useState("");

  // Name input handler with validation
  const handleNameInput = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
      setNameError("");
    } else {
      setNameError("Name can only contain letters");
    }
  };

  // Mobile input handler with validation
  const handleMobileInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobile(value);
      setMobileError("");
    } else {
      setMobileError("Mobile must contain only numbers (10 digits)");
    }
  };

  // NIC input handler (only allows numbers)
  const handleNicInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 12) {
      setNic(value);
      setNicError("");
    } else {
      setNicError("NIC must contain only numbers (max 12 digits)");
    }
  };

  // Designation input handler with validation
  const handleDesignationInput = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setDesignation(value);
      setDesignationError("");
    } else {
      setDesignationError("Designation cannot contain numbers");
    }
  };

  // Basic salary input handler with validation
  const handleBasicsalInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setBasicsal(value);
      setBasicsalError("");
    } else {
      setBasicsalError("Salary must contain only numbers");
    }
  };

  // Employee ID input handler with validation
  const handleEmpidInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setEmpid(value);
      setEmpidError("");
    } else {
      setEmpidError("Employee ID must contain only numbers");
    }
  };

  // Form submission handler
  const sendData = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let isValid = true;

    if (!name) {
      setNameError("Name is required");
      isValid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setMobileError("Mobile must be exactly 10 digits");
      isValid = false;
    }

    if (!/^\d{12}$/.test(nic)) {
      setNicError("NIC must be exactly 12 digits");
      isValid = false;
    }

    if (!designation) {
      setDesignationError("Designation is required");
      isValid = false;
    }

    if (!basicsal || basicsal <= 0) {
      setBasicsalError("Salary must be a positive number");
      isValid = false;
    }

    if (!empid) {
      setEmpidError("Employee ID is required");
      isValid = false;
    }

    if (!isValid) {
      setAlertMessage("Please fix the errors in the form");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    // Prepare employee data for submission
    const newEmployee = {
      name,
      email,
      mobile,
      nic,
      designation,
      basicsal,
      empid,
    };

    // Send data to backend
    axios
      .post("http://localhost:5000/employee/add", newEmployee)
      .then(() => {
        setAlertMessage("Employee Added Successfully");
        setShowAlert(true);

        // Reset form fields
        setName("");
        setEmail("");
        setMobile("");
        setNic("");
        setDesignation("");
        setBasicsal("");
        setEmpid("");

        // Clear error messages
        setNameError("");
        setEmailError("");
        setMobileError("");
        setNicError("");
        setDesignationError("");
        setBasicsalError("");
        setEmpidError("");

        setTimeout(() => setShowAlert(false), 3000);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage("Error Adding Employee");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
  };

  return (
    <>
      <SideBar />
      <div className="form-page">
        <form className="form-container" onSubmit={sendData}>
          <div className="form-grid">
            {/* Name Field */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className={`form-control ${nameError ? "is-invalid" : ""}`}
                id="name"
                placeholder="Enter Name"
                value={name}
                onChange={handleNameInput}
                onPaste={(e) => {
                  const pasteData = e.clipboardData.getData('text');
                  if (!/^[A-Za-z\s]*$/.test(pasteData)) {
                    e.preventDefault();
                    setNameError("Cannot paste numbers or special characters");
                  }
                }}
                required
              />
              {nameError && <div className="error-message" style={{color: 'red', fontSize: '15px'}}>{nameError}</div>}
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                required
              />
              {emailError && <div className="error-message" style={{color: 'red', fontSize: '15px'}}>{emailError}</div>}
            </div>

            {/* Mobile Field */}
            <div className="mb-3">
              <label htmlFor="mobileno" className="form-label">
                Mobile No
              </label>
              <input
                type="tel"
                className={`form-control ${mobileError ? "is-invalid" : ""}`}
                id="mobileno"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={handleMobileInput}
                onPaste={(e) => {
                  const pasteData = e.clipboardData.getData('text');
                  if (!/^\d+$/.test(pasteData)) {
                    e.preventDefault();
                    setMobileError("Cannot paste non-numeric characters");
                  }
                }}
                maxLength={10}
                required
              />
              {mobileError && <div className="error-message" style={{color: 'red', fontSize: '15px'}}>{mobileError}</div>}
            </div>

            {/* NIC Field */}
            <div className="mb-3">
              <label htmlFor="nic" className="form-label">
                NIC (Numbers only)
              </label>
              <input
                type="text"
                className={`form-control ${nicError ? "is-invalid" : ""}`}
                id="nic"
                placeholder="Enter NIC (12 digits)"
                value={nic}
                onChange={handleNicInput}
                onKeyDown={(e) => {
                  // Prevent non-numeric input
                  if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  const pasteData = e.clipboardData.getData('text');
                  if (!/^\d+$/.test(pasteData)) {
                    e.preventDefault();
                    setNicError("Cannot paste non-numeric characters");
                  }
                }}
                maxLength={12}
                required
              />
              {nicError && <div className="error-message" style={{color: 'red', fontSize: '15px'}}>{nicError}</div>}
            </div>

            {/* Designation Field */}
            <div className="mb-3">
              <label htmlFor="designation" className="form-label">
                Designation
              </label>
              <input
                type="text"
                className={`form-control ${designationError ? "is-invalid" : ""}`}
                id="designation"
                placeholder="Enter Designation"
                value={designation}
                onChange={handleDesignationInput}
                onPaste={(e) => {
                  const pasteData = e.clipboardData.getData('text');
                  if (!/^[A-Za-z\s]*$/.test(pasteData)) {
                    e.preventDefault();
                    setDesignationError("Cannot paste numbers or special characters");
                  }
                }}
                required
              />
              {designationError && <div className="error-message" style={{color: 'red', fontSize: '15px'}}>{designationError}</div>}
            </div>

            {/* Basic Salary Field */}
            <div className="mb-3">
              <label htmlFor="basicsal" className="form-label">
                Basic Salary
              </label>
              <input
                type="text"
                className={`form-control ${basicsalError ? "is-invalid" : ""}`}
                id="basicsal"
                placeholder="Enter Basic Salary"
                value={basicsal}
                onChange={handleBasicsalInput}
                onPaste={(e) => {
                  const pasteData = e.clipboardData.getData('text');
                  if (!/^\d+$/.test(pasteData)) {
                    e.preventDefault();
                    setBasicsalError("Cannot paste non-numeric characters");
                  }
                }}
                required
              />
              {basicsalError && <div className="error-message" style={{color: 'red', fontSize: '15px'}}>{basicsalError}</div>}
            </div>

            {/* Employee ID Field */}
            <div className="mb-3">
              <label htmlFor="empid" className="form-label">
                Employee ID
              </label>
              <input
                type="text"
                className={`form-control ${empidError ? "is-invalid" : ""}`}
                id="empid"
                placeholder="Enter Employee ID"
                value={empid}
                onChange={handleEmpidInput}
                onPaste={(e) => {
                  const pasteData = e.clipboardData.getData('text');
                  if (!/^\d+$/.test(pasteData)) {
                    e.preventDefault();
                    setEmpidError("Cannot paste non-numeric characters");
                  }
                }}
                required
              />
              {empidError && <div className="error-message" style={{color: 'red', fontSize: '15px'}}>{empidError}</div>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Submit
          </button>
        </form>

        {/* Alert Notification */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              className="alert"
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