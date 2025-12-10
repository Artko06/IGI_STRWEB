import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import productService from '../services/productService';

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
                console.error('Error fetching product:', error);
                setError('Failed to fetch product data.');
                setLoading(false);
            });
    }, [id]);

    const handleSave = (productData) => {
        productService.updateProduct(id, productData)
            .then(() => {
                navigate('/products');
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
    };

    if (loading) {
        return <div>Loading product...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="edit-product-page">
            <h1>Edit Product</h1>
            {product && <ProductForm onSave={handleSave} initialData={product} />}
        </div>
    );
};

export default EditProductPage;
