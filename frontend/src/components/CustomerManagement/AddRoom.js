import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import SideBar from "../SideBar/CustomerSideBar";
import { Form, Input, Select, Button, Row, Col } from 'antd';

const { Option } = Select;

/**
 * AddRoom Component - Form for adding new rooms to the system
 * Features:
 * - Form validation for all fields
 * - Input restrictions for different field types
 * - Animated alerts for success/error messages
 * - Two-column responsive layout
 * - Loading state during submission
 */
const AddRoom = () => {
  // Form instance for programmatic control
  const [form] = Form.useForm();
  
  // State for alert notification
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // State for submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Form submission handler
   * @param {object} values - Form values
   */
  const onFinish = async (values) => {
    setIsSubmitting(true);
    try {
      // Send room data to server
      await axios.post("http://localhost:5000/room/add", values);
      
      // Show success alert
      setAlertMessage('Room Added Successfully');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      
      // Reset form fields
      form.resetFields();
    } catch (err) {
      console.error(err);
      
      // Show error alert
      setAlertMessage('Error Adding Room');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Form submission error handler
   * @param {object} errorInfo - Error information
   */
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // Input handlers with validation

  /**
   * Prevents non-numeric input in price field
   * @param {Event} e - Key press event
   */
  const handlePriceInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    // Allow numbers (0-9), decimal point (46), and backspace (8)
    if (!(charCode >= 48 && charCode <= 57) && charCode !== 46 && charCode !== 8) {
      e.preventDefault();
    }
  };

  /**
   * Prevents non-numeric input in room number field
   * @param {Event} e - Key press event
   */
  const handleRoomNumberInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    // Only allow numbers (0-9) and backspace (8)
    if (!(charCode >= 48 && charCode <= 57) && charCode !== 8) {
      e.preventDefault();
    }
  };

  /**
   * Prevents numeric input in facilities field
   * @param {Event} e - Key press event
   */
  const handleFacilitiesInput = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    // Allow letters (a-z, A-Z), spaces (32), commas (44), and backspace (8)
    if (!(charCode >= 65 && charCode <= 90) && 
        !(charCode >= 97 && charCode <= 122) && 
        charCode !== 32 && 
        charCode !== 44 && 
        charCode !== 8) {
      e.preventDefault();
    }
  };

  // Custom validation functions

  /**
   * Validates price input
   * @param {object} _ - Rule object
   * @param {string} value - Input value
   */
  const validatePrice = (_, value) => {
    if (!value) {
      return Promise.reject('Price is required');
    }
    if (isNaN(value) || value <= 0) {
      return Promise.reject('Price must be a positive number');
    }
    return Promise.resolve();
  };

  /**
   * Validates room number input
   * @param {object} _ - Rule object
   * @param {string} value - Input value
   */
  const validateRoomNumber = (_, value) => {
    if (!value) {
      return Promise.reject('Room number is required');
    }
    if (isNaN(value) || value <= 0) {
      return Promise.reject('Room number must be a positive number');
    }
    return Promise.resolve();
  };

  /**
   * Validates facilities input
   * @param {object} _ - Rule object
   * @param {string} value - Input value
   */
  const validateFacilities = (_, value) => {
    if (!value) {
      return Promise.reject('Facilities are required');
    }
    if (/\d/.test(value)) {
      return Promise.reject('Facilities cannot contain numbers');
    }
    return Promise.resolve();
  };

  return (
    <>
      {/* Sidebar navigation */}
      <SideBar/>
      
      {/* Main form container */}
      <div style={formContainerStyle}>
        <h2>Add Room</h2>
        
        {/* Room form */}
        <Form
          form={form}
          name="addRoom"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          {/* Two-column layout */}
          <Row gutter={16}>
            {/* Left column fields */}
            <Col span={12}>
              {/* Room type selection */}
              <Form.Item
                name="roomType"
                label="Room Type"
                rules={[{ required: true, message: 'Please select room type!' }]}
              >
                <Select placeholder="Select Room Type">
                  <Option value="Single">Single</Option>
                  <Option value="Double">Double</Option>
                  <Option value="VIP">VIP</Option>
                  <Option value="King">King</Option>
                  <Option value="Flex">Flex</Option>
                </Select>
              </Form.Item>

              {/* Price input */}
              <Form.Item
                name="price"
                label="Price"
                rules={[{ validator: validatePrice }]}
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

              {/* Room number input */}
              <Form.Item
                name="roomNumber"
                label="Room Number"
                rules={[{ validator: validateRoomNumber }]}
              >
                <Input 
                  type="number" 
                  min="1"
                  onKeyPress={handleRoomNumberInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (!/^\d+$/.test(pasteData)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>

            {/* Right column fields */}
            <Col span={12}>
              {/* Facilities input */}
              <Form.Item
                name="facilities"
                label="Facilities (comma-separated)"
                rules={[{ validator: validateFacilities }]}
              >
                <Input 
                  onKeyPress={handleFacilitiesInput}
                  onPaste={(e) => {
                    const pasteData = e.clipboardData.getData('text');
                    if (/\d/.test(pasteData)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              {/* Bed type selection */}
              <Form.Item
                name="bedType"
                label="Bed Type"
                rules={[{ required: true, message: 'Please select bed type!' }]}
              >
                <Select placeholder="Select Bed Type">
                  <Option value="Single Bed">Single Bed</Option>
                  <Option value="Double Bed">Double Bed</Option>
                </Select>
              </Form.Item>

              {/* Status selection */}
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status!' }]}
              >
                <Select placeholder="Select Status">
                  <Option value="Available" style={{ color: 'green' }}>Available</Option>
                  <Option value="Reserved" style={{ color: 'blue' }}>Reserved</Option>
                  <Option value="Booked" style={{ color: 'red' }}>Booked</Option>
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
              loading={isSubmitting}
            >
              Add Room
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
  marginLeft: "450px",
  marginTop: "50px",
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const buttonStyle = {
  backgroundColor: '#800000',
  borderColor: '#800000',
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

export default AddRoom;