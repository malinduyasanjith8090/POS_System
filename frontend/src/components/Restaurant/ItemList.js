import React from "react";
import { Button, Card, message } from "antd";
import { useDispatch } from "react-redux";

const ItemList = ({ item }) => {
    const dispatch = useDispatch();

    // Update cart handler
    const handleAddToCart = () => {
        dispatch({
            type: "ADD_TO_CART",
            payload: { ...item, quantity: 1 },
        });
        message.success(`${item.name} added to cart`);
    };

    const { Meta } = Card;

    return (
        <Card
            hoverable
            style={{
                width: 280,
                marginBottom: 20,
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
            }}
            cover={
                <img 
                    alt={item.name} 
                    src={item.image} 
                    style={{ 
                        height: 200, 
                        objectFit: "cover",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px"
                    }} 
                />
            }
        >
            <Meta 
                title={
                    <span style={{ 
                        fontSize: "18px", 
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "8px"
                    }}>
                        {item.name}
                    </span>
                }
                description={
                    <>
                        <div style={{ 
                            fontSize: "16px", 
                            fontWeight: "bold", 
                            color: "#000",
                            margin: "8px 0"
                        }}>
                            LKR {item.price.toFixed(2)}
                        </div>
                        <div style={{ 
                            fontSize: "14px", 
                            color: "#666",
                            height: "40px",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            {item.ingredients}
                        </div>
                        <Button
                            type="primary"
                            style={{
                                width: "100%",
                                backgroundColor: "#800000",
                                borderColor: "#800000",
                                marginTop: "15px",
                                fontWeight: "bold"
                            }}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </Button>
                    </>
                }
            />
        </Card>
    );
};

export default ItemList;