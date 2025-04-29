import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form'; // Form handling library
import { useNavigate, useSearchParams, Link } from 'react-router-dom'; // Routing utilities
import { useAuth } from '../../hooks/useAuth'; // Authentication context
import classes from './loginPage.module.css'; // CSS module
import Title from '../../components/Title/Title'; // Title component
import Input from '../../components/Input/Input'; // Form input component
import Button from '../../components/Button/Button'; // Button component

export default function LoginPage() {
    // Form handling with react-hook-form
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const { user, login } = useAuth(); // Get auth functions and user state
    const [params] = useSearchParams();
    const returnUrl = params.get('returnUrl'); // Get return URL if specified

    // Redirect if user is already logged in
    useEffect(() => {
        if (!user) return;

        // Navigate to returnUrl or default food page
        returnUrl ? navigate(returnUrl) : navigate('/food');
    }, [user]);

    // Form submission handler
    const submit = async ({ email, password }) => {
        await login(email, password); // Call login function
    };

    return (
        <div className={classes.container}>
            <div className={classes.details}>
                {/* Page title */}
                <Title title="Login" />
                
                {/* Login form */}
                <form onSubmit={handleSubmit(submit)} noValidate>
                    {/* Email input */}
                    <Input
                        type="email"
                        label="Email"
                        {...register('email', {
                            required: true,
                            pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i,
                                message: 'Email Is Not Valid',
                            },
                        })}
                        error={errors.email}
                    />

                    {/* Password input */}
                    <Input
                        type="password"
                        label="Password"
                        {...register('password', {
                            required: true,
                        })}
                        error={errors.password}
                    />

                    {/* Submit button */}
                    <Button type="submit" text="Login" />

                    {/* Registration link */}
                    <div className={classes.register}>
                        New user? &nbsp;
                        <Link to={`/register${returnUrl ? '?returnUrl=' + returnUrl : ''}`}>
                            Register here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}