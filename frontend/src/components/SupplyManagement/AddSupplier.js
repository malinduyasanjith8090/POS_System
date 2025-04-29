import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/SupplySideBar";

const AddSupplier = () => {
  const [supplierData, setSupplierData] = useState({
    supplyId: "",
    supplierName: "",
    companyName: "",
    email: "",
    contactNumber: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [touchedFields, setTouchedFields] = useState({});

  // Live validation as user types
  useEffect(() => {
    const validateField = (name, value) => {
      let error = "";
      
      switch (name) {
        case "supplyId":
          if (!value.trim()) {
            error = "Supply ID is required";
          } else if (value.length > 20) {
            error = "Supply ID must be less than 20 characters";
          }
          break;
          
          case "supplierName":
            if (!value.trim()) {
              error = "Supplier name is required";
            } else if (value.length < 3 || value.length > 50) {
              error = "Supplier name must be between 3 and 50 characters";
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
              error = "Supplier name must contain only letters and spaces";
            }
            break;
          
        case "companyName":
          if (!value.trim()) {
            error = "Company name is required";
          } else if (value.length < 3 || value.length > 50) {
            error = "Company name must be between 3 and 50 characters";
          }
          break;
          
        case "email":
          if (!value.trim()) {
            error = "Email is required";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Please enter a valid email address";
          }
          break;
          
        case "contactNumber":
          if (!value.trim()) {
            error = "Contact number is required";
          } else if (!/^[0-9]{10}$/.test(value)) {
            error = "Please enter a valid 10-digit phone number";
          }
          break;
          
        case "description":
          if (value && value.length > 200) {
            error = "Description must be less than 200 characters";
          }
          break;
          
        default:
          break;
      }
      
      return error;
    };

    // Validate all touched fields whenever supplierData changes
    const newErrors = {};
    Object.keys(touchedFields).forEach((name) => {
      if (touchedFields[name]) {
        newErrors[name] = validateField(name, supplierData[name]);
      }
    });
    setErrors(newErrors);
  }, [supplierData, touchedFields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData({
      ...supplierData,
      [name]: value,
    });
    
    // Mark field as touched when user starts typing
    if (!touchedFields[name]) {
      setTouchedFields({
        ...touchedFields,
        [name]: true,
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    // Mark field as touched when user leaves it field
    if (!touchedFields[name]) {
      setTouchedFields({
        ...touchedFields,
        [name]: true,
      });
    }
  };

  const validateForm = () => {
    const requiredFields = {
      supplyId: "Supply ID is required",
      supplierName: "Supplier name is required",
      companyName: "Company name is required",
      email: "Email is required",
      contactNumber: "Contact number is required",
    };

    const newErrors = {};
    let isValid = true;

    // Check required fields
    Object.keys(requiredFields).forEach((field) => {
      if (!supplierData[field].trim()) {
        newErrors[field] = requiredFields[field];
        isValid = false;
      }
    });

    // Check other validations
    if (supplierData.supplyId.length > 20) {
      newErrors.supplyId = "Supply ID must be less than 20 characters";
      isValid = false;
    }
    //supplier data checked
    if (!supplierData.supplierName.trim()) {
      newErrors.supplierName = "Supplier name is required";
      isValid = false;
    } else if (supplierData.supplierName.length < 3 || supplierData.supplierName.length > 50) {
      newErrors.supplierName = "Supplier name must be between 3 and 50 characters";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(supplierData.supplierName)) {
      newErrors.supplierName = "Supplier name must contain only letters and spaces";
      isValid = false;
    }
    if (supplierData.companyName.length < 3 || supplierData.companyName.length > 50) {
      newErrors.companyName = "Company name must be fill";
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!/^[0-9]{10}$/.test(supplierData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    if (supplierData.description && supplierData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched when submitting
    const allFieldsTouched = {};
    Object.keys(supplierData).forEach((field) => {
      allFieldsTouched[field] = true;
    });
    setTouchedFields(allFieldsTouched);

    if (!validateForm()) {
      setAlertMessage("Please fix the errors in the form");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/supply/addSupply",
        supplierData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setAlertMessage("Supplier Added Successfully");
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        
        // Reset form inputs
        setSupplierData({
          supplyId: "",
          supplierName: "",
          companyName: "",
          email: "",
          contactNumber: "",
          description: "",
        });
        setErrors({});
        setTouchedFields({});
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      
      let errorMessage = "Error Adding Supplier";
      if (error.response) {
        errorMessage = error.response.data?.message || `Request failed with status ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server";
      } else {
        errorMessage = error.message;
      }

      setAlertMessage(errorMessage);
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <>
      <SideBar />
      <div style={formContainerStyle}>
        <h2>Add Supplier</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          {[
            { label: "Supply ID", name: "supplyId", type: "text" },
            { label: "Supplier Name", name: "supplierName", type: "text" },
            { label: "Company Name", name: "companyName", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Contact Number", name: "contactNumber", type: "tel" },
            { label: "Description", name: "description", type: "text", textarea: true },
          ].map(({ label, name, type, textarea }) => (
            <div key={name} style={formGroupStyle}>
              <label style={labelStyle}>{label}</label>
              {textarea ? (
                <>
                  <textarea
                    name={name}
                    value={supplierData[name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      ...inputStyle,
                      height: '80px',
                      borderColor: errors[name] ? 'red' : '#ccc'
                    }}
                    rows={3}
                  />
                  {errors[name] && (
                    <div style={errorMessageStyle}>
                      {errors[name]}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <input
                    type={type}
                    name={name}
                    value={supplierData[name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      ...inputStyle,
                      borderColor: errors[name] ? 'red' : '#ccc'
                    }}
                  />
                  {errors[name] && (
                    <div style={errorMessageStyle}>
                      {errors[name]}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          <button type="submit" style={buttonStyle}>
            Add Supplier
          </button>
        </form>
        
        <AnimatePresence>
          {showAlert && (
            <motion.div 
              style={{
                ...alertStyle,
                backgroundColor: alertType === "error" ? "#ffebee" : "#e8f5e9",
                color: alertType === "error" ? "#c62828" : "#2e7d32",
              }} 
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
};

// Styles remain the same as previous version
const formContainerStyle = {
  maxWidth: '800px',
  padding: '20px',
  marginTop: '80px',
  marginLeft: '500px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const formStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
};

const formGroupStyle = {
  flex: '1 1 45%',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '15px',
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
};

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  transition: 'border-color 0.3s',
};

const errorMessageStyle = {
  color: 'red',
  fontSize: '12px',
  marginTop: '5px',
  height: '18px',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#800000',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
  width: '100%',
};

const alertStyle = {
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

export default AddSupplier;