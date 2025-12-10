import axios from 'axios';
import authHeader from './auth-header'; 

const API_URL = '/api/categories';

const getAllCategories = () => {
    return axios.get(API_URL);
};

const createCategory = (categoryData) => {
    return axios.post(API_URL, categoryData, { headers: authHeader() });
};

const getCategoryById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const updateCategory = (id, categoryData) => {
    return axios.put(`${API_URL}/${id}`, categoryData, { headers: authHeader() });
};

const deleteCategory = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};


const categoryService = {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
};

export default categoryService;
