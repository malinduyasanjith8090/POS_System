import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/CustomerSideBar";

export default function UpdateCustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Customer state
  const [customer, setCustomer] = useState({
    name: "",
    contactNumber: "",
    email: "",
    gender: "",
    nationality: "",
    address: "",
    nicPassport: "",
    checkInDate: "",
    roomType: "",
    roomNumber: "",
    price: "",
  });

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  // Validation state
  const [nameError, setNameError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [nationalityError, setNationalityError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [nicPassportError, setNicPassportError] = useState("");
  const [checkInDateError, setCheckInDateError] = useState("");
  const [roomTypeError, setRoomTypeError] = useState("");
  const [roomNumberError, setRoomNumberError] = useState("");
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/customer/get/${id}`)
      .then((res) => {
        const customerData = res.data.customer;
        if (customerData.checkInDate) {
          const date = new Date(customerData.checkInDate);
          const formattedDate = date.toISOString().split('T')[0];
          setCustomer({
            ...customerData,
            checkInDate: formattedDate
          });
        } else {
          setCustomer(customerData);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }, [id]);

  // Input handlers with validation
  const handleNameInput = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setCustomer(prev => ({...prev, name: value}));
      setNameError("");
    } else {
      setNameError("Name can only contain letters");
    }
  };

  const handleContactNumberInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setCustomer(prev => ({...prev, contactNumber: value}));
      setContactNumberError("");
    } else {
      setContactNumberError("Mobile must contain only numbers (10 digits)");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setCustomer(prev => ({...prev, email: value}));
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setCustomer(prev => ({...prev, gender: value}));
    setGenderError("");
  };

  const handleNationalityInput = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setCustomer(prev => ({...prev, nationality: value}));
      setNationalityError("");
    } else {
      setNationalityError("Nationality cannot contain numbers");
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setCustomer(prev => ({...prev, address: value}));
    setAddressError("");
  };

  const handleNicPassportInput = (e) => {
    const value = e.target.value;
    if (/^[0-9vV]*$/.test(value) && (value.length <= 12 && value.length >= 8)) {
      setCustomer(prev => ({...prev, nicPassport: value}));
      setNicPassportError("");
    } else {
      setNicPassportError("NIC must be 8-12 digits with optional V/v at end");
    }
  };

  const handleCheckInDateChange = (e) => {
    const value = e.target.value;
    setCustomer(prev => ({...prev, checkInDate: value}));
    setCheckInDateError("");
  };

  const handleRoomTypeInput = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setCustomer(prev => ({...prev, roomType: value}));
      setRoomTypeError("");
    } else {
      setRoomTypeError("Room type cannot contain numbers");
    }
  };

  const handleRoomNumberChange = (e) => {
    const value = e.target.value;
    setCustomer(prev => ({...prev, roomNumber: value}));
    setRoomNumberError("");
  };

  const handlePriceInput = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomer(prev => ({...prev, price: value}));
      setPriceError("");
    } else {
      setPriceError("Price must be a valid number");
    }
  };

  // Validate entire form
  function validateForm() {
    let isValid = true;

    if (!customer.name) {
      setNameError("Name is required");
      isValid = false;
    }

    if (!/^\d{10}$/.test(customer.contactNumber)) {
      setContactNumberError("Mobile must be exactly 10 digits");
      isValid = false;
    }

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(customer.email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }

    if (!customer.gender) {
      setGenderError("Gender is required");
      isValid = false;
    }

    if (!customer.nationality) {
      setNationalityError("Nationality is required");
      isValid = false;
    }

    if (!customer.address) {
      setAddressError("Address is required");
      isValid = false;
    }

    if (!/^(?:\d{9}[vV]|\d{12})$/.test(customer.nicPassport)) {
      setNicPassportError("NIC must be 9 digits with V/v or 12 digits");
      isValid = false;
    }

    if (!customer.checkInDate) {
      setCheckInDateError("Check-In Date is required");
      isValid = false;
    }

    if (!customer.roomType) {
      setRoomTypeError("Room Type is required");
      isValid = false;
    }

    if (!customer.roomNumber) {
      setRoomNumberError("Room Number is required");
      isValid = false;
    }

    if (!customer.price || customer.price <= 0) {
      setPriceError("Price must be a positive number");
      isValid = false;
    }

    return isValid;
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      axios
        .put(`http://localhost:5000/customer/update/${id}`, customer)
        .then(() => {
          setAlertMessage("Customer updated successfully!");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          navigate(`/customer/${id}`);
        })
        .catch((err) => {
          setAlertMessage("Error updating customer.");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        });
    } else {
      setAlertMessage("Please fix the form errors");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
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
    display: "block",
    marginBottom: "5px",
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

  const errorMessageStyle = {
    color: "red",
    fontSize: "14px",
    marginTop: "5px"
  };

  const buttonStyle = {
    backgroundColor: "#800000",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "15px",
    width: "100%",
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

  return (
    <>
      <SideBar/>
      <div
        style={{
          padding: "50px",
          width: "calc(100% - 250px)",
          boxSizing: "border-box",
          marginLeft: "250px",
        }}
      >
        <h1>Update Customer Profile</h1>
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
                  value={customer.name}
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

              {/* Contact Number Field */}
              <div className="form-group">
                <label htmlFor="contactNumber" style={labelStyle}>
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="Enter Mobile Number"
                  value={customer.contactNumber}
                  onChange={handleContactNumberInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^\d+$/.test(pasteData)) {
                      e.preventDefault();
                      setContactNumberError("Cannot paste non-numeric characters");
                    }
                  }}
                  maxLength={10}
                  style={contactNumberError ? invalidInputStyle : inputStyle}
                  required
                />
                {contactNumberError && <div style={errorMessageStyle}>{contactNumberError}</div>}
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
                  value={customer.email}
                  onChange={handleEmailChange}
                  style={emailError ? invalidInputStyle : inputStyle}
                  required
                />
                {emailError && <div style={errorMessageStyle}>{emailError}</div>}
              </div>

              {/* Gender Field */}
              <div className="form-group">
                <label htmlFor="gender" style={labelStyle}>
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={customer.gender}
                  onChange={handleGenderChange}
                  style={genderError ? invalidInputStyle : inputStyle}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {genderError && <div style={errorMessageStyle}>{genderError}</div>}
              </div>

              {/* Nationality Field */}
              <div className="form-group">
                <label htmlFor="nationality" style={labelStyle}>
                  Nationality
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  placeholder="Enter Nationality"
                  value={customer.nationality}
                  onChange={handleNationalityInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^[A-Za-z\s]*$/.test(pasteData)) {
                      e.preventDefault();
                      setNationalityError("Cannot paste numbers or special characters");
                    }
                  }}
                  style={nationalityError ? invalidInputStyle : inputStyle}
                  required
                />
                {nationalityError && <div style={errorMessageStyle}>{nationalityError}</div>}
              </div>

              {/* Address Field */}
              <div className="form-group">
                <label htmlFor="address" style={labelStyle}>
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter Address"
                  value={customer.address}
                  onChange={handleAddressChange}
                  style={addressError ? invalidInputStyle : inputStyle}
                  required
                />
                {addressError && <div style={errorMessageStyle}>{addressError}</div>}
              </div>

              {/* NIC/Passport Field */}
              <div className="form-group">
                <label htmlFor="nicPassport" style={labelStyle}>
                  NIC/Passport Number
                </label>
                <input
                  type="text"
                  id="nicPassport"
                  name="nicPassport"
                  placeholder="Enter NIC/Passport"
                  value={customer.nicPassport}
                  onChange={handleNicPassportInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^[0-9vV]+$/.test(pasteData)) {
                      e.preventDefault();
                      setNicPassportError("Cannot paste invalid NIC format");
                    }
                  }}
                  maxLength={12}
                  style={nicPassportError ? invalidInputStyle : inputStyle}
                  required
                />
                {nicPassportError && <div style={errorMessageStyle}>{nicPassportError}</div>}
              </div>

              {/* Check-In Date Field */}
              <div className="form-group">
                <label htmlFor="checkInDate" style={labelStyle}>
                  Check-In Date
                </label>
                <input
                  type="date"
                  id="checkInDate"
                  name="checkInDate"
                  value={customer.checkInDate}
                  onChange={handleCheckInDateChange}
                  style={checkInDateError ? invalidInputStyle : inputStyle}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {checkInDateError && <div style={errorMessageStyle}>{checkInDateError}</div>}
              </div>

              {/* Room Type Field */}
              <div className="form-group">
                <label htmlFor="roomType" style={labelStyle}>
                  Room Type
                </label>
                <input
                  type="text"
                  id="roomType"
                  name="roomType"
                  placeholder="Enter Room Type"
                  value={customer.roomType}
                  onChange={handleRoomTypeInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^[A-Za-z\s]*$/.test(pasteData)) {
                      e.preventDefault();
                      setRoomTypeError("Cannot paste numbers or special characters");
                    }
                  }}
                  style={roomTypeError ? invalidInputStyle : inputStyle}
                  required
                />
                {roomTypeError && <div style={errorMessageStyle}>{roomTypeError}</div>}
              </div>

              {/* Room Number Field */}
              <div className="form-group">
                <label htmlFor="roomNumber" style={labelStyle}>
                  Room Number
                </label>
                <input
                  type="number"
                  id="roomNumber"
                  name="roomNumber"
                  placeholder="Enter Room Number"
                  value={customer.roomNumber}
                  onChange={handleRoomNumberChange}
                  style={roomNumberError ? invalidInputStyle : inputStyle}
                  required
                />
                {roomNumberError && <div style={errorMessageStyle}>{roomNumberError}</div>}
              </div>

              {/* Price Field */}
              <div className="form-group">
                <label htmlFor="price" style={labelStyle}>
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Enter Price"
                  value={customer.price}
                  onChange={handlePriceInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^\d+\.?\d*$/.test(pasteData)) {
                      e.preventDefault();
                      setPriceError("Cannot paste non-numeric characters");
                    }
                  }}
                  step="0.01"
                  min="0.01"
                  style={priceError ? invalidInputStyle : inputStyle}
                  required
                />
                {priceError && <div style={errorMessageStyle}>{priceError}</div>}
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