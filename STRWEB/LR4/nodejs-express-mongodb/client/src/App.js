import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";

import authService from "./services/auth.service";

import NavigationBar from './components/NavigationBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AuthSuccessPage from './pages/AuthSuccessPage'; 

import ProductsListPage from './pages/ProductsListPage';
import ProductDetailPage from './pages/ProductDetailPage'; 
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import CategoriesManagerPage from './pages/CategoriesManagerPage';
import AddCategoryPage from './pages/AddCategoryPage';


const App = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logOut = () => {
    authService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);

    window.location.href = "/login";
  };

  return (
    <Router>
      <div>
        <NavigationBar currentUser={currentUser} showAdminBoard={showAdminBoard} logOut={logOut} />
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsListPage showAdminBoard={showAdminBoard} />} />
            <Route path="/products/:id" element={<ProductDetailPage />} /> 
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
            <Route path="/categories" element={<CategoriesManagerPage showAdminBoard={showAdminBoard} />} />
            <Route path="/add-category" element={<AddCategoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth-success" element={<AuthSuccessPage />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;