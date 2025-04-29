import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SideBar from "../SideBar/CustomerSideBar";
import { Form, Input, Select, DatePicker, Button, Row, Col } from "antd";
import dayjs from 'dayjs';

const { Option } = Select;

/**
 * AddCustomer Component - Form for adding new customers to the system
 * Features:
 * - Form validation for all fields
 * - Real-time room availability checking
 * - Input restrictions for different field types
 * - Animated alerts for success/error messages
 * - Responsive layout
 */
const AddCustomer = () => {
  // Form instance for programmatic control
  const [form] = Form.useForm();
  
  // State for alert notification
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // State for room management
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isFetchingRooms, setIsFetchingRooms] = useState(false);
  const [roomType, setRoomType] = useState('');

  /**
   * Effect to fetch available rooms when roomType changes
   * Automatically resets roomNumber if the selected room becomes unavailable
   */
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (roomType) {
        setIsFetchingRooms(true);
        try {
          const response = await axios.get("http://localhost:5000/room/available", {
            params: { roomType: roomType }
          });
          setAvailableRooms(response.data);
          
          // Reset roomNumber if it's no longer available
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

  /**
   * Form submission handler
   * @param {object} values - Form values
   */
  const onFinish = async (values) => {
    try {
      // Format the checkInDate to ISO string
      const formattedValues = {
        ...values,
        checkInDate: values.checkInDate.format('YYYY-MM-DD')
      };

      // First update the room status to "Booked"
      await axios.patch(`http://localhost:5000/room/updateStatus/${formattedValues.roomNumber}`, {
        status: "Booked"
      });

      // Then add the customer
      await axios.post("http://localhost:5000/customer/add", formattedValues);

      setAlertMessage('Customer Added Successfully');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      
      // Reset form after successful submission
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

  /**
   * Form submission error handler
   * @param {object} errorInfo - Error information
   */
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  /**
   * Handler for room type selection change
   * @param {string} value - Selected room type
   */
  const handleRoomTypeChange = (value) => {
    setRoomType(value);
  };

  // Input handlers with validation

  /**
   * Prevents numbers in name input
   * @param {Event} e - Key press event
   */
  const handleNameInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && charCode !== 32) {
      e.preventDefault();
    }
  };

  /**
   * Validates name length on change
   * @param {Event} e - Change event
   */
  const handleNameChange = (e) => {
    const value = e.target.value;
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

  /**
   * Restricts NIC/Passport input to numbers and V/v
   * @param {Event} e - Key press event
   */
  const handleNICInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (!(charCode >= 48 && charCode <= 57) && charCode !== 86 && charCode !== 118) {
      e.preventDefault();
    }
  };

  /**
   * Prevents numbers in nationality input
   * @param {Event} e - Key press event
   */
  const handleNationalityInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && charCode !== 32) {
      e.preventDefault();
    }
  };

  /**
   * Restricts contact number input to digits only
   * @param {Event} e - Key press event
   */
  const handleContactNumberInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  /**
   * Restricts price input to numbers and decimal point
   * @param {Event} e - Key press event
   */
  const handlePriceInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (!(charCode >= 48 && charCode <= 57) && charCode !== 46 && charCode !== 8) {
      e.preventDefault();
    }
  };

  // Custom validation functions

  /**
   * Validates NIC/Passport format
   * @param {object} _ - Rule object
   * @param {string} value - Input value
   */
  const validateNIC = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input NIC/Passport number!'));
    }
    
    if (value.length < 8 || value.length > 12) {
      return Promise.reject(new Error('NIC must be between 8-12 characters!'));
    }
    
    if (!/^[0-9]+$/.test(value) && !/^[0-9]+[Vv]$/.test(value)) {
      return Promise.reject(new Error('NIC can only contain numbers or end with V/v!'));
    }
    
    return Promise.resolve();
  };

  /**
   * Validates price input
   * @param {object} _ - Rule object
   * @param {string} value - Input value
   */
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

  /**
   * Validates name input
   * @param {object} _ - Rule object
   * @param {string} value - Input value
   */
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

  /**
   * Validates contact number format
   * @param {object} _ - Rule object
   * @param {string} value - Input value
   */
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
      {/* Sidebar navigation */}
      <SideBar />
      
      {/* Main form container */}
      <div style={formContainerStyle}>
        <h2>Add Customer</h2>
        
        {/* Customer form */}
        <Form
          form={form}
          name="addCustomer"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          {/* Two-column layout */}
          <Row gutter={16}>
            {/* Left column fields */}
            <Col span={12}>
              {/* Name field */}
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

              {/* Contact number field */}
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

              {/* Email field */}
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input the email!" },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input />
              </Form.Item>

              {/* Gender selection */}
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

              {/* Nationality field */}
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

            {/* Right column fields */}
            <Col span={12}>
              {/* Address field */}
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please input the address!" }]}
              >
                <Input />
              </Form.Item>

              {/* NIC/Passport field */}
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

              {/* Check-in date picker */}
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

              {/* Price field */}
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

              {/* Room type selection */}
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

              {/* Room number selection (dynamic based on room type) */}
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

          {/* Submit button */}
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

        {/* Animated alert notification */}
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

// Style definitions
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