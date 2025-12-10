import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService'; 
import './ProductsListPage.css';

const ProductsListPage = ({ showAdminBoard }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [sortCategory, setSortCategory] = useState(''); 
    const [categories, setCategories] = useState([]); 
    const [filterCategory, setFilterCategory] = useState('');


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); 

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        categoryService.getAllCategories()
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        productService.getAllProducts(debouncedSearchTerm, filterCategory) 
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('There was an error fetching the products!');
                setLoading(false);
                console.error('Error fetching products:', error);
            });
    }, [debouncedSearchTerm, filterCategory]); 

    const sortedProducts = useMemo(() => {
        let sortableProducts = [...products];
        if (sortCategory === 'categoryName') {
            sortableProducts.sort((a, b) => {
                const categoryA = a.category ? a.category.name.toLowerCase() : '';
                const categoryB = b.category ? b.category.name.toLowerCase() : '';
                if (categoryA < categoryB) return -1;
                if (categoryA > categoryB) return 1;
                return 0;
            });
        }
        return sortableProducts;
    }, [products, sortCategory]);


    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            productService.deleteProduct(id)
                .then(() => {
                    setProducts(products.filter(p => p.id !== id));
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                });
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="products-list-page">
            <h1>Our Products</h1>
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="filter-select" 
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div className="products-grid">
                {sortedProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <Link to={`/products/${product.id}`} className="product-card-link">
                            {product.category && <p className="category-badge">{product.category.name}</p>}
                            <h3>{product.name}</h3>
                            <p className="price">BYN {product.price}</p>
                        </Link>
                        {showAdminBoard && (
                            <div className="card-actions">
                                <Link to={`/edit-product/${product.id}`} className="action-button edit-button">Edit</Link>
                                <button onClick={() => handleDelete(product.id)} className="action-button delete-button">Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsListPage;
