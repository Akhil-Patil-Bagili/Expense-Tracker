// ChatBot.js
import React, { useState } from 'react';

function ChatBot() {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = () => {
        // Retrieve the token from local storage
        const token = localStorage.getItem('access');

        // Include the token in the Authorization header
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
        })
        .catch((error) => {
            console.error('Error:', error);
            setMessages([...messages, `Error: ${error.message}`]);
        });
    };

    return (
        <div className="chatbot-container">
            <div className="messages-container">
                {messages.map((message, index) => (
                    <p key={index} className="message">{message}</p>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    className="chat-input"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Ask me something..."
                />
                <button className="send-btn" onClick={handleSubmit}>Send</button>
            </div>
        </div>
    );
}

export default ChatBot;
