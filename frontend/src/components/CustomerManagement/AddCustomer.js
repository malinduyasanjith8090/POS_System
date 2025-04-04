import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/CustomerSideBar";
import { Form, Input, Select, DatePicker, Button, Row, Col } from "antd";
import dayjs from 'dayjs';

const { Option } = Select;

const AddCustomer = () => {
  const [form] = Form.useForm();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isFetchingRooms, setIsFetchingRooms] = useState(false);
  const [roomType, setRoomType] = useState('');

  // Fetch available rooms whenever roomType changes
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (roomType) {
        setIsFetchingRooms(true);
        try {
          const response = await axios.get("http://localhost:5000/room/available", {
            params: { roomType: roomType }
          });
          setAvailableRooms(response.data);
          // Reset roomNumber if it's no longer valid
          const currentRoomNumber = form.getFieldValue('roomNumber');
          if (currentRoomNumber && !response.data.includes(currentRoomNumber)) {
            form.setFieldsValue({ roomNumber: undefined });
          }
        } catch (error) {
          console.error("Error fetching available rooms:", error);
          setAvailableRooms([]);
          form.setFieldsValue({ roomNumber: undefined });
          setAlertMessage('Error fetching available rooms');
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        } finally {
          setIsFetchingRooms(false);
        }
      } else {
        setAvailableRooms([]);
        form.setFieldsValue({ roomNumber: undefined });
      }
    };

    fetchAvailableRooms();
  }, [roomType, form]);

  const onFinish = async (values) => {
    try {
      // Format the checkInDate to ISO string
      const formattedValues = {
        ...values,
        checkInDate: values.checkInDate.format('YYYY-MM-DD')
      };

      // Optionally, you can first update the room status to "Booked"
      await axios.patch(`http://localhost:5000/room/updateStatus/${formattedValues.roomNumber}`, {
        status: "Booked"
      });

      // Then, add the customer
      await axios.post("http://localhost:5000/customer/add", formattedValues);

      setAlertMessage('Customer Added Successfully');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      
      // Reset form
      form.resetFields();
      setAvailableRooms([]);
      setRoomType('');
    } catch (error) {
      console.error("Error adding customer:", error);
      setAlertMessage('Error Adding Customer');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleRoomTypeChange = (value) => {
    setRoomType(value);
  };

  // Prevent numbers and single character in name input
  const handleNameInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    // Allow only letters and spaces
    if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && charCode !== 32) {
      e.preventDefault();
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    // Prevent single character names
    if (value.length === 1) {
      form.setFields([{
        name: 'name',
        errors: ['Name must be at least 2 characters long']
      }]);
    } else {
      form.setFields([{
        name: 'name',
        errors: []
      }]);
    }
  };

  // Format NIC/Passport input (only numbers and V/v at the end)
  const handleNICInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    // Allow only numbers (0-9) and V/v (86, 118)
    if (!(charCode >= 48 && charCode <= 57) && charCode !== 86 && charCode !== 118) {
      e.preventDefault();
    }
  };

  // Prevent numbers in nationality input
  const handleNationalityInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    // Allow only letters and spaces
    if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && charCode !== 32) {
      e.preventDefault();
    }
  };

  // Prevent non-digit input in contact number
  const handleContactNumberInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    // Only allow numbers (0-9)
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  // Prevent non-digit input in price field
  const handlePriceInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    // Allow numbers (0-9), decimal point (46), and backspace (8)
    if (!(charCode >= 48 && charCode <= 57) && charCode !== 46 && charCode !== 8) {
      e.preventDefault();
    }
  };

  // Custom validation for NIC/Passport
  const validateNIC = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input NIC/Passport number!'));
    }
    
    // Check length (8-12 characters)
    if (value.length < 8 || value.length > 12) {
      return Promise.reject(new Error('NIC must be between 8-12 characters!'));
    }
    
    // Check if it contains only digits or ends with V/v
    if (!/^[0-9]+$/.test(value) && !/^[0-9]+[Vv]$/.test(value)) {
      return Promise.reject(new Error('NIC can only contain numbers or end with V/v!'));
    }
    
    return Promise.resolve();
  };

  // Custom validation for price
  const validatePrice = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input the price!'));
    }
    
    if (value <= 0) {
      return Promise.reject(new Error('Price must be greater than 0!'));
    }
    
    if (isNaN(value)) {
      return Promise.reject(new Error('Price must be a number!'));
    }
    
    return Promise.resolve();
  };

  // Custom validation for name (minimum one word and at least 2 characters)
  const validateName = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input the customer name!'));
    }
    
    if (/\d/.test(value)) {
      return Promise.reject(new Error('Name cannot contain numbers'));
    }
    
    if (value.length < 2) {
      return Promise.reject(new Error('Name must be at least 2 characters long'));
    }
    
    if (value.trim().split(/\s+/).length < 1) {
      return Promise.reject(new Error('Name must contain at least one word!'));
    }
    
    return Promise.resolve();
  };

  // Custom validation for contact number
  const validateContactNumber = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input the contact number!'));
    }
    
    if (!/^\d{10}$/.test(value)) {
      return Promise.reject(new Error('Please enter a valid 10-digit number!'));
    }
    
    return Promise.resolve();
  };

  return (
    <>
      <SideBar />
      <div style={formContainerStyle}>
        <h2>Add Customer</h2>
        <Form
          form={form}
          name="addCustomer"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Row gutter={16}>
            {/* Left Column */}
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { validator: validateName }
                ]}
              >
                <Input 
                  onKeyPress={handleNameInput}
                  onChange={handleNameChange}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (/\d/.test(pasteData)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                name="contactNumber"
                label="Contact Number"
                rules={[
                  { validator: validateContactNumber }
                ]}
              >
                <Input 
                  maxLength={10}
                  onKeyPress={handleContactNumberInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^\d+$/.test(pasteData)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input the email!" },
                  {
                    type: 'email',
                    message: 'Please enter a valid email!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="nationality"
                label="Nationality"
                rules={[
                  { required: true, message: "Please input the nationality!" },
                  {
                    validator: (_, value) => 
                      value && /\d/.test(value) 
                        ? Promise.reject(new Error('Nationality cannot contain numbers')) 
                        : Promise.resolve()
                  }
                ]}
              >
                <Input 
                  onKeyPress={handleNationalityInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (/\d/.test(pasteData)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>

            {/* Right Column */}
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please input the address!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="nicPassport"
                label="NIC/Passport Number"
                rules={[
                  { validator: validateNIC }
                ]}
              >
                <Input 
                  onKeyPress={handleNICInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^[0-9]*[Vv]?$/.test(pasteData)) {
                      e.preventDefault();
                    }
                  }}
                  maxLength={12}
                />
              </Form.Item>

              <Form.Item
                name="checkInDate"
                label="Check-In Date"
                rules={[{ required: true, message: "Please select check-in date!" }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>

              <Form.Item
                name="price"
                label="Price"
                rules={[
                  { validator: validatePrice }
                ]}
              >
                <Input 
                  type="number" 
                  min="0.01" 
                  step="0.01"
                  onKeyPress={handlePriceInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^[0-9.]+$/.test(pasteData)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                name="roomType"
                label="Room Type"
                rules={[{ required: true, message: "Please select room type!" }]}
              >
                <Select 
                  placeholder="Select room type"
                  onChange={handleRoomTypeChange}
                >
                  <Option value="Single">Single</Option>
                  <Option value="Double">Double</Option>
                  <Option value="VIP">VIP</Option>
                  <Option value="King">King</Option>
                  <Option value="Flex">Flex</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="roomNumber"
                label="Room Number"
                rules={[{ required: true, message: "Please select room number!" }]}
              >
                <Select 
                  placeholder={
                    isFetchingRooms 
                      ? "Fetching available rooms..." 
                      : "Select room number"
                  }
                  disabled={!roomType || isFetchingRooms}
                  notFoundContent={
                    roomType && !isFetchingRooms ? "No rooms available" : null
                  }
                >
                  {availableRooms.map((roomNumber) => (
                    <Option key={roomNumber} value={roomNumber}>
                      {roomNumber}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              style={buttonStyle}
            >
              Add Customer
            </Button>
          </Form.Item>
        </Form>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              style={alertStyle}
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

// Styles
const formContainerStyle = {
  maxWidth: '800px',
  padding: '20px',
  marginTop: "20px",
  marginLeft: "480px",
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const buttonStyle = {
  backgroundColor: '#800000',
  borderColor: '#800000',
  marginTop: '20px',
  color: '#fff',
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

export default AddCustomer;