import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import DefaultLayout from "../../components/SideBar/ResSideBar";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Table, Space, message, Tag } from "antd";
import { DeleteOutlined, PrinterOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import jsPDF from "jspdf";
import dayjs from "dayjs";

const QRCodeGeneratorPage = ({ orders, setOrders }) => {
  const [tables] = useState([
    { id: 1, tableNumber: "1", name: "Table 1" },
    { id: 2, tableNumber: "2", name: "Table 2" },
    { id: 3, tableNumber: "3", name: "Table 3" },
    { id: 4, tableNumber: "4", name: "Table 4" },
    { id: 5, tableNumber: "5", name: "Table 5" },
    { id: 6, tableNumber: "6", name: "Table 6" },
    { id: 7, tableNumber: "7", name: "Table 7" },
    { id: 8, tableNumber: "8", name: "Table 8" },
    { id: 9, tableNumber: "9", name: "Table 9" },
    { id: 10, tableNumber: "10", name: "Table 10" },
    { id: 11, tableNumber: "11", name: "Table 11" },
    { id: 12, tableNumber: "12", name: "Table 12" },
    { id: 13, tableNumber: "13", name: "Table 13" },
    { id: 14, tableNumber: "14", name: "Table 14" },
    { id: 15, tableNumber: "15", name: "Table 15" },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBillVisible, setIsBillVisible] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchOrders = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      setLoading(true);
      
      const { data } = await axios.get("/api/Res/res-orders");
      
      if (data && Array.isArray(data)) {
        const processedOrders = data.map(order => ({
          ...order,
          key: order._id,
          cartItems: order.cartItems || [],
          createdAt: order.createdAt || new Date().toISOString(),
          grandTotal: parseFloat(order.grandTotal) || 0,
          subTotal: parseFloat(order.subTotal) || 0,
          tax: parseFloat(order.tax) || 0
        }));
        
        setOrders(processedOrders);
        setFilteredOrders(processedOrders);
      } else {
        message.error("Invalid data format received from server");
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders. Please try again.");
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
      dispatch({ type: "HIDE_LOADING" });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const generateQRCodeContent = (tableNumber) => {
    return `https://cea0-175-157-109-98.ngrok-free.app/menu?tableNo=${tableNumber}`;
  };

  const handleQRCodeScan = (tableNumber) => {
    navigate(`/menu?tableNo=${tableNumber}`);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleGetBill = (order) => {
    setSelectedOrder(order);
    setIsBillVisible(true);
  };

  const handlePrintBill = () => {
    if (!selectedOrder) return;

    try {
      const doc = new jsPDF();
      
      // Restaurant Logo and Header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("RESTAURANT NAME", 105, 20, null, null, 'center');
      doc.setFontSize(12);
      doc.text("123 Restaurant Street, City", 105, 30, null, null, 'center');
      doc.text("Phone: +94 123 456 789", 105, 40, null, null, 'center');
      
      // Bill Details
      doc.setFontSize(16);
      doc.text(`BILL #${selectedOrder._id.slice(-6).toUpperCase()}`, 105, 60, null, null, 'center');
      
      // Customer Info
      doc.setFontSize(12);
      doc.text(`Customer: ${selectedOrder.customerName || 'N/A'}`, 20, 80);
      doc.text(`Contact: ${selectedOrder.contactNumber || 'N/A'}`, 20, 90);
      doc.text(`Date: ${dayjs(selectedOrder.createdAt).format('DD/MM/YYYY hh:mm A')}`, 20, 100);
      doc.text(`Table No: ${selectedOrder.tableNo || 'N/A'}`, 20, 110);
      
      // Items Table Header
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(70, 70, 70);
      doc.rect(20, 120, 170, 10, 'F');
      doc.text("Item", 25, 127);
      doc.text("Qty", 120, 127);
      doc.text("Price", 160, 127);
      
      // Items List
      doc.setTextColor(0, 0, 0);
      let yPos = 135;
      (selectedOrder.cartItems || []).forEach((item, index) => {
        doc.text(item.name || 'Unnamed Item', 25, yPos);
        doc.text((item.quantity || 0).toString(), 120, yPos);
        doc.text(`LKR ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}`, 160, yPos);
        yPos += 10;
      });
      
      // Summary
      yPos += 15;
      doc.text(`Subtotal: LKR ${(selectedOrder.subTotal || 0).toFixed(2)}`, 140, yPos);
      yPos += 10;
      doc.text(`Tax (10%): LKR ${(selectedOrder.tax || 0).toFixed(2)}`, 140, yPos);
      yPos += 10;
      doc.setFontSize(14);
      doc.text(`Total: LKR ${(selectedOrder.grandTotal || 0).toFixed(2)}`, 140, yPos);
      
      // Footer
      yPos += 30;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for dining with us!", 105, yPos, null, null, 'center');
      
      doc.save(`bill_${selectedOrder._id}.pdf`);

      handleCompleteOrder(selectedOrder._id);
    } catch (error) {
      console.error("Error generating PDF:", error);
      message.error("Failed to generate bill PDF");
    }
  };

  const handleCompleteOrder = async (id) => {
    try {
      setLoading(true);
      await axios.patch(`/api/Res/res-orders/${id}/status`, { status: "Completed" });
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === id ? { ...order, status: "Completed" } : order
        )
      );
      
      setFilteredOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === id ? { ...order, status: "Completed" } : order
        )
      );
      
      message.success("Order completed successfully!");
      setIsBillVisible(false);
    } catch (error) {
      console.error("Error completing order:", error);
      message.error("Failed to complete order");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      if (typeof id !== 'string') {
        throw new Error('Invalid ID format');
      }
      
      setLoading(true);
      await axios.delete(`/api/Res/res-orders/${id}`);
      
      setOrders(prevOrders => prevOrders.filter(order => order._id !== id));
      setFilteredOrders(prevOrders => prevOrders.filter(order => order._id !== id));
      
      message.success("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      message.error("Failed to delete order");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Bill ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => `#${id.slice(-6).toUpperCase()}`,
    },
    {
      title: "Table No",
      dataIndex: "tableNo",
      key: "tableNo",
    },
    {
      title: "Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Order Items",
      dataIndex: "cartItems",
      key: "cartItems",
      render: (cartItems = []) => (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.name || 'Unnamed Item'} (x{item.quantity || 0}) - LKR {(item.price || 0) * (item.quantity || 0)}
            </li>
          ))}
          {cartItems.length === 0 && <li>No items</li>}
        </ul>
      ),
    },
    {
      title: "Total",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (grandTotal) => `LKR ${grandTotal || 0}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={
          status === 'Pending' ? 'orange' :
          status === 'Completed' ? 'green' :
          status === 'Cancelled' ? 'red' : 'blue'
        }>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Preparing', value: 'Preparing' },
        { text: 'Ready', value: 'Ready' },
        { text: 'Completed', value: 'Completed' },
        { text: 'Cancelled', value: 'Cancelled' }
      ],
      onFilter: (value, record) => record.status === value,
      width: 120
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={() => handleGetBill(record)}
            disabled={record.status === "Completed"}
          >
            Get Bill
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              if (typeof record._id === 'string') {
                handleDeleteOrder(record._id);
              } else {
                message.error('Invalid order ID format');
                console.error('Invalid ID:', record._id);
              }
            }}
            danger
            loading={loading}
          />
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div style={styles.pageContainer}>
        <h1 style={styles.pageTitle}>QR Code Orders</h1>
        <Button type="primary" onClick={showModal} style={styles.viewQRButton}>
          View QR Codes
        </Button>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          style={{ marginTop: "20px" }}
          loading={loading}
        />

        <Modal
          title="QR Codes for Tables"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="close" onClick={handleCancel} style={styles.closeButton}>
              Close
            </Button>,
          ]}
          width="80%"
          bodyStyle={{ textAlign: "center", padding: "20px" }}
        >
          <div style={styles.modalContent}>
            {tables.map((table) => (
              <div 
                key={table.id} 
                style={styles.tableCard} 
                onClick={() => handleQRCodeScan(table.tableNumber)}
              >
                <h3 style={styles.tableName}>{table.name}</h3>
                <QRCodeCanvas 
                  value={generateQRCodeContent(table.tableNumber)} 
                  size={150} 
                  style={styles.qrCode}
                />
                <p style={styles.tableNumber}>Table {table.tableNumber}</p>
              </div>
            ))}
          </div>
        </Modal>

        <Modal
          title={`Bill #${selectedOrder?._id.slice(-6).toUpperCase()}`}
          visible={isBillVisible}
          onCancel={() => setIsBillVisible(false)}
          footer={[
            <Button 
              key="print" 
              type="primary" 
              icon={<PrinterOutlined />} 
              onClick={handlePrintBill}
              loading={loading}
            >
              Print Bill
            </Button>,
            <Button 
              key="close" 
              onClick={() => setIsBillVisible(false)}
              disabled={loading}
            >
              Close
            </Button>,
          ]}
          width={800}
        >
          {selectedOrder && (
            <div className="bill-details">
              <div className="customer-info">
                <p><strong>Customer:</strong> {selectedOrder.customerName || 'N/A'}</p>
                <p><strong>Contact:</strong> {selectedOrder.contactNumber || 'N/A'}</p>
                <p><strong>Date:</strong> {dayjs(selectedOrder.createdAt).format('DD/MM/YYYY hh:mm A')}</p>
                <p><strong>Table No:</strong> {selectedOrder.tableNo || 'N/A'}</p>
              </div>

              <div className="items-table">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f7f7f7' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Item</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Qty</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.cartItems || []).map((item, index) => (
                      <tr key={index}>
                        <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>{item.name || 'Unnamed Item'}</td>
                        <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>{item.quantity || 0}</td>
                        <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>LKR {(item.price || 0) * (item.quantity || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bill-summary" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Subtotal:</span>
                  <span>LKR {selectedOrder.subTotal || 0}</span>
                </div>
                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Tax (10%):</span>
                  <span>LKR {selectedOrder.tax || 0}</span>
                </div>
                <div className="summary-row total" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ccc' }}>
                  <span>Grand Total:</span>
                  <span>LKR {selectedOrder.grandTotal || 0}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

const styles = {
  pageContainer: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  },
  pageTitle: {
    color: "#333",
    textAlign: "center",
    marginBottom: "20px"
  },
  viewQRButton: {
    marginBottom: "20px",
    backgroundColor: "#1890ff",
    borderColor: "#1890ff"
  },
  closeButton: {
    backgroundColor: "#1890ff",
    color: "#fff",
    borderRadius: "8px"
  },
  modalContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  tableCard: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    transition: "transform 0.2s ease-in-out",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.05)"
    }
  },
  tableName: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  tableNumber: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#555",
  },
  qrCode: {
    margin: "0 auto",
    display: "block"
  }
};

export default QRCodeGeneratorPage;