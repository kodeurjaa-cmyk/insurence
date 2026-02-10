import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = ({ policyContext, onClose }) => {
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I can answer questions about your policy. What would you like to know?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/query`, {
                question: userMessage,
                policy_context: policyContext
            });

            if (response.data.success) {
                setMessages(prev => [...prev, { type: 'bot', text: response.data.answer }]);
            } else {
                setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I couldn\'t process that question.' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { type: 'bot', text: 'Error: Unable to get a response. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chatbot-overlay">
            <div className="chatbot-container card">
                <div className="chatbot-header">
                    <div className="header-title">
                        <FaRobot className="bot-icon" />
                        <h3>Policy Assistant</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.type}`}>
                            <div className="message-content">
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message bot">
                            <div className="message-content typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chatbot-input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a question about your policy..."
                        disabled={loading}
                    />
                    <button className="send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
