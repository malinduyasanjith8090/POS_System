import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Col, Modal, Form, Input, message } from "antd";
import { GiSalad, GiSoup, GiHamburger, GiSteak, GiNoodles, GiCupcake } from "react-icons/gi";
import { MinusCircleOutlined, PlusCircleOutlined, DeleteOutlined, ShoppingCartOutlined  } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const { Meta } = Card;

// Styles
const cardStyle = {
  width: "100%",
  maxWidth: "250px",
  marginBottom: 20,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  marginRight: "20px",
};

const hoverStyle = {
  transform: "scale(1.05)",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "10px",
};

const buttonStyle = {
  width: "150px",
  backgroundColor: "#800000",
  color: "#fff",
  border: "none",
};

const MenuPage = ({ setOrders }) => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Salad");
  const [selectedMealType, setSelectedMealType] = useState("Food Menu");
  const [cartItems, setCartItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tableNo = queryParams.get("tableNo");

  // Fetch all items
  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/Res/res-items/get-res-item");
      
      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setItemsData(data);
      } else if (data && Array.isArray(data.data)) {
        // If response has data property that's an array
        setItemsData(data.data);
      } else {
        console.error("Unexpected API response format:", data);
        setItemsData([]); // Set to empty array as fallback
        message.error("Failed to load menu items");
      }
      
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      console.log(error);
      setItemsData([]); // Set to empty array on error
      dispatch({ type: "HIDE_LOADING" });
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  // Set table number in form when component mounts
  useEffect(() => {
    if (tableNo) {
      form.setFieldsValue({ tableNo });
    }
  }, [tableNo, form]);

  // Categories
  const categories = [
    { name: "Salad", displayName: "Salad", icon: <GiNoodles /> },
    { name: "Soup", displayName: "Soup", icon: <GiNoodles /> },
    { name: "Sandwiches and Burgers", displayName: "Sandwiches & Burgers", icon: <GiHamburger /> },
    { name: "Western", displayName: "Western", icon: <GiSteak /> },
    { name: "Asian", displayName: "Asian", icon: <GiNoodles /> },
    { name: "Desserts", displayName: "Desserts", icon: <GiCupcake /> },
  ];

  // Meal types
  const mealTypes = [
    { name: "Food Menu", displayName: "Food Menu" },
    { name: "Beverages Menu", displayName: "Beverages Menu" },
  ];

  // Add to Cart function
  const handleAddToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((cartItem) =>
          cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      );
    } else {
      setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
    }
  };

  // Handle increment
  const handleIncrement = (record) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === record._id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Handle decrement
  const handleDecrement = (record) => {
    if (record.quantity > 1) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === record._id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    } else {
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== record._id));
    }
  };

  // Calculate Subtotal, Tax, and Grand Total
  const calculateTotals = () => {
    const subTotal = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
    const tax = (subTotal * 0.1).toFixed(2);
    const grandTotal = (subTotal + parseFloat(tax)).toFixed(2);

    return {
      subTotal: subTotal.toFixed(2),
      tax,
      grandTotal,
    };
  };

  const { subTotal, tax, grandTotal } = calculateTotals();

  // Show Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hide Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle Place Order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      message.warning("Your cart is empty. Please add items before placing an order.");
      return;
    }
  
    try {
      const values = await form.validateFields();
      const orderDetails = {
        ...values,
        cartItems: cartItems.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          ingredients: item.ingredients
        })),
        subTotal,
        tax,
        grandTotal,
      };
  
      // Correct API endpoint for restaurant orders
      const response = await axios.post("/api/Res/res-orders/place", orderDetails);
      
      if (response.data && response.data._id) {
        message.success("Order Placed Successfully!");
        setCartItems([]);
        setIsModalVisible(false);
        form.resetFields();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      message.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div>
      {/* Cart Button (Top-right corner) */}
      <Button
        type="primary"
        shape="circle"
        icon={<ShoppingCartOutlined />}
        size="large"
        onClick={showModal}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        {cartItems.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              backgroundColor: "#ff4d4f",
              color: "#fff",
              borderRadius: "50%",
              padding: "2px 8px",
              fontSize: "12px",
            }}
          >
            {cartItems.length}
          </span>
        )}
      </Button>

      {/* Meal Types */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
        {mealTypes.map((meal) => (
          <Card
            key={meal.name}
            title={meal.displayName}
            style={{
              width: "200px",
              margin: "10px",
              cursor: "pointer",
              backgroundColor: selectedMealType === meal.name ? "#f0f8ff" : "white",
              transition: "background-color 0.3s ease",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => setSelectedMealType(meal.name)}
          />
        ))}
      </div>

      {/* Categories */}
      <h1 style={{ textAlign: "center", fontSize: "28px", marginBottom: "30px", color: "#333" }}>
        Available Categories
      </h1>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {categories.map((category) => (
          <div
            key={category.name}
            style={{
              width: "120px",
              margin: "10px",
              padding: "20px",
              cursor: "pointer",
              border: selectedCategory === category.name ? "2px solid #4CAF50" : "2px solid transparent",
              backgroundColor: selectedCategory === category.name ? "#e8f5e9" : "white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease, border 0.3s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setSelectedCategory(category.name)}
          >
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>{category.icon}</div>
            <h3 style={{ textAlign: "center", fontSize: "16px", color: "#333", margin: 0 }}>
              {category.displayName}
            </h3>
          </div>
        ))}
      </div>

      {/* Item List */}
      <h1 style={{ textAlign: "center", fontSize: "28px", marginBottom: "30px", color: "#2F4F4F" }}>
        Explore {mealTypes.find((meal) => meal.name === selectedMealType)?.displayName} Items
      </h1>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {itemsData
          .filter((item) => item.category === selectedCategory && item.mealTime === selectedMealType)
          .map((item) => (
            <Col xs={12} sm={12} md={8} lg={6} key={item._id} style={{ padding: "5px" }}>
              <Card
                key={item._id}
                style={cardStyle}
                cover={<img alt={item.name} src={item.image} style={{ height: 250 }} />}
                className="item-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = hoverStyle.transform;
                  e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                }}
              >
                <Meta title={<span style={{ fontSize: "20px", fontWeight: "bold" }}>{item.name}</span>} />

                {/* Display prices if they are greater than zero */}
                <div style={{ margin: "10px 0", fontSize: "16px", fontWeight: "bold", color: "#000" }}>
                  {item.price > 0 && <div>LKR {item.price}</div>}
                  {item.Bprice > 0 && <div>Bprice: LKR {item.Bprice}</div>}
                  {item.Sprice > 0 && <div>Sprice: LKR {item.Sprice}</div>}
                </div>

                {/* Display ingredients with overflow handling */}
                <div style={{
                  fontSize: "14px", color: "#555",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  Ingredients: {item.ingredients}
                </div>

                {/* Add to Cart button */}
                <div style={buttonContainerStyle}>
                  <Button
                    style={buttonStyle}
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
      </div>

      {/* Modal */}
      <Modal
        title="Your Cart"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={handlePlaceOrder}>
            Place the Order
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="tableNo"
            label="Table No"
            rules={[{ required: true, message: "Please enter the table number!" }]}
          >
            <Input placeholder="Enter Table No" disabled />
          </Form.Item>
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[
              { 
                required: true, 
                message: "Please enter the customer name!" 
              },
              {
                pattern: /^[A-Za-z\s'-]+$/,
                message: "Please enter a valid customer name!"
              }
            ]}
          >
            <Input placeholder="Enter Customer Name" />
          </Form.Item>
          <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[
              { 
                required: true, 
                message: "Please enter the contact number!" 
              },
              {
                pattern: /^\d{10}$/,
                message: "Please enter a valid 10-digit number!"
              }
            ]}
            normalize={(value) => value ? value.replace(/\D/g, '') : ''}
          >
            <Input 
              placeholder="Enter Contact Number" 
              maxLength={10}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address!"
              }
            ]}
          >
            <Input placeholder="Enter Email" />
          </Form.Item>
        </Form>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {cartItems.length > 0 ? (
            <div>
              <h1 style={{ textAlign: "left", marginBottom: "25px", fontSize: "28px", fontWeight: "bold", color: "#333" }}>Shopping Cart</h1>
              {cartItems.map((item) => (
                <div key={item._id} style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 120px 50px",
                  alignItems: "center",
                  padding: "18px 0",
                  borderBottom: "1px solid #eee",
                  gap: "15px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}>
                  {/* Image */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img src={item.image} alt={item.name} style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }} />
                  </div>

                  {/* Name and Quantity */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "70%" }}>
                    <div>
                      <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>{item.name}</span>
                      <p style={{ fontSize: "14px", color: "#777", margin: "5px 0 0 0" }}>{item.ingredients}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", background: "#f7f7f7", padding: "5px 10px", borderRadius: "8px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.05)" }}>
                      <MinusCircleOutlined style={{ cursor: "pointer", fontSize: "20px", color: "#555", transition: "color 0.2s", ":hover": { color: "#333" } }} onClick={() => handleDecrement(item)} />
                      <b style={{ fontSize: "16px", color: "#333" }}>{item.quantity}</b>
                      <PlusCircleOutlined style={{ cursor: "pointer", fontSize: "20px", color: "#555", transition: "color 0.2s", ":hover": { color: "#333" } }} onClick={() => handleIncrement(item)} />
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", fontSize: "18px", color: "#333" }}>LKR {item.price * item.quantity}</span>
                  </div>

                  {/* Delete Icon */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <DeleteOutlined style={{ cursor: "pointer", color: "#ff4d4f", fontSize: "20px", transition: "color 0.2s", ":hover": { color: "#ff1a1d" } }} onClick={() => setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem._id !== item._id))} />
                  </div>
                </div>
              ))}

              {/* Subtotal, Tax, and Grand Total */}
              <div style={{ marginTop: "20px", padding: "10px", borderTop: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal:</span>
                  <span>LKR {subTotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Tax (10%):</span>
                  <span>LKR {tax}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Grand Total:</span>
                  <span>LKR {grandTotal}</span>
                </div>
              </div>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MenuPage;