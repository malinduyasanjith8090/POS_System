import React from "react";
import { Button, Card } from "antd";
import { useDispatch } from "react-redux";

/**
 * ItemList Component - Displays individual product items with add-to-cart functionality
 * Features:
 * - Displays item image, name, prices, and description
 * - Add to cart button with maroon (#800000) styling
 * - Hover effects for better user interaction
 * - Handles multiple price types (price, Bprice, Sprice)
 */
const ItemList = ({ item }) => {
    // Redux dispatch function for state management
    const dispatch = useDispatch();

    /**
     * Handles adding item to cart
     * Dispatches ADD_TO_CART action with item data and default quantity of 1
     */
    const handleAddToCart = () => {
        dispatch({
            type: "ADD_TO_CART",
            payload: { ...item, quantity: 1 },
        });
    };

    // Destructure Meta component from Card for cleaner JSX
    const { Meta } = Card;

    // Style objects for consistent styling throughout the component

    // Base card styling
    const cardStyle = {
        width: 250,
        marginBottom: 20,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
    };

    // Button styling with maroon (#800000) background
    const buttonStyle = {
        width: 150,
        backgroundColor: "#800000",  // Maroon color
        color: "#fff",  // White text
        border: "none",
        marginTop: "10px",
        marginLeft: "25px",  // Centered button
    };

    // Hover effect styling for the card
    const hoverStyle = {
        transform: "scale(1.05)",  // Slight zoom effect
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",  // Enhanced shadow
    };

    return (
        <div>
            {/* Product card with hover effects */}
            <Card
                style={cardStyle}
                cover={
                    <img 
                        alt={item.name} 
                        src={item.image} 
                        style={{ height: 250 }}  // Fixed height for consistency
                    />
                }
                className="item-card"
                // Mouse enter event for hover effect
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = hoverStyle.transform;
                    e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
                }}
                // Mouse leave event to return to normal state
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                }}
            >
                {/* Item name/title */}
                <Meta title={item.name} />

                {/* Price display section - shows all available price types */}
                <div style={{ 
                    margin: "10px 0", 
                    fontSize: "16px", 
                    fontWeight: "bold", 
                    color: "#000"  // Black text for prices
                }}>
                    {/* Regular price */}
                    {item.price > 0 && <div>LKR {item.price}</div>}
                    {/* Bprice if available */}
                    {item.Bprice > 0 && <div>Bprice: LKR {item.Bprice}</div>}
                    {/* Sprice if available */}
                    {item.Sprice > 0 && <div>Sprice: LKR {item.Sprice}</div>}
                </div>

                {/* Item description */}
                <p style={{ 
                    margin: "10px 0", 
                    fontSize: "14px", 
                    color: "#666"  // Gray text for description
                }}>
                    {item.description}
                </p>

                {/* Add to cart button */}
                <div className="item-button">
                    <Button
                        style={buttonStyle}
                        onClick={handleAddToCart}
                    >
                        Add to cart
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ItemList;