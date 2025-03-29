import React, { useState, useEffect } from "react";
import DefaultLayout from "../SideBar/ResSideBar";
import axios from "axios";
import { Col, Row, Card, message } from "antd";
import ItemList from "./ItemList";
import { useDispatch } from "react-redux";
import { GiSalad, GiSoup, GiHamburger, GiSteak, GiNoodles, GiCupcake } from "react-icons/gi";

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Salad");
  const [selectedMealType, setSelectedMealType] = useState("Food Menu");
  const [stats, setStats] = useState({
    totalFoodItems: 0,
    availableTables: 0,
    totalCategories: 0,
    totalPaidOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  // Fetch all items
  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("/api/Res/res-items/get-res-item");
      
      if (data.success) {
        setItemsData(data.data);
        
        // Calculate stats based on the fetched data
        const categories = new Set(data.data.map(item => item.category));
        
        // Fetch available tables from localStorage
        const availableTables = localStorage.getItem("availableTables");
        const availableTablesCount = availableTables ? parseInt(availableTables, 10) : 36;

        setStats({
          totalFoodItems: data.data.length,
          availableTables: availableTablesCount,
          totalCategories: categories.size,
          totalPaidOrders: data.data.reduce((acc, item) => acc + (item.ordersCount || 0), 0),
        });
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      message.error("Failed to fetch menu items");
    } finally {
      dispatch({ type: "HIDE_LOADING" });
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  // Update available tables count when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const availableTables = localStorage.getItem("availableTables");
      if (availableTables) {
        setStats(prevStats => ({
          ...prevStats,
          availableTables: parseInt(availableTables, 10),
        }));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Categories
  const categories = [
    { name: "Salad", displayName: "Salad", icon: <GiNoodles size={24} /> },
    { name: "Soup", displayName: "Soup", icon: <GiNoodles size={24} /> },
    { name: "Sandwiches and Burgers", displayName: "Sandwiches & Burgers", icon: <GiHamburger size={24} /> },
    { name: "Western", displayName: "Western", icon: <GiSteak size={24} /> },
    { name: "Asian", displayName: "Asian", icon: <GiNoodles size={24} /> },
    { name: "Desserts", displayName: "Desserts", icon: <GiCupcake size={24} /> },
  ];

  // Meal types
  const mealTypes = [
    { name: "Food Menu", displayName: "Food Menu" },
    { name: "Beverages Menu", displayName: "Beverages Menu" },
  ];

  // Filter items by selected category and meal type
  const filteredItems = itemsData.filter(item => 
    item.category === selectedCategory && item.mealTime === selectedMealType
  );

  return (
    <DefaultLayout>
      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "30px" }}>
        <Col xs={24} sm={6}>
          <Card
            title={<span style={{ fontWeight: "bold", color: "white" }}>Total Food Items</span>}
            bordered={false}
            style={{
              color: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundImage: "linear-gradient(43deg, #4158D0 0%, #3B82F6 46%,rgb(114, 164, 238) 100%)",
            }}
          >
            <h2 style={{ fontSize: "24px", textAlign: "center", fontWeight: "bold", color: "white" }}>
              {stats.totalFoodItems}
            </h2>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            title={<span style={{ fontWeight: "bold", color: "white" }}>Available Tables</span>}
            bordered={false}
            style={{
              color: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundImage: "linear-gradient(43deg,rgb(4, 141, 57) 0%, #10B981 46%,rgb(132, 224, 152) 100%)",
            }}
          >
            <h2 style={{ fontSize: "24px", textAlign: "center", fontWeight: "bold", color: "white" }}>
              {stats.availableTables}
            </h2>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            title={<span style={{ fontWeight: "bold", color: "white" }}>Total Categories</span>}
            bordered={false}
            style={{
              color: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundImage: "linear-gradient(43deg,rgb(231, 126, 40) 0%, #F59E0B 46%,rgb(236, 172, 99) 100%)",
            }}
          >
            <h2 style={{ fontSize: "24px", textAlign: "center", fontWeight: "bold", color: "white" }}>
              {stats.totalCategories}
            </h2>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            title={<span style={{ fontWeight: "bold", color: "white" }}>Total Orders</span>}
            bordered={false}
            style={{
              color: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundImage: "linear-gradient(43deg,rgb(173, 43, 65) 0%, #F87171 46%,rgb(231, 133, 120) 100%)",
            }}
          >
            <h2 style={{ fontSize: "24px", textAlign: "center", fontWeight: "bold", color: "white" }}>
              {stats.totalPaidOrders}
            </h2>
          </Card>
        </Col>
      </Row>

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
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setSelectedCategory(category.name)}
          >
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>
              {category.icon}
            </div>
            <h3 style={{ textAlign: "center", fontSize: "16px", color: "#333", margin: 0 }}>
              {category.displayName}
            </h3>
          </div>
        ))}
      </div>

      {/* Item List */}
      <h1 style={{ textAlign: "center", fontSize: "28px", marginBottom: "30px", color: "#2F4F4F" }}>
        {selectedMealType === "Food Menu" ? "Food Menu" : "Beverages Menu"} - {selectedCategory}
      </h1>
      
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading menu items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>No items found in this category</p>
        </div>
      ) : (
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "center",
          gap: "20px",
          padding: "0 20px"
        }}>
          {filteredItems.map((item) => (
            <ItemList key={item._id} item={item} />
          ))}
        </div>
      )}
    </DefaultLayout>
  );
};

export default Homepage;