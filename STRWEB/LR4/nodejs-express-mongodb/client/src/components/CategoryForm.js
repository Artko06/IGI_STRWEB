import React, { useState } from 'react';
import './CategoryForm.css';

const CategoryForm = ({ onSave, initialData = {} }) => {
    const [name, setName] = useState(initialData.name || '');
    const [description, setDescription] = useState(initialData.description || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, description });
    };

    return (
        <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
                <label htmlFor="name">Category Name</label>
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
            <button type="submit" className="save-button">Save Category</button>
        </form>
    );
};

export default CategoryForm;
