import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import productService from '../services/productService';
import './AddProductPage.css';

const AddProductPage = () => {
    const navigate = useNavigate();

    const handleSave = (productData) => {
        productService.createProduct(productData)
            .then(() => {
                navigate('/products');
            })
            .catch(error => {
                console.error('Error creating product:', error);
            });
    };

    return (
        <div className="add-product-page">
            <h1>Add New Product</h1>
            <ProductForm onSave={handleSave} />
        </div>
    );
};

export default AddProductPage;
