import axios from 'axios';
import authHeader from './auth-header'; 

const API_URL = '/api/ollama/';

const generateContent = (imageData) => {
    return axios.post(API_URL + 'generate', imageData, { headers: authHeader() });
};

const getModels = () => {
    return axios.get(API_URL + 'models', { headers: authHeader() });
};

const ollamaService = {
    generateContent,
    getModels,
};

export default ollamaService;
