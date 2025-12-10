import axios from 'axios';
import authHeader from './auth-header'; 

const API_URL = '/api/products'; 

const getAllProducts = (name = '', categoryId = '') => { 
    return axios.get(API_URL, { params: { name, category: categoryId } });
};

const getById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const createProduct = (productData) => {
    return axios.post(API_URL, productData, { headers: authHeader() });
};

const updateProduct = (id, productData) => {
    return axios.put(`${API_URL}/${id}`, productData, { headers: authHeader() });
};

const deleteProduct = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const productService = {
    getAllProducts,
    getById,
    createProduct,
    updateProduct,
    deleteProduct,
};

export default productService;
