import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Table, message, Form, Input, Select } from "antd";
import SideBar from "../SideBar/BarSideBar";

/**
 * CartPage Component - Handles the shopping cart functionality
 * Features:
 * - Displays cart items in a table
 * - Allows quantity adjustment (increment/decrement)
 * - Item removal from cart
 * - Invoice generation
 * - Customer information collection
 */
const CartPage = () => {
  // State management
  const [subTotal, setSubTotal] = useState(0); // Stores the subtotal of all cart items
  const [billPopup, setBillPopup] = useState(false); // Controls invoice modal visibility
  const dispatch = useDispatch(); // Redux dispatch function
  const navigate = useNavigate(); // Navigation function
  const { cartItems } = useSelector((state) => state.rootReducer); // Cart items from Redux store

  /**
   * Handles incrementing item quantity
   * @param {object} record - The cart item to increment
   */
  const handleIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  /**
   * Handles decrementing item quantity (minimum 1)
   * @param {object} record - The cart item to decrement
   */
  const handleDecrement = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} width="50" height="50" />
      ),
    },
    {
      title: "Bprice",
      dataIndex: "Bprice",
    },
    {
      title: "Sprice",
      dataIndex: "Sprice",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          {/* Increment button */}
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncrement(record)}
          />
          <b>{record.quantity}</b>
          {/* Decrement button */}
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecrement(record)}
          />
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        /* Delete button */
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() =>
            dispatch({
              type: "DELETE_FROM_CART",
              payload: record,
            })
          }
        />
      ),
    },
  ];

  /**
   * Calculates subtotal whenever cart items change
   * Sums up all item prices (Bprice, Sprice, and regular price)
   */
  useEffect(() => {
    let tempBprice = 0;
    let tempSprice = 0;
    let tempprice = 0;

    cartItems.forEach((item) => {
      tempBprice += (item.Bprice * item.quantity) || 0;
      tempSprice += (item.Sprice * item.quantity) || 0;
      tempprice += (item.price * item.quantity) || 0;
    });

    setSubTotal(tempBprice + tempSprice + tempprice);
  }, [cartItems]);

  /**
   * Handles form submission for invoice generation
   * @param {object} values - Form values containing customer info
   */
  const handleSubmit = async (values) => {
    try {
      // Prepare bill data
      const newObject = {
        ...values,
        cartItems,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(
          Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))
        ),
      };

      // Submit to API
      const response = await axios.post("/api/bills/add-bills", newObject);
      message.success("Bill Created Successfully!");
      navigate("/bills");
    } catch (error) {
      message.error("Something Went Wrong!");
    }
  };

  /**
   * Prevents entering numbers in customer name field
   * @param {Event} e - Input change event
   */
  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    e.target.value = value;
    return value;
  };

  /**
   * Prevents entering non-digits in contact number field
   * @param {Event} e - Input change event
   */
  const handleNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
    return value;
  };

  return (
    <>
      {/* Sidebar component */}
      <SideBar/>
      
      {/* Page title */}
      <h1 style={{marginLeft:"260px"}}>Cart</h1>
      
      {/* Main cart items table */}
      <Table 
        columns={columns} 
        dataSource={cartItems} 
        bordered 
        rowKey="_id" 
        style={{marginLeft:"260px",marginRight:"20px"}}
      />
      
      {/* Subtotal and invoice button section */}
      <div className="d-flex flex-column align-items-end" style={{marginLeft:"260px"}}>
        <hr />
        <h3>
          SUB TOTAL : LKR <b> {subTotal} </b> /-
        </h3>
        <Button type="primary" onClick={() => setBillPopup(true)}>
          Create Invoice
        </Button>
      </div>

      {/* Invoice creation modal */}
      <Modal
        title="Create Invoice"
        visible={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={false}
        width={800}
      >
        {/* Invoice form */}
        <Form layout="vertical" onFinish={handleSubmit}>
          {/* Customer name field */}
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[
              { required: true, message: "Please enter the customer name" },
              { min: 3, message: "Customer name must be at least 3 characters" },
              { 
                pattern: /^[a-zA-Z\s]*$/,
                message: "Customer name cannot contain numbers or special characters" 
              }
            ]}
            getValueFromEvent={handleNameChange}
          >
            <Input placeholder="Enter customer name" maxLength={50} />
          </Form.Item>
          
          {/* Contact number field */}
          <Form.Item
            name="customerNumber"
            label="Contact No"
            rules={[
              { required: true, message: "Please enter the contact number" },
              {
                pattern: /^\d{10}$/,
                message: "Contact number must be 10 digits",
              },
            ]}
            getValueFromEvent={handleNumberChange}
          >
            <Input placeholder="Enter 10-digit contact number" maxLength={10} />
          </Form.Item>
          
          {/* Payment method selection */}
          <Form.Item
            name="paymentMode"
            label="Payment Method"
            rules={[{ required: true, message: "Please select a payment method" }]}
          >
            <Select placeholder="Select payment method">
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item>

          {/* Cart items summary in modal */}
          <div>
            <h4>Items:</h4>
            <Table
              dataSource={cartItems}
              columns={[
                {
                  title: "Item Name",
                  dataIndex: "name",
                },
                {
                  title: "Quantity",
                  dataIndex: "quantity",
                },
                {
                  title: "Price (LKR)",
                  dataIndex: "price",
                  render: (price, record) => (
                    <div>
                      {record.price > 0 && <div>LKR {record.price * record.quantity}</div>}
                      {record.Bprice > 0 && <div>Bprice: LKR {record.Bprice * record.quantity}</div>}
                      {record.Sprice > 0 && <div>Sprice: LKR {record.Sprice * record.quantity}</div>}
                    </div>
                  ),
                },
              ]}
              pagination={false}
              rowKey="_id"
              size="small"
            />
          </div>

          {/* Price summary section */}
          <div className="bill-it" style={{ marginTop: '20px' }}>
            <h5>
              Sub Total: LKR <b>{subTotal.toFixed(2)}</b>
            </h5>
            <h4>
              TAX (10%): LKR <b>{((subTotal / 100) * 10).toFixed(2)}</b>
            </h4>
            <h3>
              GRAND TOTAL: LKR{" "}
              <b>
                {(Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))).toFixed(2)}
              </b>
            </h3>
          </div>

          {/* Form submit button */}
          <div className="d-flex justify-content-end" style={{ marginTop: '20px' }}>
            <Button type="primary" htmlType="submit">
              Generate Bill
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CartPage;