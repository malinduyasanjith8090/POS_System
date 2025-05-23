import React from 'react'
import classes from './header.module.css';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../images/company.png';

export default function Header() {

    const { user, logout } = useAuth();
    const { cart } = useCart();

    return (
        <header className={classes.header}>
            <div className={classes.container}>
                <Link to="/food" className={classes.logo}>
                    <img src={logo} alt="Company Logo" className={classes.logoImage} />
                </Link>
                <nav>
                    <ul>
                        {user ? (
                            <li className={classes.menu_container}>
                                <Link to="/dashboard">{user.name}</Link>
                                <div className={classes.menu}>
                                    <Link to="/foodprofile">Profile</Link>
                                    <Link to="/orders">Orders</Link>
                                    <a onClick={logout}>Logout</a>
                                </div>
                            </li>
                        ) : (
                            <Link to="/Login">Login</Link>
                        )}

                        <li>
                            <Link to="/cart">
                                Cart
                                {cart.totalCount > 0 && (
                                    <span className={classes.cart_count}>{cart.totalCount}</span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
