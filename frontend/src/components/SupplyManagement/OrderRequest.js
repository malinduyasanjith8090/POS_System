import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Select, Input, message } from "antd";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "../../images/company.png";
import SideBar from "../SideBar/SupplySideBar";

const { Option } = Select;
const { Search } = Input;

const OrderRequest = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/inventory/orders/");
        if (response.data && Array.isArray(response.data.data)) {
          setOrders(response.data.data);
          setFilteredOrders(response.data.data); // Initialize filtered orders
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = orders.filter(order => {
        return (
          (order.orderName && order.orderName.toLowerCase().includes(searchTermLower)) ||
          (order.supplier && order.supplier.toLowerCase().includes(searchTermLower)) ||
          (order.status && order.status.toLowerCase().includes(searchTermLower)) ||
          (order.noOfItems && order.noOfItems.toString().includes(searchTermLower)) ||
          (order.date && new Date(order.date).toLocaleDateString().toLowerCase().includes(searchTermLower))
        );
      });
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

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

  // Generate PDF for orders
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.addImage(logo, "PNG", 150, 10, 25, 13);
    doc.setFontSize(10);
    doc.text("Your Company Name", 10, 10);
    doc.text("Address: 1234 Event St, City, State, ZIP", 10, 15);
    doc.text("Contact: (123) 456-7890", 10, 20);
    doc.text("Email: info@yourcompany.com", 10, 25);
    doc.setFontSize(18);
    doc.text("Orders List", doc.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    });

    const headers = [
      "Order Name",
      "Supplier",
      "Date",
      "Number of Items",
      "Status"
    ];
    const data = filteredOrders.map((order) => [
      order.orderName || 'N/A',
      order.supplier || 'N/A',
      order.date ? new Date(order.date).toLocaleDateString() : 'N/A',
      order.noOfItems || 'N/A',
      order.status || 'N/A'
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

    doc.save("orders_report.pdf");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const columns = [
    {
      title: 'Order Name',
      dataIndex: 'orderName',
      key: 'orderName',
      render: (text) => text || '-'
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (text) => text || '-'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => date ? new Date(date).toLocaleDateString() : '-'
    },
    {
      title: 'Number of Items',
      dataIndex: 'noOfItems',
      key: 'noOfItems',
      render: (text) => text || '-'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => text || '-'
    },
    {
      title: 'Update Status',
      key: 'action',
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={(value) => handleStatusChange(record._id, value)}
          style={{ width: 150 }}
        >
          <Option value="Pending">Pending</Option>
          <Option value="In Process">In Process</Option>
          <Option value="Order Received">Order Received</Option>
          <Option value="Delivered">Delivered</Option>
        </Select>
      ),
    },
  ];

  return (
    <>
      <SideBar />
      <div style={containerStyle}>
        <h1 style={headerStyle}>Order Requests</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <Search
            placeholder="Search orders..."
            allowClear
            enterButton
            style={{ width: 400 }}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={value => setSearchTerm(value)}
          />
          <Button
            type="primary"
            onClick={generatePDF}
            style={{ backgroundColor: "#800000" }}
          >
            Generate PDF Report
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="_id"
          style={tableStyle}
          locale={{
            emptyText: (
              <div style={{ padding: "20px", textAlign: "center" }}>
                {searchTerm ? "No matching orders found" : "No orders found"}
              </div>
            )
          }}
        />
      </div>
    </>
  );
};

// Styles (can be moved to a separate CSS file)
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
  marginBottom: "20px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

export default OrderRequest;