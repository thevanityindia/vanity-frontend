import React, { useState, useRef, useEffect } from 'react';
import './ChatAssistant.css';
import API_BASE_URL from '../config';
import logo from '../assets/logo.jpg';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi there! 👋 I\'m your Vanity Assistant. How can I help you regarding our beauty products or your orders today?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = inputText;
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInputText('');
        setIsTyping(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, { type: 'bot', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { type: 'bot', text: "I'm having trouble connecting right now. Please try again later." }]);
            }
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { type: 'bot', text: "Sorry, something went wrong. Please check your internet connection." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="chat-widget-container">
            {/* Chat Button */}
            <button
                className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Chat with us"
            >
                {isOpen ? (
                    <span className="close-icon">✕</span>
                ) : (
                    <img src={logo} alt="Vanity" className="chat-logo-icon" />
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <h3>Vanity Assistant</h3>
                            <span className="status-dot"></span>
                        </div>
                        <button className="chat-close-btn" onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`}>
                                <div className="message-content">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <button type="submit" disabled={!inputText.trim()}>
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatAssistant;
