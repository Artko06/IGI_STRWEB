import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';
import categoryService from '../services/categoryService';
import './AddCategoryPage.css';

const AddCategoryPage = () => {
    const navigate = useNavigate();

    const handleSave = (categoryData) => {
        categoryService.createCategory(categoryData)
            .then(() => {
               
                navigate('/categories'); 
            })
            .catch(error => {
                console.error('Error creating category:', error);
            });
    };

    return (
        <div className="add-category-page">
            <h1>Add New Category</h1>
            <CategoryForm onSave={handleSave} />
        </div>
    );
};

export default AddCategoryPage;
