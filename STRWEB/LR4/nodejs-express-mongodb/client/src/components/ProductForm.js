import React, { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';
import './ProductForm.css';

const ProductForm = ({ onSave, initialData = {} }) => {
    const [name, setName] = useState(initialData.name || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [price, setPrice] = useState(initialData.price || '');
    const [category, setCategory] = useState(initialData.category?._id || '');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        categoryService.getAllCategories()
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the categories!", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, description, price, category });
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                />
            </div>
            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="save-button">Save Product</button>
        </form>
    );
};

export default ProductForm;
