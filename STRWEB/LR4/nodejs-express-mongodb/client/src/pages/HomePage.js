import React, { useState, useEffect } from 'react';
import ollamaService from '../services/ollamaService'; 
import authService from '../services/auth.service'; 
import './HomePage.css';

const HomePage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [ollamaModels, setOllamaModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [prompt, setPrompt] = useState('');
    const [ollamaResults, setOllamaResults] = useState(null);
    const [ollamaLoading, setOllamaLoading] = useState(false);
    const [ollamaError, setOllamaError] = useState(null);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [hoverStatus, setHoverStatus] = useState('Not hovering');

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setIsUserLoggedIn(true);
        }

        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); 

        return () => clearInterval(timerId); 
    }, []);

    useEffect(() => {
        if (isUserLoggedIn) {
            ollamaService.getModels()
                .then(response => {
                    const models = response.data.models;
                    if (Array.isArray(models)) { 
                        setOllamaModels(models);
                    } else {
                        console.warn('Ollama API did not return an array for models:', response.data);
                        setOllamaModels([]);
                    }
                })
                .catch(error => {
                    setOllamaError(error.response?.data?.message || 'Error fetching Ollama models.');
                    console.error('Error fetching Ollama models:', error);
                    setOllamaModels([]);
                });
        }
    }, [isUserLoggedIn]);

    useEffect(() => {
        if (ollamaModels.length > 0 && !selectedModel) {
            setSelectedModel(ollamaModels[0].name);
        } else if (ollamaModels.length === 0 && selectedModel) {
            setSelectedModel('');
        }
    }, [ollamaModels, selectedModel]); 


    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    const localDateTime = new Intl.DateTimeFormat(undefined, options).format(currentTime);
    const utcDateTime = new Intl.DateTimeFormat(undefined, { ...options, timeZone: 'UTC' }).format(currentTime);

    const handleGenerateContent = async () => {
        setOllamaLoading(true);
        setOllamaResults(null);
        setOllamaError(null);

        if (!selectedModel) {
            setOllamaError('Please select an Ollama model.');
            setOllamaLoading(false);
            return;
        }

        try {
            const response = await ollamaService.generateContent({ model: selectedModel, prompt });
            setOllamaResults(response.data.response);
        } catch (error) {
            setOllamaError(error.response?.data?.error || error.response?.data?.message || 'Error generating content.');
            console.error('Ollama generation error:', error);
        } finally {
            setOllamaLoading(false);
        }
    };


    return (
        <div className="home-page">
            <header className="home-header">
                <h1 onDoubleClick={() => alert('You double-clicked the title!')}>Welcome to the Household Chemicals Store</h1>
                <p>Your one-stop shop for all cleaning and household needs.</p>
            </header>
            <section className="current-time-section">
                <h2>Current Date & Time</h2>
                <p>Local Time: <span>{localDateTime}</span></p>
                <p>UTC Time: <span>{utcDateTime}</span></p>
            </section>

            {isUserLoggedIn && ( 
                <section className="ollama-ai-section">
                    <h2>Ollama AI Integration</h2>
                    <div className="ollama-controls-group">
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="ollama-model-select"
                            disabled={ollamaModels.length === 0}
                        >
                            {ollamaModels.length === 0 ? (
                                <option value="">No models available</option>
                            ) : (
                                ollamaModels.map(model => (
                                    <option key={model.name} value={model.name}>{model.name}</option>
                                ))
                            )}
                        </select>
                        <textarea
                            placeholder="Enter your prompt here..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.ctrlKey && e.key === 'Enter') {
                                    handleGenerateContent();
                                }
                            }}
                            className="ollama-prompt-textarea"
                            rows="4"
                        ></textarea>
                    </div>
                    <button
                        onClick={handleGenerateContent}
                        onMouseEnter={() => setHoverStatus('Hovering!')}
                        onMouseLeave={() => setHoverStatus('Not hovering')}
                        disabled={ollamaLoading || !selectedModel || !prompt}
                        className="ollama-generate-button"
                    >
                        {ollamaLoading ? 'Generating...' : 'Generate Content'}
                    </button>
                    <p>Button hover status: {hoverStatus}</p>

                    {ollamaError && <div className="ollama-error-message">{ollamaError}</div>}

                    {ollamaResults && (
                        <div className="ollama-results">
                            <h3>Generation Results:</h3>
                            <pre>{ollamaResults.response || JSON.stringify(ollamaResults, null, 2)}</pre>
                        </div>
                    )}
                </section>
            )}

            <section className="home-content">
                <h2>About Us</h2>
                <p>We provide high-quality products to keep your home clean and safe.</p>
            </section>
        </div>
    );
};

export default HomePage;
