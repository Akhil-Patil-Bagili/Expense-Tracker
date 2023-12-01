import React, { useState } from 'react';
import "../Styles/App.css";
import avatarIcon from '../Styles/chat_bot.png'; 
import { AiOutlineCloseCircle } from "react-icons/ai";

function ChatBot() {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); 

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = () => {
        setIsLoading(true);
        const token = localStorage.getItem('access');
        fetch('http://localhost:8000/api/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query: userInput }),
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

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : 'closed'}`}>
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
                            onKeyPress={handleKeyPress}
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
