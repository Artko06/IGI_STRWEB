import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = ({ currentUser, showAdminBoard, logOut }) => {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">Household Chemicals</Link>

            <div className="navbar-links"> 
                <Link to="/products" className="nav-link">Products</Link>

                {showAdminBoard && (
                    <>
                        <Link to="/categories" className="nav-link">Manage Categories</Link>
                        <Link to="/add-product" className="nav-link">Add Product</Link>
                    </>
                )}
            </div>

            <div className="navbar-links-right">
                {currentUser ? (
                    <>
                        <Link to="/profile" className="nav-link">{currentUser.username}</Link>
                        <a href="/login" className="nav-link" onClick={logOut}>Logout</a>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavigationBar;
