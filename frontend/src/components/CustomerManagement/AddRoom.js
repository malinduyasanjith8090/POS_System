import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import SideBar from "../SideBar/CustomerSideBar";
import { Form, Input, Select, Button, Row, Col } from 'antd';

const { Option } = Select;

const AddRoom = () => {
  const [form] = Form.useForm();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:5000/room/add", values);
      setAlertMessage('Room Added Successfully');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      form.resetFields();
    } catch (err) {
      console.error(err);
      setAlertMessage('Error Adding Room');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // Custom validation for price
  const validatePrice = (_, value) => {
    if (!value) {
      return Promise.reject('Price is required');
    }
    if (isNaN(value) || value <= 0) {
      return Promise.reject('Price must be a positive number');
    }
    return Promise.resolve();
  };

  // Custom validation for room number
  const validateRoomNumber = (_, value) => {
    if (!value) {
      return Promise.reject('Room number is required');
    }
    if (isNaN(value) || value <= 0) {
      return Promise.reject('Room number must be a positive number');
    }
    return Promise.resolve();
  };

  // Custom validation for facilities
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
      <SideBar/>
      <div style={formContainerStyle}>
        <h2>Add Room</h2>
        <Form
          form={form}
          name="addRoom"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Row gutter={16}>
            {/* Left Column */}
            <Col span={12}>
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

              <Form.Item
                name="price"
                label="Price"
                rules={[{ validator: validatePrice }]}
              >
                <Input type="number" min="0.01" step="0.01" />
              </Form.Item>

              <Form.Item
                name="roomNumber"
                label="Room Number"
                rules={[{ validator: validateRoomNumber }]}
              >
                <Input type="number" min="1" />
              </Form.Item>
            </Col>

            {/* Right Column */}
            <Col span={12}>
              <Form.Item
                name="facilities"
                label="Facilities (comma-separated)"
                rules={[{ validator: validateFacilities }]}
              >
                <Input />
              </Form.Item>

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