import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaPlus } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="landing-header fade-in">
                    <h1>Antigravity Insurance AI</h1>
                    <p className="subtitle">Personalized protection, powered by intelligence</p>
                </div>

                <div className="options-container">
                    <div
                        className="option-card card fade-in"
                        onClick={() => navigate('/existing-policy')}
                        style={{ animationDelay: '0.1s' }}
                    >
                        <div className="option-icon">
                            <FaFileAlt />
                        </div>
                        <h2>Existing Policy</h2>
                        <p>Upload and analyze your current insurance policy with AI-powered insights</p>
                        <div className="option-features">
                            <span className="feature-tag">✓ Policy Analysis</span>
                            <span className="feature-tag">✓ AI Chatbot</span>
                            <span className="feature-tag">✓ Coverage Review</span>
                        </div>
                    </div>

                    <div
                        className="option-card card fade-in"
                        onClick={() => navigate('/new-policy')}
                        style={{ animationDelay: '0.2s' }}
                    >
                        <div className="option-icon primary">
                            <FaPlus />
                        </div>
                        <h2>New Policy</h2>
                        <p>Generate a personalized insurance policy tailored to your needs</p>
                        <div className="option-features">
                            <span className="feature-tag">✓ Risk Assessment</span>
                            <span className="feature-tag">✓ AI Generation</span>
                            <span className="feature-tag">✓ Instant Pricing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
