import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, message, Modal, Tag } from "antd";
import { Link } from "react-router-dom";
import DefaultLayout from "../../components/SideBar/ResSideBar";
import jsPDF from "jspdf";
import dayjs from "dayjs";
import autoTable from 'jspdf-autotable';

const ResBillPage = () => {
  const [bills, setBills] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const getBills = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Res/res-bills/get-res-bills");
      if (data.success) {
        setBills(data.data);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
      message.error("Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBills();
  }, []);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/Res/res-bills/delete-res-bills/${id}`);
      message.success("Bill deleted successfully");
      getBills();
    } catch (error) {
      console.error("Error deleting bill:", error);
      message.error("Failed to delete bill");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (bill) => {
    setSelectedBill(bill);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePrint = () => {
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
    doc.text(`BILL #${selectedBill._id.slice(-6).toUpperCase()}`, 105, 60, null, null, 'center');
    
    // Customer Info
    doc.setFontSize(12);
    doc.text(`Customer: ${selectedBill.customerName}`, 20, 80);
    doc.text(`Contact: ${selectedBill.customerNumber}`, 20, 90);
    doc.text(`Date: ${dayjs(selectedBill.createdAt).format('DD/MM/YYYY hh:mm A')}`, 20, 100);
    
    // Items Table Header
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(70, 70, 70);
    doc.rect(20, 110, 170, 10, 'F');
    doc.text("Item", 25, 117);
    doc.text("Qty", 120, 117);
    doc.text("Price", 160, 117);
    
    // Items List
    doc.setTextColor(0, 0, 0);
    let yPos = 125;
    selectedBill.cartItems.forEach((item, index) => {
      doc.text(item.name, 25, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`LKR ${item.price.toFixed(2)}`, 160, yPos);
      yPos += 10;
    });
    
    // Summary
    yPos += 15;
    doc.text(`Subtotal: LKR ${selectedBill.subTotal.toFixed(2)}`, 140, yPos);
    yPos += 10;
    doc.text(`Tax (10%): LKR ${selectedBill.tax.toFixed(2)}`, 140, yPos);
    yPos += 10;
    doc.setFontSize(14);
    doc.text(`Total: LKR ${selectedBill.totalAmount.toFixed(2)}`, 140, yPos);
    yPos += 15;
    doc.setFontSize(12);
    doc.text(`Payment Method: ${selectedBill.paymentMode}`, 20, yPos);
    
    // Footer
    yPos += 30;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for dining with us!", 105, yPos, null, null, 'center');
    
    doc.save(`bill_${selectedBill._id}.pdf`);
  };

  const generateReport = () => {
    setReportLoading(true);
    
    const doc = new jsPDF();
    
    // Report Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("RESTAURANT BILLS REPORT", 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Generated on: ${dayjs().format('DD/MM/YYYY hh:mm A')}`, 105, 30, null, null, 'center');
    
    // Summary Statistics
    doc.setFontSize(14);
    doc.text("Summary Statistics", 20, 50);
    
    const totalAmount = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const cashAmount = bills
      .filter(bill => bill.paymentMode === "Cash")
      .reduce((sum, bill) => sum + bill.totalAmount, 0);
    const cardAmount = bills
      .filter(bill => bill.paymentMode === "Card")
      .reduce((sum, bill) => sum + bill.totalAmount, 0);
    const otherAmount = bills
      .filter(bill => !["Cash", "Card"].includes(bill.paymentMode))
      .reduce((sum, bill) => sum + bill.totalAmount, 0);
    
    doc.setFontSize(12);
    doc.text(`Total Bills: ${bills.length}`, 20, 65);
    doc.text(`Total Revenue: LKR ${totalAmount.toFixed(2)}`, 20, 75);
    doc.text(`Cash Payments: LKR ${cashAmount.toFixed(2)}`, 20, 85);
    doc.text(`Card Payments: LKR ${cardAmount.toFixed(2)}`, 20, 95);
    doc.text(`Other Payments: LKR ${otherAmount.toFixed(2)}`, 20, 105);
    
    // Bills Table
    doc.setFontSize(14);
    doc.text("Detailed Bills", 20, 125);
    
    const tableData = bills.map(bill => [
      `#${bill._id.slice(-6).toUpperCase()}`,
      bill.customerName,
      bill.customerNumber,
      dayjs(bill.createdAt).format('DD/MM/YYYY'),
      `LKR ${bill.totalAmount.toFixed(2)}`,
      bill.paymentMode
    ]);
    
    autoTable(doc, {
      startY: 130,
      head: [['Bill ID', 'Customer', 'Contact', 'Date', 'Amount', 'Payment']],
      body: tableData,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [70, 70, 70],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 }
      }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, null, null, 'center');
    }
    
    doc.save(`restaurant_bills_report_${dayjs().format('YYYYMMDD')}.pdf`);
    setReportLoading(false);
  };

  const columns = [
    {
      title: "Bill ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => `#${id.slice(-6).toUpperCase()}`,
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Contact",
      dataIndex: "customerNumber",
      key: "customerNumber",
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => <span>LKR {text.toFixed(2)}</span>,
    },
    {
      title: "Payment",
      dataIndex: "paymentMode",
      key: "paymentMode",
      render: (mode) => (
        <Tag color={
          mode === "Cash" ? "green" : 
          mode === "Card" ? "blue" : "orange"
        }>
          {mode}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format('DD/MM/YYYY hh:mm A'),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="action-buttons">
          <Button type="link" onClick={() => showModal(record)}>
            View
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDelete(record._id)}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="bills-container">
        <div className="bills-header">
          <h2>Restaurant Bills</h2>
          <Button 
            type="primary" 
            onClick={generateReport}
            loading={reportLoading}
          >
            Get Report
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={bills} 
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={`Bill #${selectedBill?._id.slice(-6).toUpperCase()}`}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="print" type="primary" onClick={handlePrint}>
              Print Bill
            </Button>,
            <Button key="cancel" onClick={handleCancel}>
              Close
            </Button>,
          ]}
          width={800}
        >
          {selectedBill && (
            <div className="bill-details">
              <div className="customer-info">
                <p><strong>Customer:</strong> {selectedBill.customerName}</p>
                <p><strong>Contact:</strong> {selectedBill.customerNumber}</p>
                <p><strong>Date:</strong> {dayjs(selectedBill.createdAt).format('DD/MM/YYYY hh:mm A')}</p>
                <p><strong>Payment:</strong> <Tag color={
                  selectedBill.paymentMode === "Cash" ? "green" : 
                  selectedBill.paymentMode === "Card" ? "blue" : "orange"
                }>
                  {selectedBill.paymentMode}
                </Tag></p>
              </div>

              <div className="items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBill.cartItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>LKR {item.price.toFixed(2)}</td>
                        <td>LKR {(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bill-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>LKR {selectedBill.subTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%):</span>
                  <span>LKR {selectedBill.tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Grand Total:</span>
                  <span>LKR {selectedBill.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>

        <style jsx>{`
          .bills-container {
            padding: 40px;
            background: #f4f4f4;
            min-height: 100vh;
          }
          
          .bills-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .bills-header h2 {
            margin: 0;
            font-size: 24px;
          }
          
          .action-buttons {
            display: flex;
            gap: 8px;
          }
          
          .bill-details {
            padding: 20px;
          }
          
          .customer-info {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f0f0f0;
          }
          
          .customer-info p {
            margin: 8px 0;
          }
          
          .items-table {
            margin: 20px 0;
          }
          
          .items-table table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .items-table th, .items-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
          }
          
          .items-table th {
            background-color: #f7f7f7;
            font-weight: 500;
          }
          
          .bill-summary {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
          }
          
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          
          .summary-row.total {
            font-weight: bold;
            font-size: 16px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed #ccc;
          }
        `}</style>
      </div>
    </DefaultLayout>
  );
};

export default ResBillPage;