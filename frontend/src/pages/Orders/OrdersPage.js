import React, { useEffect, useReducer } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAll, getAllStatus } from '../../services/orderService'; // Order service methods
import classes from './ordersPage.module.css'; // CSS module
import Title from '../../components/Title/Title'; // Title component
import DateTime from '../../components/DateTime/DateTime'; // Date formatter component
import Price from '../../components/Price/Price'; // Price formatter component
import NotFound from '../../components/NotFound/NotFound'; // 404 component

// Initial state for reducer
const initialState = {};

// Reducer function for state management
const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'ALL_STATUS_FETCHED':
            return { ...state, allStatus: payload }; // Update order statuses
        case 'ORDERS_FETCHED':
            return { ...state, orders: payload }; // Update orders list
        default:
            return state;
    }
};

export default function OrdersPage() {
    // State management with useReducer
    const [{ allStatus, orders }, dispatch] = useReducer(reducer, initialState);
    // Get filter parameter from URL
    const { filter } = useParams();

    // Fetch data when component mounts or filter changes
    useEffect(() => {
        // Fetch all possible order statuses
        getAllStatus().then(status => {
            dispatch({ type: 'ALL_STATUS_FETCHED', payload: status });
        });
        // Fetch orders (filtered if parameter exists)
        getAll(filter).then(orders => {
            dispatch({ type: 'ORDERS_FETCHED', payload: orders });
        });
    }, [filter]);

    return (
        <div className={classes.container}>
            {/* Page title */}
            <Title title="Orders" margin="1.5rem 0 0 .2rem" fontSize="1.9rem" />

            {/* Status filter tabs */}
            {allStatus && (
                <div className={classes.all_status}>
                    {/* "All" filter tab */}
                    <Link to="/orders" className={!filter ? classes.selected : ''}>
                        All
                    </Link>
                    {/* Status-specific filter tabs */}
                    {allStatus.map(state => (
                        <Link
                            key={state}
                            className={state === filter ? classes.selected : ''}
                            to={`/orders/${state}`}
                        >
                            {state}
                        </Link>
                    ))}
                </div>
            )}

            {/* Show not found if no orders exist */}
            {orders?.length === 0 && (
                <NotFound
                    linkRoute={filter ? '/orders' : '/'}
                    linkText={filter ? 'Show All' : 'Go To Home Page'}
                />
            )}

            {/* Orders list */}
            {orders &&
                orders.map((order, index) => (
                    <div key={order.id} className={classes.order_summary}>
                        {/* Order header with basic info */}
                        <div className={classes.header}>
                            <span>{index + 1}</span> {/* Display position in list */}
                            <span>
                                <DateTime date={order.createdAt} /> {/* Formatted date */}
                            </span>
                            <span>{order.status}</span> {/* Order status */}
                        </div>

                        {/* Order items (food thumbnails) */}
                        <div className={classes.items}>
                            {order.items.map(item => (
                                <Link key={item.food.id} to={`/food/${item.food.id}`}>
                                    <img src={item.food.imageUrl} alt={item.food.name} />
                                </Link>
                            ))}
                        </div>

                        {/* Order footer with actions and price */}
                        <div className={classes.footer}>
                            <div>
                                <Link to={`/track/${order.id}`}>Show Order</Link> {/* Order details link */}
                            </div>
                            <div>
                                <span className={classes.price}>
                                    <Price price={order.totalPrice} /> {/* Formatted price */}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}