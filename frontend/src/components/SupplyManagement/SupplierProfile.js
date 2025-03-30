import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Form, Input, Select, message } from "antd";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "../../images/company.png";
import SideBar from "../SideBar/SupplySideBar";

const { Option } = Select;

const SupplierProfile = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch suppliers data
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/supply`);
        // Ensure all fields have default values
        const sanitizedSuppliers = response.data.map(supplier => ({
          _id: supplier._id || '',
          supplyId: supplier.supplyId || '',
          supplierName: supplier.supplierName || '',
          companyName: supplier.companyName || '',
          email: supplier.email || '',
          contactNumber: supplier.contactNumber || '',
          description: supplier.description || ''
        }));
        setSuppliers(sanitizedSuppliers);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/inventory/orders/");
        if (response.data && Array.isArray(response.data.data)) {
          setOrders(response.data.data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      }
    };

    fetchOrders();
  }, []);

  // Handle updating supplier
  const handleUpdate = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/supply/update/${editItem._id}`, values);
      message.success("Supplier updated successfully!");
      setModalVisible(false);
      setEditItem(null);
      // Refresh suppliers
      const response = await axios.get(`http://localhost:5000/api/supply`);
      setSuppliers(response.data);
    } catch (error) {
      message.error("Failed to update supplier.");
      console.error("Update error:", error);
    }
  };

  // Handle deleting supplier
  const handleDelete = async (supplierId) => {
    try {
      if (window.confirm("Are you sure you want to delete this supplier?")) {
        await axios.delete(`http://localhost:5000/api/supply/delete/${supplierId}`);
        message.success("Supplier deleted successfully!");
        const updatedSuppliers = suppliers.filter((supplier) => supplier._id !== supplierId);
        setSuppliers(updatedSuppliers);
      }
    } catch (error) {
      message.error("Failed to delete supplier.");
      console.error("Delete error:", error);
    }
  };

  // Handle editing supplier
  const openEditModal = (supplier) => {
    setEditItem(supplier);
    setModalVisible(true);
  };

  // Generate PDF for suppliers
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.addImage(logo, "PNG", 150, 10, 25, 13);
    doc.setFontSize(10);
    doc.text("Your Company Name", 10, 10);
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 15);
    doc.text("Contact: (123) 456-7890", 10, 20);
    doc.text("Email: info@yourcompany.com", 10, 25);
    doc.setFontSize(18);
    doc.text("Suppliers List", doc.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    });

    const headers = [
      "Supplier ID",
      "Supplier Name",
      "Company Name",
      "Email",
      "Contact Number",
      "Description",
    ];
    const data = suppliers.map((supplier) => [
      supplier.supplyId || 'N/A',
      supplier.supplierName || 'N/A',
      supplier.companyName || 'N/A',
      supplier.email || 'N/A',
      supplier.contactNumber || 'N/A',
      supplier.description || 'N/A'
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 40,
      styles: {
        fontSize: 10,
      },
    });

    const endingY = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(10);
    doc.text(
      "Thank you for choosing our services.",
      doc.internal.pageSize.getWidth() / 2,
      endingY,
      { align: "center" }
    );
    doc.text(
      "Contact us at: (123) 456-7890",
      doc.internal.pageSize.getWidth() / 2,
      endingY + 10,
      { align: "center" }
    );

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    doc.save("suppliers_report.pdf");
  };

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    const searchFields = [
      supplier.supplyId,
      supplier.supplierName,
      supplier.companyName,
      supplier.email,
      supplier.contactNumber,
      supplier.description
    ].filter(field => field); // Remove undefined/null fields

    return searchFields.some(
      field => field.toString().toLowerCase().includes(searchTermLower)
    );
  });

  // Handle updating order status
  const handleStatusChange = (orderId, newStatus) => {
    axios
      .put(`http://localhost:5000/api/inventory/orders/updateStatus/${orderId}`, { status: newStatus })
      .then((response) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        message.success("Order status updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        message.error(
          "Failed to update status: " + (error.response?.data?.message || error.message)
        );
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <SideBar />
      <div style={containerStyle}>
        {/* Suppliers Section */}
        <h1 style={headerStyle}>Suppliers List</h1>

        {/* Search Input */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <Input
            placeholder="Search Suppliers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "300px" }}
          />
          <Button
            type="primary"
            onClick={generatePDF}
            style={{ marginLeft: "10px", backgroundColor: "#800000" }}
          >
            Generate PDF
          </Button>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Supplier ID</th>
              <th style={tableHeaderStyle}>Supplier Name</th>
              <th style={tableHeaderStyle}>Company Name</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Contact Number</th>
              <th style={tableHeaderStyle}>Description</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No Suppliers Found
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td style={tableDataStyle}>{supplier.supplyId || '-'}</td>
                  <td style={tableDataStyle}>{supplier.supplierName || '-'}</td>
                  <td style={tableDataStyle}>{supplier.companyName || '-'}</td>
                  <td style={tableDataStyle}>{supplier.email || '-'}</td>
                  <td style={tableDataStyle}>{supplier.contactNumber || '-'}</td>
                  <td style={tableDataStyle}>{supplier.description || '-'}</td>
                  <td style={tableDataStyle}>
                    <div style={buttonContainerStyle}>
                      <Button
                        type="primary"
                        onClick={() => openEditModal(supplier)}
                        style={{ ...actionButtonStyle, backgroundColor: "green" }}
                      >
                        Update
                      </Button>
                      <Button
                        danger
                        onClick={() => handleDelete(supplier._id)}
                        style={{ ...actionButtonStyle, backgroundColor: "red" }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Edit Supplier Modal */}
        {modalVisible && (
          <Modal
            title="Edit Supplier"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            destroyOnClose
          >
            <Form 
              initialValues={editItem || {}} 
              onFinish={handleUpdate} 
              layout="vertical"
            >
              <Form.Item
                name="supplyId"
                label="Supplier ID"
                rules={[{ required: true, message: "Please enter the supplier ID!" }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="supplierName"
                label="Supplier Name"
                rules={[
                  { required: true, message: "Please enter the supplier name!" },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error("Please enter the supplier name!"));
                      }
                      if (/^\d+$/.test(value)) {
                        return Promise.reject(new Error("Supplier name must not be a number!"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[{ required: true, message: "Please enter the company name!" }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter the email!" },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="contactNumber"
                label="Contact Number"
                rules={[
                  { required: true, message: "Please enter the contact number!" },
                  { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number!" }
                ]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="Description"
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
                <Button onClick={() => setModalVisible(false)} style={{ marginLeft: "10px" }}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Modal>
        )}

        {/* Orders Section */}
        <h1 style={{ ...headerStyle, marginTop: "40px" }}>All Orders</h1>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Order Name</th>
              <th style={tableHeaderStyle}>Supplier</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Number of Items</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td style={tableDataStyle}>{order.orderName || '-'}</td>
                  <td style={tableDataStyle}>{order.supplier || '-'}</td>
                  <td style={tableDataStyle}>
                    {order.date ? new Date(order.date).toLocaleDateString() : '-'}
                  </td>
                  <td style={tableDataStyle}>{order.noOfItems || '-'}</td>
                  <td style={tableDataStyle}>{order.status || '-'}</td>
                  <td style={tableDataStyle}>
                    <Select
                      value={order.status}
                      onChange={(value) => handleStatusChange(order._id, value)}
                      style={{ width: "150px" }}
                    >
                      <Option value="Pending">Pending</Option>
                      <Option value="In Process">In Process</Option>
                      <Option value="Order Received">Order Received</Option>
                      <Option value="Delivered">Delivered</Option>
                    </Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

// Styles
const containerStyle = {
  padding: "20px",
  width: "calc(100% - 260px)",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
  marginLeft: "260px",
};

const headerStyle = {
  fontSize: "24px",
  textAlign: "left",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const tableHeaderStyle = {
  backgroundColor: "#800000",
  color: "#ffffff",
  padding: "10px",
};

const tableDataStyle = {
  border: "1px solid #dddddd",
  padding: "8px",
  textAlign: "left",
};

const actionButtonStyle = {
  width: "80px",
  display: "inline-block",
  textAlign: "center",
  padding: "6px 0",
  borderRadius: "4px",
  color: "#ffffff",
  cursor: "pointer",
};

const buttonContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

export default SupplierProfile;