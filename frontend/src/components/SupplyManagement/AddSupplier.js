import React, { useState } from "react";
import axios from "axios";
import SupplyerHeader from "./SupplyerHeader";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData({
      ...supplierData,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
  
    // Validate Supply ID
    if (!supplierData.supplyId) {
      tempErrors.supplyId = "Supply ID is required";
    } else if (supplierData.supplyId.length > 20) {
      tempErrors.supplyId = "Supply ID must be less than 20 characters";
    }
  
    // Validate Supplier Name
    if (!supplierData.supplierName) {
      tempErrors.supplierName = "Supplier name is required";
    } else if (supplierData.supplierName.length < 3 || supplierData.supplierName.length > 50) {
      tempErrors.supplierName = "Supplier name must be between 3 and 50 characters";
    } else if (/^\d+$/.test(supplierData.supplierName)) {
      tempErrors.supplierName = "Supplier name must not be purely numeric";
    }
  
    // Validate Company Name
    if (!supplierData.companyName) {
      tempErrors.companyName = "Company name is required";
    } else if (supplierData.companyName.length < 3 || supplierData.companyName.length > 50) {
      tempErrors.companyName = "Company name must be between 3 and 50 characters";
    }
  
    // Validate Email
    if (!supplierData.email) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
  
    // Validate Contact Number
    if (!supplierData.contactNumber) {
      tempErrors.contactNumber = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(supplierData.contactNumber)) {
      tempErrors.contactNumber = "Please enter a valid 10-digit phone number";
    }
  
    // Validate Description
    if (supplierData.description && supplierData.description.length > 200) {
      tempErrors.description = "Description must be less than 200 characters";
    }
  
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      axios.post("http://localhost:5000/api/supply/addSupply", supplierData)
        .then((res) => {
          setAlertMessage("Supplier Added Successfully");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          setSupplierData({
            supplyId: "",
            supplierName: "",
            companyName: "",
            email: "",
            contactNumber: "",
            description: "",
          });
          setErrors({});
        })
        .catch((err) => {
          console.error(err);
          setAlertMessage("Error Adding Supplier");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        });
    }
  };

  return (
    <><SideBar/>
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
              <textarea
                name={name}
                value={supplierData[name]}
                onChange={handleChange}
                style={{...inputStyle, height: '80px'}}
                rows={3}
              />
            ) : (
              <input
                type={type}
                name={name}
                value={supplierData[name]}
                onChange={handleChange}
                style={inputStyle}
              />
            )}
            {errors[name] && <span style={errorStyle}>{errors[name]}</span>}
          </div>
        ))}
        <button type="submit" style={buttonStyle}>Add Supplier</button>
      </form>

      <AnimatePresence>
        {showAlert && (
          <motion.div style={alertStyle} initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: '0%' }} exit={{ opacity: 0, x: '100%' }}>
            {alertMessage}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </>
  );
};

// Styles (same as before)
const formContainerStyle = {
  maxWidth: '800px',
  padding: '20px',
  marginTop: '80px',
  marginLeft:'500px',
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
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
};

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#800000',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
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

const errorStyle = {
  color: 'red',
  fontSize: '12px',
};

export default AddSupplier;