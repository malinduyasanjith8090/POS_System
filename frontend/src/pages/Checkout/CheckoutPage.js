import React from 'react';
import { useCart } from '../../hooks/useCart'; // Custom hook for cart functionality
import { useAuth } from '../../hooks/useAuth'; // Custom hook for authentication
import { useNavigate } from 'react-router-dom'; // For programmatic navigation
import { useState } from 'react'; // React state hook
import { useForm } from 'react-hook-form'; // Form handling library
import { toast } from 'react-toastify'; // Notification library
import { createOrder } from '../../services/orderService'; // Service for order creation
import classes from './checkoutPage.module.css'; // CSS module for styling
import Title from '../../components/Title/Title'; // Reusable title component
import Input from '../../components/Input/Input'; // Reusable input component
import Button from '../../components/Button/Button'; // Reusable button component
import OrderItemsList from '../../components/OrderItemsList/orderItemsList'; // Component to display order items

// CheckoutPage component handles the checkout process
export default function CheckoutPage() {
    // Get cart data from custom hook
    const { cart } = useCart();
    // Get user data from auth hook
    const { user } = useAuth();
    // Navigation hook
    const navigate = useNavigate();
    // Local state for order with cart data
    const [order, setOrder] = useState({ ...cart });

    // Form handling with react-hook-form
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    // Form submission handler
    const submit = async (data) => {
        // Create order with form data and navigate to payment
        await createOrder({ ...order, name: data.name, address: data.address });
        navigate('/payment');
    };

    return (
        <>
            {/* Checkout form */}
            <form onSubmit={handleSubmit(submit)} className={classes.container}>
                <div className={classes.content}>
                    {/* Page title */}
                    <Title title="Checkout" fontSize="1.6rem" />
                    
                    {/* Input fields for name and address */}
                    <div className={classes.inputs}>
                        <Input
                            defaultValue={user.name}
                            label="Name"
                            {...register('name')}
                            error={errors.name}
                        />
                        <Input
                            defaultValue={user.address}
                            label="Address"
                            {...register('address')}
                            error={errors.address}
                        />
                    </div>
                    
                    {/* Display order items */}
                    <OrderItemsList order={order} />
                </div>

                {/* Payment button container */}
                <div className={classes.buttons_container}>
                    <div className={classes.buttons}>
                        <Button
                            type="submit"
                            text="Go To Payment"
                            width="100%"
                            height="3rem"
                        />
                    </div>
                </div>
            </form>
        </>
    );
};