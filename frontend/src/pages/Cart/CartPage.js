import React from 'react';
import classes from './cartPage.module.css';
import { useCart } from '../../hooks/useCart'; // Custom hook for cart functionality
import Title from '../../components/Title/Title'; // Title component
import { Link } from 'react-router-dom'; // For navigation
import Price from '../../components/Price/Price'; // Price display component
import NotFound from '../../components/NotFound/NotFound'; // Component for empty state

// CartPage component displays the user's shopping cart
export default function CartPage() {
    // Destructure cart state and methods from useCart hook
    const { cart, removeFromCart, changeQuantity } = useCart();
    
    return (
        <>
            {/* Page title with shopping cart emoji */}
            <Title title="Cart 🛒" margin="1.5rem 0 0 2.5rem" />

            {/* Conditional rendering based on whether cart is empty */}
            {cart.items.length === 0 ? (
                // Show empty cart message if no items
                <NotFound message="Cart Is Empty! 😔" />
            ) : (
                // Cart container when items exist
                <div className={classes.container}>
                    {/* List of cart items */}
                    <ul className={classes.list}>
                        {/* Map through each item in the cart */}
                        {cart.items.map(item => (
                            <li key={item.food.id}>
                                {/* Food image */}
                                <div>
                                    <img
                                        src={`${item.food.imageUrl}`}
                                        alt={item.food.name}
                                    />
                                </div>
                                
                                {/* Food name as link to food detail page */}
                                <div>
                                    <Link to={`/food/${item.food.id}`}>{item.food.name}</Link>
                                </div>

                                {/* Quantity selector dropdown */}
                                <div>
                                    <select
                                        value={item.quantity}
                                        onChange={e => changeQuantity(item, Number(e.target.value))}
                                    >
                                        {/* Options 1-10 */}
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                    </select>
                                </div>

                                {/* Item price */}
                                <div>
                                    <Price price={item.price} />
                                </div>

                                {/* Remove item button */}
                                <div>
                                    <button
                                        className={classes.remove_button}
                                        onClick={() => removeFromCart(item.food.id)}>
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Checkout section */}
                    <div className={classes.checkout}>
                        <div>
                            {/* Total item count */}
                            <div className={classes.foods_count}>{cart.totalCount}</div>
                            {/* Total price */}
                            <div className={classes.total_price}>
                                <Price price={cart.totalPrice} />
                            </div>
                        </div>

                        {/* Checkout button */}
                        <Link to="/foodcheckout">Proceed To Checkout</Link>
                    </div>
                </div>
            )}
        </>
    );
}