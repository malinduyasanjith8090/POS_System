import React, { useEffect, useState } from 'react';
import classes from './foodPage.module.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getById } from '../../services/foodService'; // Service to fetch food by ID
import StarRating from '../../components/StarRating/StarRating'; // Star rating component
import Tags from '../../components/Tags/Tags'; // Tags display component
import Price from '../../components/Price/Price'; // Price display component
import { useCart } from '../../hooks/useCart'; // Custom cart hook
import NotFound from '../../components/NotFound/NotFound'; // 404 component

export default function FoodPage() {
    // State to store the food item data
    const [food, setFood] = useState({});
    // Get the food ID from URL params
    const { id } = useParams();
    // Get addToCart function from cart context
    const { addToCart } = useCart();
    // Navigation hook
    const navigate = useNavigate();

    // Handler for adding item to cart
    const handleAddToCart = () => {
        addToCart(food);
        navigate('/cart'); // Redirect to cart page after adding
    };

    // Fetch food data when component mounts or ID changes
    useEffect(() => {
        getById(id).then(setFood);
    }, [id]);

    return (
        <>
            {/* Show not found if food doesn't exist */}
            {!food ? (
                <NotFound message="Food Not Found!" linkText="Back To Homepage" />
            ) : (
                <div className={classes.container}>
                    {/* Food image */}
                    <img
                        className={classes.image}
                        src={`${food.imageUrl}`}
                        alt={food.name}
                    />

                    {/* Food details section */}
                    <div className={classes.details}>
                        {/* Header with name and favorite icon */}
                        <div className={classes.header}>
                            <span className={classes.name}>{food.name}</span>
                            <span className={`${classes.favorite} ${food.favorite ? '' : classes.not}`}>
                                ❤
                            </span>
                        </div>

                        {/* Star rating component */}
                        <div className={classes.rating}>
                            <StarRating stars={food.stars} size={25} />
                        </div>

                        {/* Food origins */}
                        <div className={classes.origins}>
                            {food.origins?.map(origin => (
                                <span key={origin}>{origin}</span>
                            ))}
                        </div>

                        {/* Food tags */}
                        <div className={classes.tags}>
                            {food.tags && (
                                <Tags
                                    tags={food.tags.map(tag => ({ name: tag }))}
                                    forFoodPage={true}
                                />
                            )}
                        </div>

                        {/* Cooking time */}
                        <div className={classes.cook_time}>
                            <span>
                                Time to cook about <strong>{food.cookTime}</strong> minutes
                            </span>
                        </div>

                        {/* Price */}
                        <div className={classes.price}>
                            <Price price={food.price} />
                        </div>

                        {/* Add to cart button */}
                        <button onClick={handleAddToCart}>Add To Cart</button>
                    </div>
                </div>
            )}
        </>
    );
}