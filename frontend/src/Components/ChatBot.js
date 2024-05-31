import React, { useState } from 'react';
import "../Styles/App.css";
import avatarIcon from '../Styles/chat_bot.png'; 
import { AiOutlineCloseCircle, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function ChatBot() {
    const [userInput, setUserInput] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); 
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen && !sessionStorage.getItem('openaiApiKey')) {
            setShowApiKeyModal(true);
        } else if (!isOpen) {
            setIsOpen(false);
        }
    };

    const handleApiKeySubmit = () => {
        if (!apiKey) {
            alert("Please enter an API key to continue.");
            return;
        }
        sessionStorage.setItem('openaiApiKey', apiKey);
        setShowApiKeyModal(false);
    };

    const handleCancel = () => {
        setShowApiKeyModal(false);
        setIsOpen(false);
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleApiKeyChange = (event) => {
        setApiKey(event.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = () => {
        if (!apiKey) {
            setShowApiKeyModal(true);
            return;
        }
        setIsLoading(true);
        const token = localStorage.getItem('access');
        fetch('http://localhost:8000/api/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query: userInput, apiKey: apiKey }),
        })
        .then(response => response.json())
        .then(data => {
            setMessages([...messages, `You: ${userInput}`, `Bot: ${data.response}`]);
            setUserInput('');
            setIsLoading(false);
        })
        .catch((error) => {
            console.error('Error:', error);
            setMessages([...messages, `Error: ${error.message}`]);
            setIsLoading(false);
        });
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : 'closed'}`}>
            {showApiKeyModal && (
                <div className="api-key-modal-overlay">
                    <div className="api-key-modal-content">
                        <h3>Please enter your OpenAI API Key:</h3>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={apiKey}
                                onChange={handleApiKeyChange}
                                placeholder="API Key"
                                className="api-key-input"
                            />
                            <span onClick={togglePasswordVisibility} className="toggle-password-icon">
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                        <div className="btn-field">
                            <button onClick={handleApiKeySubmit} className="submit-btn">Submit</button>
                            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {isOpen && (
                <div className="chat-interface">
                    <div className="messages-container">
                        {messages.map((message, index) => (
                            <p key={index} className="message">{message}</p>
                        ))}
                        {isLoading && <p className="loading-message">Loading...</p>}
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            className="chat-input"
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyPress={e => e.key === 'Enter' && handleSubmit()}
                            placeholder="Ask me something..."
                        />
                        <button className="send-btn" onClick={handleSubmit}>Send</button>
                    </div>
                </div>
            )}
            <div className="chat-toggle" onClick={toggleChat}>
                {isOpen ? <AiOutlineCloseCircle className="close-btn" /> : <img src={avatarIcon} alt="Chatbot Avatar" className="chat-avatar-icon" />}
            </div>
        </div>
    );
}

export default ChatBot;