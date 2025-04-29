import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Col, Row } from 'antd';
import ItemList from "../../components/Bar/ItemList";
import { useDispatch } from "react-redux";
import SideBar from "../SideBar/BarSideBar";

/**
 * Homepage Component - Displays product categories and items for a bar management system
 * Features:
 * - Category selection with visual indicators
 * - Item display in grid layout
 * - Interactive UI with hover effects
 * - Loading state management
 */
const Homepage = () => {
  // State management
  const [itemsData, setItemsData] = useState([]); // Stores all items data from API
  const [selectedCategory, setSelectedCategory] = useState("drinks"); // Currently selected category
  const [selectedItem, setSelectedItem] = useState(null); // Currently selected item ID

  // Category configuration with display names and images
  const categories = [
    {
      name: 'alcoholicBeverages',
      displayName: 'Alcoholic',
      imageUrl: 'https://st2.depositphotos.com/1364311/10133/i/950/depositphotos_101337220-stock-photo-glass-of-scotch-whiskey-and.jpg'
    },
    {
      name: 'beer',
      displayName: 'Beer',
      imageUrl: 'https://www.shutterstock.com/image-photo/mug-beer-on-white-background-260nw-162010502.jpg'
    },
    {
      name: 'wine',
      displayName: 'Wine',
      imageUrl: 'https://img.freepik.com/premium-vector/realistic-red-wine-glass-white-background_322978-421.jpg'
    },
    {
      name: 'nonAlcoholicBeverages',
      displayName: 'Non-Alcoholic',
      imageUrl: 'https://thumbs.dreamstime.com/b/glass-water-isolated-white-background-closeup-110854166.jpg'
    },
    {
      name: 'cocktails',
      displayName: 'Cocktails',
      imageUrl: 'https://img.freepik.com/premium-vector/alcohol-cocktail-margarita-with-slice-lime-vintage-vector-hatching-color-hand-drawn-illustration-isolated-white-background_496122-204.jpg'
    },
    {
      name: 'juice',
      displayName: 'Juice',
      imageUrl: 'https://as1.ftcdn.net/v2/jpg/01/09/44/36/1000_F_109443609_X5D0xbooQukFqgTusaRXWMR6X1j7BL9Z.jpg'
    },
    {
      name: 'tobacco',
      displayName: 'Tobacco',
      imageUrl: 'https://img.freepik.com/premium-photo/close-up-cigarette-with-smoke-showing-white-background_185126-673.jpg'
    },
    {
      name: 'snacks',
      displayName: 'Snacks',
      imageUrl: 'https://static.vecteezy.com/system/resources/previews/026/564/651/non_2x/healthy-snacks-white-isolated-background-foodgraphy-ai-generated-photo.jpg'
    }
  ];

  const dispatch = useDispatch(); // Redux dispatch function

  /**
   * Fetches all items from the API when component mounts
   * Manages loading state during API call
   */
  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({ type: "SHOW_LOADING" }); // Show loading indicator
        const { data } = await axios.get("/api/items/get-item");
        setItemsData(data); // Store fetched items data
        dispatch({ type: "HIDE_LOADING" }); // Hide loading indicator
      } catch (error) {
        console.log(error);
        dispatch({ type: "HIDE_LOADING" });
      }
    };
    getAllItems();
  }, [dispatch]);

  // Inline styles for categories and UI elements
  const categoryStyle = {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid lightgray',
    margin: '5px',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
    cursor: 'pointer',
    width: '200px',
    backgroundColor: 'white'
  };

  // Style for active (selected) category
  const categoryActiveStyle = {
    ...categoryStyle,
    border: '2px solid #4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  };

  // Text style for active category (maroon color)
  const activeCategoryTextStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#800000',
  };

  // Text style for inactive category
  const inactiveCategoryTextStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  };

  // Style for category images
  const categoryImgStyle = {
    borderRadius: '6px',
    objectFit: 'cover',
    width: '50px',
    height: '50px',
    marginLeft: '10px'
  };

  // Style for page title
  const pageTitleStyle = {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '30px',
    color: '#2F4F4F',
    marginLeft:'200px'
  };

  // Style for category container (horizontal scrollable)
  const categoryContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    marginLeft: '250px',
    marginRight:'20px'
  };

  // Style for individual items
  const itemStyle = {
    cursor: 'pointer',
    padding: '10px',
    border: '1px solid lightgray',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
    marginBottom: '10px'
  };

  return (
    <>
      {/* Sidebar navigation */}
      <SideBar/>
      
      {/* Page title */}
      <h1 style={pageTitleStyle}>Explore Our Categories</h1>
      
      {/* Categories horizontal scrollable container */}
      <div style={categoryContainerStyle}>
        {categories.map(category => (
          <div
            key={category.name}
            style={selectedCategory === category.name ? categoryActiveStyle : categoryStyle}
            onClick={() => setSelectedCategory(category.name)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* Category name with conditional styling */}
            <span style={selectedCategory === category.name ? activeCategoryTextStyle : inactiveCategoryTextStyle}>
              {category.displayName}
            </span>
            {/* Category image */}
            <img
              src={category.imageUrl}
              alt={category.displayName}
              style={categoryImgStyle}
            />
          </div>
        ))}
      </div>

      {/* Items grid filtered by selected category */}
      <Row style={{ marginTop: '40px',marginLeft:"250px",marginRight:"20px" }} gutter={[16, 16]}>
        {itemsData
          .filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase())  
          .map(item => (
            <Col key={item._id} xs={24} lg={6} md={12} sm={6}>
              {/* Individual item container with selection highlighting */}
              <div 
                style={{ 
                  ...itemStyle, 
                  backgroundColor: selectedItem === item._id ? '#800000' : 'white', 
                  color: selectedItem === item._id ? 'white' : '#333'
                }}
                onClick={() => setSelectedItem(item._id)}
              >
                {/* ItemList component to render item details */}
                <ItemList item={item} />
              </div>
            </Col>
          ))}
      </Row>
    </>
  );
};

export default Homepage;