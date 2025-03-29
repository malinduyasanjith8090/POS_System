import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../components/SideBar/ResSideBar";
import { useSelector, useDispatch } from "react-redux";
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, Select, message } from "antd";

const ResCartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);

  // Handle increment
  const handleIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  // Handle decrement
  const handleDecrement = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  // Calculate subtotal
  useEffect(() => {
    let tempTotal = 0;
    cartItems.forEach((item) => {
      tempTotal += item.price * item.quantity;
    });
    setSubTotal(tempTotal);
  }, [cartItems]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const newObject = {
        ...values,
        cartItems,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(
          Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))
        ),
      };

      const response = await axios.post("/api/Res/res-bills/add-res-bills", newObject);
      
      if (response.data.success) {
        message.success("Bill Created Successfully!");
        dispatch({ type: "CLEAR_CART" });
        navigate("/res-bills");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Something Went Wrong!");
      console.error("Error creating bill:", error);
    } finally {
      setLoading(false);
    }
  };

  // Validate customer name
  const validateCustomerName = (_, value) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (nameRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Only alphabets and spaces allowed"));
  };

  // Validate contact number
  const validateContactNumber = (_, value) => {
    const phoneRegex = /^\d{10}$/;
    if (phoneRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Must be 10 digits"));
  };

  return (
    <DefaultLayout>
      <div className="cart-container">
        {/* Cart Box */}
        <div className="cart-box">
          <h1 className="cart-title">Restaurant Cart</h1>
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <Button type="primary" onClick={() => navigate("/res-menu")}>
                Browse Menu
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="item-details">
                  <div>
                    <span className="item-name">{item.name}</span>
                    <p className="item-ingredients">{item.ingredients}</p>
                  </div>
                  <div className="quantity-controls">
                    <MinusCircleOutlined 
                      onClick={() => handleDecrement(item)} 
                      className="quantity-btn"
                    />
                    <b className="quantity">{item.quantity}</b>
                    <PlusCircleOutlined 
                      onClick={() => handleIncrement(item)} 
                      className="quantity-btn"
                    />
                  </div>
                </div>

                <div className="item-price">
                  <span>LKR {item.price.toFixed(2)}</span>
                </div>

                <div className="item-delete">
                  <DeleteOutlined 
                    onClick={() => dispatch({ type: "DELETE_FROM_CART", payload: item })}
                    className="delete-btn"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Box */}
        {cartItems.length > 0 && (
          <div className="summary-box">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>LKR {subTotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>LKR {((subTotal / 100) * 10).toFixed(2)}</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row total">
              <span>Total</span>
              <span>LKR {(subTotal + (subTotal / 100) * 10).toFixed(2)}</span>
            </div>

            <Button 
              type="primary" 
              className="checkout-btn"
              onClick={() => setBillPopup(true)}
              loading={loading}
            >
              Create Bill
            </Button>
          </div>
        )}
      </div>

      {/* Bill Modal */}
      <Modal
        title="Create Restaurant Bill"
        visible={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[
              { required: true, message: "Please enter customer name" },
              { validator: validateCustomerName },
            ]}
          >
            <Input placeholder="Enter customer name" />
          </Form.Item>

          <Form.Item
            name="customerNumber"
            label="Contact Number"
            rules={[
              { required: true, message: "Please enter contact number" },
              { validator: validateContactNumber },
            ]}
          >
            <Input placeholder="Enter contact number" maxLength={10} />
          </Form.Item>

          <Form.Item
            name="paymentMode"
            label="Payment Method"
            rules={[{ required: true, message: "Please select payment method" }]}
          >
            <Select placeholder="Select payment method">
              <Select.Option value="Cash">Cash</Select.Option>
              <Select.Option value="Card">Card</Select.Option>
              <Select.Option value="Bank Transfer">Bank Transfer</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={loading}
            >
              Generate Bill
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .cart-container {
          display: flex;
          justify-content: center;
          padding: 40px;
          min-height: 100vh;
          background: #f4f4f4;
          gap: 20px;
        }
        
        .cart-box {
          width: 60%;
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
        }
        
        .cart-title {
          text-align: left;
          margin-bottom: 25px;
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }
        
        .empty-cart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          gap: 20px;
        }
        
        .cart-item {
          display: grid;
          grid-template-columns: 80px 1fr 120px 50px;
          align-items: center;
          padding: 18px 0;
          border-bottom: 1px solid #eee;
          gap: 15px;
        }
        
        .item-image img {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        .item-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 70%;
        }
        
        .item-name {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }
        
        .item-ingredients {
          font-size: 14px;
          color: #777;
          margin: 5px 0 0 0;
        }
        
        .quantity-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          background: #f7f7f7;
          padding: 5px 10px;
          border-radius: 8px;
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .quantity-btn {
          cursor: pointer;
          font-size: 20px;
          color: #555;
          transition: color 0.2s;
        }
        
        .quantity-btn:hover {
          color: #333;
        }
        
        .quantity {
          font-size: 16px;
          color: #333;
        }
        
        .item-price {
          font-weight: bold;
          font-size: 18px;
          color: #333;
        }
        
        .delete-btn {
          cursor: pointer;
          color: #ff4d4f;
          font-size: 20px;
          transition: color 0.2s;
        }
        
        .delete-btn:hover {
          color: #ff1a1d;
        }
        
        .summary-box {
          width: 30%;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }
        
        .summary-box h2 {
          margin-bottom: 15px;
          font-size: 20px;
          font-weight: bold;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          margin-bottom: 10px;
        }
        
        .summary-row.total {
          font-size: 18px;
          font-weight: bold;
        }
        
        .summary-divider {
          margin: 10px 0;
          border-color: #ccc;
        }
        
        .checkout-btn {
          width: 100%;
          margin-top: 20px;
        }
      `}</style>
    </DefaultLayout>
  );
};

export default ResCartPage;