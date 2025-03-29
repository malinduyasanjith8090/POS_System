import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import "../SideBar/DefaultLayout.css";
import Spinner from "../Restaurant/Spinner";


const { Content } = Layout;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  // To get local storage data
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const hoverStyle = {
    backgroundColor: "#b30000", // Darker red for hover
    color: "#fff",
    transform: "scale(1.05)",
  };

  const defaultStyle = {
    display: "block",
    padding: "15px",
    marginBottom: "10px",
    backgroundColor: "#444444", // Dark gray background for default state
    borderRadius: "5px",
    color: "#fff", // White text
    textDecoration: "none",
    transition: "background-color 0.3s ease, color 0.3s ease, transform 0.3s ease",
  };

  const logoStyle = {
    color: "#fff",
    textAlign: "center", // Center align text
    lineHeight: "1.2",
    margin: "20px auto", // Center the logo with margin
    fontSize: "1.5em", // Increased text size
  };

  const redTextStyle = {
    color: "red",
    fontSize: "2.5em", // Larger text size for better visibility
  };

  // Adjusted title bar styles for smaller appearance
  const titleBarStyle = {
    backgroundColor: "#1a1a1a", // Match sidebar color
    padding: "5px 10px", // Reduced padding for smaller appearance
    margin: 0,
    width: "calc(100% - 250px)", // Width to match the sidebar
    position: "fixed",
    top: 0, // Align with the top of the viewport
    left: "250px", // Position to the right of the sidebar
    boxSizing: "border-box",
    display: "flex", // Use flexbox for layout
    justifyContent: "space-between", // Space out title and cart button
    alignItems: "center", // Center items vertically
    color: "#fff", // White text for contrast on dark background
    borderBottom: "1px solid #333", // Optional: darker gray border at the bottom for better contrast
    height: "40px", // Fixed height for the title bar
    lineHeight: "40px", // Center the text vertically
  };

  const contentStyle = {
    marginTop: "50px", // Gap between the title bar and content
    padding: "20px", // Additional padding around the content
    marginLeft: "250px", // Adjust for sidebar width
  };

  // Style for the cart button
  const cartButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff", // White color for the icon
    cursor: "pointer",
    outline: "none",
    fontSize: "1.5em", // Size for better visibility
    display: "flex", // Use flexbox for alignment
    alignItems: "center", // Center align items
  };

  return (
    <Layout>
      {loading && <Spinner />}
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          height: "100vh",
          backgroundColor: "#1a1a1a",
          padding: "15px",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <div style={logoStyle}>
          Cinnamon <br />
          <span style={redTextStyle}>Red</span> <br />
          Colombo
        </div>
        <ul style={{ listStyleType: "none", padding: "30px 0 0 0" }}>
          <li>
            <Link
              to="/homepage"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/Res-bills"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Bills
            </Link>
          </li>
          <li>
            <Link
              to="/Res-items"
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Items
            </Link>
          </li>
          <li>
            <Link
              to="/table" // Add Tables link
              style={defaultStyle}
              onMouseOver={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, defaultStyle);
              }}
            >
              Tables
            </Link>
          </li>
          <li>
            <Link
             to="/qr-code"
              style={defaultStyle}
             onMouseOver={(e) => {
             Object.assign(e.currentTarget.style, hoverStyle);
             }}
             onMouseOut={(e) => {
             Object.assign(e.currentTarget.style, defaultStyle);
            }}
             >
             QR Code
           </Link>
           </li>

          <li>
            <Link
              to="/"
              style={defaultStyle}
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Header Title Bar */}
      <div style={titleBarStyle}>
        <h1 style={{ margin: 0, fontSize: "1.2em" }}>POS Management</h1>
        <button
          style={cartButtonStyle}
          className="cart-item d-flex justify-content-space-between flex-row"
          onClick={() => navigate("/Res-cart")}
        >
          <p style={{ margin: 0, marginRight: "5px" }}>{cartItems.length}</p>
          <ShoppingCartOutlined />
        </button>
      </div>

      {/* Content Area */}
      <Content
        className="site-layout-background"
        style={contentStyle}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default DefaultLayout;