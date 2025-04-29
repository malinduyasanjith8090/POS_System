import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import SideBar from "../SideBar/CustomerSideBar";
import dayjs from 'dayjs';

/**
 * CheckOutProfile Component - Displays detailed customer information for checkout
 * Features:
 * - View complete customer details
 * - Print receipt functionality
 * - Export receipt as PDF
 * - Confirm checkout with dialog confirmation
 * - Animated alerts for success/error messages
 */
export default function CheckOutProfile() {
  // State management
  const [customer, setCustomer] = useState(null); // Stores current customer data
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Controls confirmation dialog visibility
  const [showAlert, setShowAlert] = useState(false); // Controls alert visibility
  const [alertMessage, setAlertMessage] = useState(""); // Stores alert message

  // Router hooks
  const { id } = useParams(); // Gets customer ID from URL
  const navigate = useNavigate(); // Navigation function

  /**
   * Fetches customer data on component mount
   */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/customer/get/${id}`)
      .then((res) => {
        const customerData = res.data.customer;
        // Format check-in date if it exists
        if (customerData.checkInDate) {
          customerData.formattedCheckInDate = dayjs(customerData.checkInDate).format('YYYY-MM-DD');
        }
        setCustomer(customerData);
      })
      .catch((err) => alert(err.message));
  }, [id]);

  /**
   * Handles printing the receipt
   */
  const handlePrint = () => {
    const printContents = document.getElementById("printable-container").innerHTML;
    const originalContents = document.body.innerHTML;

    // Create print-specific styles
    const printStyle = `
      @media print {
        body * {
          visibility: hidden;
        }
        #printable-container, #printable-container * {
          visibility: visible;
        }
        #printable-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 20px;
        }
        .no-print {
          display: none !important;
        }
      }
    `;

    // Apply print styles
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = printStyle;
    document.head.appendChild(styleSheet);

    // Print and restore original content
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  /**
   * Generates and downloads a PDF receipt
   */
  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Header
    doc.setFontSize(18);
    doc.text("Customer Check-Out Receipt", 105, yPosition, { align: "center" });
    yPosition += 15;

    // Current date
    doc.setFontSize(12);
    doc.text(`Check-Out Date: ${dayjs().format('YYYY-MM-DD')}`, 105, yPosition, { align: "center" });
    yPosition += 20;

    // Customer details
    doc.setFontSize(12);
    doc.text(`Name: ${customer?.name || 'N/A'}`, 14, yPosition);
    yPosition += 10;
    doc.text(`Contact: ${customer?.contactNumber || 'N/A'}`, 14, yPosition);
    yPosition += 10;
    doc.text(`Email: ${customer?.email || 'N/A'}`, 14, yPosition);
    yPosition += 10;
    doc.text(`Check-In Date: ${customer?.formattedCheckInDate || 'N/A'}`, 14, yPosition);
    yPosition += 10;
    doc.text(`Room: ${customer?.roomType || 'N/A'} (${customer?.roomNumber || 'N/A'})`, 14, yPosition);
    yPosition += 10;
    doc.text(`Total Amount: Rs.${customer?.price || '0'}`, 14, yPosition);
    yPosition += 20;

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for staying with us!", 105, yPosition, { align: "center" });
    yPosition += 10;
    doc.text("Cinnamon Red Colombo", 105, yPosition, { align: "center" });

    // Save PDF
    doc.save(`checkout-receipt-${customer?.name || 'customer'}.pdf`);
  };

  /**
   * Initiates checkout process
   */
  const handleCheckOut = () => {
    setShowConfirmDialog(true);
  };

  /**
   * Confirms and processes checkout
   */
  const confirmCheckOut = () => {
    axios
      .delete(`http://localhost:5000/customer/delete/${id}`)
      .then(() => {
        setAlertMessage("Customer successfully checked out");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/check-out");
        }, 3000);
      })
      .catch((err) => {
        setAlertMessage("Error checking out customer: " + err.message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
    setShowConfirmDialog(false);
  };

  /**
   * Cancels checkout process
   */
  const cancelCheckOut = () => {
    setShowConfirmDialog(false);
  };

  // Customer details configuration for rendering
  const details = [
    { label: "Name", value: customer?.name },
    { label: "Contact Number", value: customer?.contactNumber },
    { label: "Email", value: customer?.email },
    { label: "Gender", value: customer?.gender },
    { label: "Nationality", value: customer?.nationality },
    { label: "Address", value: customer?.address },
    { label: "NIC/Passport Number", value: customer?.nicPassport },
    { label: "Check-In Date", value: customer?.formattedCheckInDate },
    { label: "Room Type", value: customer?.roomType },
    { label: "Room Number", value: customer?.roomNumber },
    { label: "Price", value: `Rs.${customer?.price}` }
  ];

  return (
    <>
      {/* Sidebar navigation */}
      <SideBar/>
      
      {/* Main content container */}
      <div style={{ padding: "50px", width: "calc(100% - 250px)", boxSizing: "border-box", marginLeft: "250px" }}>
        <h1 style={{ textAlign: "left" }}>Customer Check-Out</h1>
        
        {/* Customer details section */}
        {customer ? (
          <div id="printable-container" style={containerStyle}>
            <div style={profileContainerStyle}>
              <h2 style={sectionTitleStyle}>Customer Details</h2>
              <div style={detailsGridStyle}>
                {details.map((detail) => (
                  <div style={detailItemStyle} key={detail.label}>
                    <div style={detailLabelStyle}>{detail.label}:</div>
                    <div style={detailValueStyle}>{detail.value || 'N/A'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons (hidden when printing) */}
            <div style={buttonContainerStyle} className="no-print">
              <button onClick={handlePrint} style={buttonStyle}>
                Print Receipt
              </button>
              <button onClick={handleCheckOut} style={checkOutButtonStyle}>
                Confirm Check-Out
              </button>
            </div>
          </div>
        ) : (
          <p>Loading customer data...</p>
        )}

        {/* Checkout confirmation dialog */}
        {showConfirmDialog && (
          <div style={dialogOverlayStyle}>
            <div style={dialogStyle}>
              <h3 style={dialogTitleStyle}>Confirm Check-Out</h3>
              <p>Are you sure you want to check out this customer?</p>
              <div style={dialogButtonContainerStyle}>
                <button onClick={confirmCheckOut} style={confirmButtonStyle}>
                  Yes, Check Out
                </button>
                <button onClick={cancelCheckOut} style={cancelButtonStyle}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert notification (animated) */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              style={alertStyle}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {alertMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// Styles
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "100%",
  maxWidth: "900px"
};

const profileContainerStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  padding: "25px"
};

const sectionTitleStyle = {
  color: "#800000",
  marginBottom: "20px",
  paddingBottom: "10px",
  borderBottom: "1px solid #eee"
};

const detailsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "15px"
};

const detailItemStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px"
};

const detailLabelStyle = {
  fontWeight: "bold",
  minWidth: "180px",
  color: "#555"
};

const detailValueStyle = {
  flex: 1,
  wordBreak: "break-word"
};

const buttonContainerStyle = {
  display: "flex",
  gap: "15px",
  justifyContent: "flex-end",
  marginTop: "20px"
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#800000",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px"
};

const checkOutButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#d32f2f",
  fontWeight: "bold"
};

const dialogOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const dialogStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  width: "400px",
  maxWidth: "90%"
};

const dialogTitleStyle = {
  marginTop: 0,
  color: "#800000",
  marginBottom: "15px"
};

const dialogButtonContainerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "20px"
};

const confirmButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#d32f2f",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const cancelButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#f5f5f5",
  color: "#333",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const alertStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  backgroundColor: "#800000",
  color: "white",
  padding: "12px 24px",
  borderRadius: "4px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  zIndex: 1001
};