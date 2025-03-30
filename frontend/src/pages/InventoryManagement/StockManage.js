import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaSearch, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import UpdateItems from "../InventoryManagement/UpdateItems"; // Ensure the path is correct
import logo from "../images/company.png"
import SideBar from "../../components/SideBar/InventoryManagementSidebar";

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div>
      <div style={modalOverlayStyle}>
        <div style={modalStyle}>
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this item?</p>
          <div style={buttonContainerStyle}>
            <button onClick={onConfirm} style={confirmButtonStyle}>
              Yes, Delete
            </button>
            <button onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles for the modal
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
};

const buttonContainerStyle = {
  marginTop: '20px',
};

const confirmButtonStyle = {
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '10px',
};

const cancelButtonStyle = {
  backgroundColor: '#ccc',
  color: '#000',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default function StockManage() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/inventory/stocks`);
        setItems(response.data.data);
        
        // Check for low stock items (stock < 5)
        const lowStockItems = response.data.data.filter(item => item.inStock < 5);
        if (lowStockItems.length > 0) {
          setLowStockAlerts(prev => [
            ...prev,
            ...lowStockItems.filter(newItem => 
              !prev.some(existingItem => existingItem._id === newItem._id)
            )
          ]);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        alert("Failed to fetch items: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
    
    // Set up interval for periodic checks (every 5 minutes)
    const intervalId = setInterval(fetchItems, 300000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Auto-clear alerts after 5 seconds for each alert
  useEffect(() => {
    if (lowStockAlerts.length > 0) {
      const timer = setTimeout(() => {
        setLowStockAlerts(prev => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lowStockAlerts]);

  const handleDismissAlert = (id) => {
    setLowStockAlerts(prev => prev.filter(item => item._id !== id));
  };

  const editItem = (item) => {
    navigate(`/update-items/${item}`);
    setSelectedItem(item);
    setShowUpdateForm(true);
  };

  const handleSave = async (updatedItem) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/inventory/stocks/${updatedItem.id}`, updatedItem);
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (itemId) => {
    setItemIdToDelete(itemId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      console.log("Attempting to delete item with ID:", itemIdToDelete);
      await axios.delete(`http://localhost:5000/api/inventory/stocks/${itemIdToDelete}`);
      alert("Item deleted successfully.");
      setItems(items.filter(item => item._id !== itemIdToDelete));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item: " + error.message);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      (item.itemName && item.itemName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const generateReport = () => {
    const doc = new jsPDF();

    // Add logo image
    doc.addImage(logo, "PNG", 10, 10, 25, 13);

    // Add company details
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text("Cinnomon Red Colombo", 10, 30);
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 35);
    doc.text("Contact: (123) 456-7890", 10, 40);
    doc.text("Email: info@cinnomred.com", 10, 45);

    // Add centered heading
    doc.setFontSize(18);
    doc.setTextColor(0);
    const headingY = 60;
    doc.text("Stock Management Report", doc.internal.pageSize.getWidth() / 2, headingY, { align: "center" });

    // Draw underline for heading
    const headingWidth = doc.getTextWidth("Stock Management Report");
    const underlineY = headingY + 1;
    doc.setDrawColor(0);
    doc.line(
      (doc.internal.pageSize.getWidth() / 2) - (headingWidth / 2),
      underlineY,
      (doc.internal.pageSize.getWidth() / 2) + (headingWidth / 2),
      underlineY
    );

    // Add a line break
    doc.setFontSize(12);
    doc.text("Report", doc.internal.pageSize.getWidth() / 2, headingY + 10, { align: "center" });

    // Define table columns and rows
    const columns = ["Item Name", "Category", "In Stock", "Date", "Status"];
    const rows = filteredItems.map(item => [
      item.itemName,
      item.category,
      item.inStock,
      item.date,
      item.statusOfItem,
    ]);

    // Add the table
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 80,
    });

    // Add a professional ending
    const endingY = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(10);
    doc.text("Thank you for choosing our services.", doc.internal.pageSize.getWidth() / 2, endingY, { align: "center" });
    doc.text("Contact us at: (123) 456-7890", doc.internal.pageSize.getWidth() / 2, endingY + 10, { align: "center" });

    // Draw page border
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Save the PDF
    doc.save("stock_report.pdf");
  };

  return (
    <>
      <SideBar/>
      
      {/* Low Stock Notifications */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000,
        maxWidth: '350px'
      }}>
        {lowStockAlerts.map((item) => (
          <div key={item._id} style={{
            backgroundColor: '#ff6b6b',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '4px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.3s ease-in-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaExclamationTriangle style={{ marginRight: '8px' }} />
              <span>
                Low stock: {item.itemName} (Only {item.inStock} left)
              </span>
            </div>
            <FaTimes 
              style={{ cursor: 'pointer', marginLeft: '10px' }} 
              onClick={() => handleDismissAlert(item._id)}
            />
          </div>
        ))}
      </div>

      <div>
        <h1 style={{ textAlign: "center", marginLeft: "250px", marginTop: "50px", fontSize: 32 }}>
          Manage Stock Items
        </h1>
      </div>
      <div style={containerStyle}>
        {loading ? (
          <p>Loading...</p>
        ) : showUpdateForm ? (
          <UpdateItems
            item={selectedItem}
            onSave={handleSave}
            onClose={() => setShowUpdateForm(false)}
          />
        ) : (
          <div style={tableWrapperStyle}>
            <div style={searchWrapperStyle}>
              <input
                type="text"
                placeholder="Search by Item Name or Category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
              />
              <FaSearch style={{ marginTop: "10px", marginLeft: "10px" }} />
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerStyle}>Item Name</th>
                  <th style={headerStyle}>Category</th>
                  <th style={headerStyle}>In Stock</th>
                  <th style={headerStyle}>Date</th>
                  <th style={headerStyle}>Status</th>
                  <th style={headerStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={cellStyle}>{item.itemName}</td>
                    <td style={cellStyle}>{item.category}</td>
                    <td style={cellStyle}>{item.inStock}</td>
                    <td style={cellStyle}>{new Date(item.date).toLocaleDateString()}</td>
                    <td style={cellStyle}>{item.statusOfItem}</td>
                    <td style={cellStyle}>
                      <button style={buttonStyle} onClick={() => editItem(item._id)}>
                        <FaEdit />
                      </button>
                      <button style={deleteButtonStyle} onClick={() => openDeleteModal(item._id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={generateButtonWrapperStyle}>
              <button onClick={generateReport} style={generateReportButtonStyle}>
                Generate Report
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

// Styles for the components
const containerStyle = {
  padding: "20px",
  boxSizing: "border-box",
  marginLeft: "250px",
  marginRight: "10px",
};

const tableWrapperStyle = {
  marginTop: "20px",
};

const searchWrapperStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "20px",
};

const searchInputStyle = {
  padding: "10px",
  fontSize: "14px",
  width: "300px",
  marginLeft: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const tableStyle = {
  width: "100%",
};

const headerStyle = {
  backgroundColor: "#800000",
  color: "#ffffff",
  padding: "10px",
};

const cellStyle = {
  padding: "10px",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  marginRight: "5px",
};

const deleteButtonStyle = {
  backgroundColor: "red",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
};

const generateButtonWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
};

const generateReportButtonStyle = {
  backgroundColor: "#800000",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
};