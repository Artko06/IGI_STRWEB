import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import { formatDateTime } from '../utils/dateFormatter'; 
import './ProductDetailPage.css'; 

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        productService.getById(id)
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('There was an error fetching the product details!');
                setLoading(false);
                console.error('Error fetching product details:', error);
            });
    }, [id]);

    if (loading) {
        return <div className="product-detail-page loading">Loading product details...</div>;
    }

    if (error) {
        return <div className="product-detail-page error">{error}</div>;
    }

    if (!product) {
        return <div className="product-detail-page error">Product not found.</div>;
    }

    return (
        <div className="product-detail-page">
            <div className="product-detail-card">
                <Link to="/products" className="back-button">← Back to Products</Link>
                <h1>{product.name}</h1>
                {product.category && (
                    <p className="product-category">
                        Category: <span>{product.category.name}</span>
                    </p>
                )}
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: <span>BYN {product.price}</span></p>
                
                <p className="product-date">Created At (Local): <span>{formatDateTime(product.createdAt)}</span></p>
                <p className="product-date">Created At (UTC): <span>{formatDateTime(product.createdAt, 'utc')}</span></p>
                <p className="product-date">Last Updated (Local): <span>{formatDateTime(product.updatedAt)}</span></p>
                <p className="product-date">Last Updated (UTC): <span>{formatDateTime(product.updatedAt, 'utc')}</span></p>
            </div>
        </div>
    );
};

export default ProductDetailPage;
