import React, { useState, useEffect } from "react";
import { 
  Button, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  TimePicker, 
  message, 
  Table, 
  Tag,
  Card,
  Spin,
  Popconfirm
} from "antd";
import DefaultLayout from "../../components/SideBar/ResSideBar";
import moment from "moment";

const { Column } = Table;

const TablePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [form] = Form.useForm();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize tables with 15 tables (2, 4, 6, 8 seats)
  const initializeTables = () => {
    const initialTables = Array.from({ length: 15 }, (_, index) => ({
      tableNumber: index + 1,
      seats: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
      isBooked: false,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      bookingDate: null,
      bookingTime: "",
      specialRequests: "",
      _id: `table-${index + 1}`
    }));
    localStorage.setItem("restaurantTables", JSON.stringify(initialTables));
    return initialTables;
  };

  // Load tables from localStorage
  const loadTables = () => {
    const savedTables = localStorage.getItem("restaurantTables");
    if (savedTables) {
      return JSON.parse(savedTables);
    }
    return initializeTables();
  };

  // Save tables to localStorage
  const saveTables = (updatedTables) => {
    localStorage.setItem("restaurantTables", JSON.stringify(updatedTables));
    const availableTablesCount = updatedTables.filter(t => !t.isBooked).length;
    localStorage.setItem("availableTables", availableTablesCount);
  };

  // Load tables on component mount
  useEffect(() => {
    setLoading(true);
    const loadedTables = loadTables();
    setTables(loadedTables);
    setLoading(false);
  }, []);

  // Handle form submission for booking/editing
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { date, time, ...rest } = values;
      
      const updatedTables = tables.map(table => 
        table._id === selectedTable._id
          ? { 
              ...table, 
              ...rest, 
              bookingDate: date ? date.toDate() : null,
              bookingTime: time ? time.format("HH:mm") : "",
              isBooked: true 
            }
          : table
      );

      setTables(updatedTables);
      saveTables(updatedTables);
      message.success("Table booking saved successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to save booking:", error);
      message.error("Failed to save booking");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting booking
  const handleDeleteBooking = (tableId) => {
    setLoading(true);
    const updatedTables = tables.map(table => 
      table._id === tableId
        ? { 
            ...table, 
            isBooked: false, 
            customerName: "", 
            customerEmail: "", 
            customerPhone: "", 
            bookingDate: null, 
            bookingTime: "",
            specialRequests: ""
          }
        : table
    );

    setTables(updatedTables);
    saveTables(updatedTables);
    message.success("Booking deleted successfully!");
    if (tableId === selectedTable?._id) {
      setIsModalVisible(false);
    }
    setLoading(false);
  };

  // Open modal for booking/editing
  const showModal = (table) => {
    setSelectedTable(table);
    form.setFieldsValue({
      customerName: table.customerName,
      customerEmail: table.customerEmail,
      customerPhone: table.customerPhone,
      date: table.bookingDate ? moment(table.bookingDate) : null,
      time: table.bookingTime ? moment(table.bookingTime, "HH:mm") : null,
      specialRequests: table.specialRequests
    });
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Validators
  const validatePhoneNumber = (_, value) => {
    const phoneRegex = /^\d{10}$/;
    if (!value || phoneRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject("Contact number must be 10 digits");
  };

  const validateName = (_, value) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!value || nameRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject("Only alphabets and spaces allowed");
  };

  const validateEmail = (_, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || emailRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject("Invalid email address");
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  // Styles
  const styles = {
    container: {
      padding: "24px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh"
    },
    header: {
      color: "#333",
      textAlign: "center",
      marginBottom: "24px"
    },
    tableGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: "16px",
      marginBottom: "32px"
    },
    tableCard: (booked) => ({
      width: "100%",
      borderColor: booked ? "#ff4d4f" : "#d9d9d9",
      cursor: "pointer",
      transition: "all 0.3s",
      "&:hover": {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
      }
    }),
    bookedTag: {
      position: "absolute",
      top: "8px",
      right: "8px"
    },
    modalHeader: {
      backgroundColor: "#800000",
      color: "white",
      padding: "16px",
      borderRadius: "8px 8px 0 0",
      margin: "-24px -24px 0 -24px"
    },
    submitButton: {
      backgroundColor: "#800000",
      borderColor: "#800000",
      width: "100%"
    },
    deleteButton: {
      backgroundColor: "#ff4d4f",
      borderColor: "#ff4d4f",
      width: "100%",
      marginTop: "8px",
      color: "white"
    },
    actionButtons: {
      display: "flex",
      gap: "8px"
    }
  };

  // Columns for booked tables table
  const columns = [
    {
      title: 'Table',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      render: (text) => `Table ${text}`
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      key: 'seats',
      render: (text) => `${text} Seats`
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: 'Contact',
      dataIndex: 'customerPhone',
      key: 'customerPhone'
    },
    {
      title: 'Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    {
      title: 'Time',
      dataIndex: 'bookingTime',
      key: 'bookingTime'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={styles.actionButtons}>
          <Button 
            type="primary" 
            onClick={() => showModal(record)}
            style={{ backgroundColor: "#800000", borderColor: "#800000" }}
          >
            {record.isBooked ? 'Edit' : 'Book'}
          </Button>
          {record.isBooked && (
            <Popconfirm
              title="Are you sure to delete this booking?"
              onConfirm={() => handleDeleteBooking(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                danger 
                type="primary"
              >
                Delete
              </Button>
            </Popconfirm>
          )}
        </div>
      )
    }
  ];

  return (
    <DefaultLayout>
      <div style={styles.container}>
        <h1 style={styles.header}>Restaurant Table Management</h1>
        
        <Spin spinning={loading}>
          <div style={styles.tableGrid}>
            {tables.map(table => (
              <Card
                key={table._id}
                hoverable
                style={{
                  ...styles.tableCard(table.isBooked),
                  backgroundColor: table.isBooked ? '#fff2f0' : '#fff'
                }}
                onClick={() => showModal(table)}
              >
                <h3>Table {table.tableNumber}</h3>
                <p>{table.seats} Seats</p>
                {table.isBooked && (
                  <Tag color="red" style={styles.bookedTag}>Booked</Tag>
                )}
              </Card>
            ))}
          </div>

          <Card title="Bookings Summary">
            <Table
              columns={columns}
              dataSource={tables.filter(t => t.isBooked)}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
            />
          </Card>
        </Spin>

        <Modal
          title={
            <div style={styles.modalHeader}>
              {selectedTable?.isBooked 
                ? `Edit Booking - Table ${selectedTable?.tableNumber}` 
                : `Book Table ${selectedTable?.tableNumber}`}
            </div>
          }
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="customerName"
              label="Customer Name"
              rules={[
                { required: true, message: 'Please enter customer name' },
                { validator: validateName }
              ]}
            >
              <Input placeholder="Kasun Perera" />
            </Form.Item>

            <Form.Item
              name="customerEmail"
              label="Customer Email"
              rules={[
                { required: true, message: 'Please enter customer email' },
                { validator: validateEmail }
              ]}
            >
              <Input placeholder="1234@example.com" />
            </Form.Item>

            <Form.Item
              name="customerPhone"
              label="Customer Phone"
              rules={[
                { required: true, message: 'Please enter customer phone' },
                { validator: validatePhoneNumber }
              ]}
            >
              <Input placeholder="0771234567" maxLength={10} />
            </Form.Item>

            <Form.Item
              name="date"
              label="Booking Date"
              rules={[{ required: true, message: 'Please select booking date' }]}
            >
              <DatePicker 
                disabledDate={disabledDate}
                style={{ width: '100%' }}
                placeholder="Select date"
              />
            </Form.Item>

            <Form.Item
              name="time"
              label="Booking Time"
              rules={[{ required: true, message: 'Please select booking time' }]}
            >
              <TimePicker 
                format="HH:mm"
                style={{ width: '100%' }}
                placeholder="Select time"
              />
            </Form.Item>

            <Form.Item
              name="specialRequests"
              label="Special Requests"
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Any special requests or notes..." 
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={styles.submitButton}
                loading={loading}
              >
                {selectedTable?.isBooked ? 'Update Booking' : 'Confirm Booking'}
              </Button>
              {selectedTable?.isBooked && (
                <Button 
                  danger 
                  onClick={() => handleDeleteBooking(selectedTable._id)}
                  style={styles.deleteButton}
                  loading={loading}
                >
                  Cancel Booking
                </Button>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default TablePage;