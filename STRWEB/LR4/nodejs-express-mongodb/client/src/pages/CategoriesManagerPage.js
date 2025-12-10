import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../services/categoryService';
import { formatDateTime } from '../utils/dateFormatter'; 
import './CategoriesManagerPage.css';

const CategoriesManagerPage = ({ showAdminBoard }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for inline editing
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');


    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        setLoading(true);
        categoryService.getAllCategories()
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('There was an error fetching the categories!');
                setLoading(false);
                console.error('Error fetching categories:', error);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            categoryService.deleteCategory(id)
                .then(() => {
                    setCategories(categories.filter(c => c._id !== id));
                })
                .catch(error => {
                    console.error('Error deleting category:', error);
                });
        }
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setEditName(category.name);
        setEditDescription(category.description);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditName('');
        setEditDescription('');
    };

    const handleUpdate = (id) => {
        categoryService.updateCategory(id, { name: editName, description: editDescription })
            .then(() => {
                handleCancel(); 
                loadCategories(); 
            })
            .catch(error => {
                console.error('Error updating category:', error);
            });
    };


    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="categories-manager-page">
            <div className="page-header">
                <h1>Manage Categories</h1>
                {showAdminBoard && (
                    <Link to="/add-category" className="action-button">Add New Category</Link>
                )}
            </div>
            <ul className="categories-list">
                {categories.map(category => (
                    <li key={category._id} className="category-item">
                        {editingId === category._id && showAdminBoard ? (
                            <>
                                <div className="category-details">
                                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="edit-input" />
                                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="edit-textarea" />
                                    <p className="category-date">Created At (Local): <span>{formatDateTime(category.createdAt)}</span></p>
                                    <p className="category-date">Created At (UTC): <span>{formatDateTime(category.createdAt, 'utc')}</span></p>
                                    <p className="category-date">Last Updated (Local): <span>{formatDateTime(category.updatedAt)}</span></p>
                                    <p className="category-date">Last Updated (UTC): <span>{formatDateTime(category.updatedAt, 'utc')}</span></p>
                                </div>
                                <div className="category-actions">
                                    <button onClick={() => handleUpdate(category._id)} className="action-button save-button">Save</button>
                                    <button onClick={handleCancel} className="action-button cancel-button">Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="category-details">
                                    <strong>{category.name}</strong>
                                    <p>{category.description}</p>
                                    <p className="category-date">Created At (Local): <span>{formatDateTime(category.createdAt)}</span></p>
                                    <p className="category-date">Created At (UTC): <span>{formatDateTime(category.createdAt, 'utc')}</span></p>
                                    <p className="category-date">Last Updated (Local): <span>{formatDateTime(category.updatedAt)}</span></p>
                                    <p className="category-date">Last Updated (UTC): <span>{formatDateTime(category.updatedAt, 'utc')}</span></p>
                                </div>
                                {showAdminBoard && (
                                    <div className="category-actions">
                                        <button onClick={() => handleEdit(category)} className="action-button edit-button">Edit</button> 
                                        <button onClick={() => handleDelete(category._id)} className="action-button delete-button">Delete</button>
                                    </div>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoriesManagerPage;
