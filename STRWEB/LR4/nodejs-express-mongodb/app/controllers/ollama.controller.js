const axios = require('axios');

const OLLAMA_API_URL = 'http://localhost:11434/api'; 

exports.generateContent = async (req, res) => {
    try {
        const { model, prompt } = req.body;

        if (!model || !prompt) {
            return res.status(400).send({ message: 'Model and prompt are required.' });
        }

        let payload = {
            model,
            prompt,
            stream: false, 
        };

        const ollamaResponse = await axios.post(`${OLLAMA_API_URL}/generate`, payload);

        res.send({
            message: 'Content generated successfully.',
            response: ollamaResponse.data,
        });

    } catch (err) {
        console.error('ERROR generating content with Ollama:', err.response?.data || err.message);
        res.status(500).send({
            message: 'Failed to generate content with Ollama.',
            error: err.response?.data || err.message
        });
    }
};

exports.getModels = async (req, res) => {
    try {
        const ollamaResponse = await axios.get(`${OLLAMA_API_URL}/tags`);
        res.send({
            message: 'Ollama models retrieved successfully.',
            models: ollamaResponse.data.models,
        });
    } catch (err) {
        console.error('ERROR retrieving Ollama models:', err.response?.data || err.message);
        res.status(500).send({
            message: 'Failed to retrieve Ollama models.',
            error: err.response?.data || err.message
        });
    }
};