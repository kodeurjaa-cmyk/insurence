import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaDownload, FaComments, FaFilePdf, FaFileWord, FaArrowLeft, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import jsPDF from 'jspdf';
import Chatbot from './Chatbot';
import './PolicyOutputPage.css';

const PolicyOutputPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { policyData } = location.state || {};

    const [showChatbot, setShowChatbot] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    if (!policyData) {
        return (
            <div className="error-container">
                <h2>No policy data found</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Go Home
                </button>
            </div>
        );
    }

    const { policy_text, risk_assessment, pricing } = policyData;

    // Get cleaned text for audio (without symbols)
    const getCleanTextForAudio = () => {
        if (!policy_text) return '';
        return policy_text
            .replace(/\*\*/g, '')
            .replace(/##/g, '')
            .replace(/\*/g, '')
            .replace(/---/g, '');
    };

    const handlePlayAudio = () => {
        if ('speechSynthesis' in window) {
            if (isPlaying) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
            } else {
                const cleanText = getCleanTextForAudio();
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.onend = () => setIsPlaying(false);
                window.speechSynthesis.speak(utterance);
                setIsPlaying(true);
            }
        } else {
            alert('Text-to-speech is not supported in your browser');
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const cleanText = getCleanTextForAudio();

        // Set font and size
        doc.setFontSize(10);

        // Split text into lines that fit the page width
        const lines = doc.splitTextToSize(cleanText, 180);

        // Add text to PDF with pagination
        let y = 20;
        lines.forEach((line, index) => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, 15, y);
            y += 7;
        });

        // Save the PDF
        doc.save(`policy_${policyData.policy_id || 'document'}.pdf`);
    };

    const handleDownloadDOC = () => {
        const cleanText = getCleanTextForAudio();

        // Create HTML content for DOC
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Insurance Policy</title>
            </head>
            <body>
                <pre style="font-family: Arial, sans-serif; font-size: 12pt; white-space: pre-wrap;">${cleanText}</pre>
            </body>
            </html>
        `;

        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `policy_${policyData.policy_id || 'document'}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getRiskColor = (score) => {
        const scoreUpper = score?.toUpperCase() || '';
        if (scoreUpper.includes('LOW')) return 'success';
        if (scoreUpper.includes('MEDIUM')) return 'warning';
        if (scoreUpper.includes('HIGH')) return 'error';
        return 'info';
    };

    const getRiskIcon = (score) => {
        const scoreUpper = score?.toUpperCase() || '';
        if (scoreUpper.includes('LOW')) return <FaCheckCircle />;
        if (scoreUpper.includes('MEDIUM')) return <FaInfoCircle />;
        if (scoreUpper.includes('HIGH')) return <FaExclamationTriangle />;
        return <FaInfoCircle />;
    };

    const formatPolicyText = (text) => {
        if (!text) return '';

        // Remove ** and ## symbols but preserve structure
        let formatted = text
            .replace(/\*\*/g, '')  // Remove all **
            .replace(/##/g, '')    // Remove all ##
            .replace(/\*/g, '');   // Remove all remaining *

        // Split into lines for formatting
        const lines = formatted.split('\n');
        const formattedLines = lines.map(line => {
            const trimmed = line.trim();

            // Check if line is a main heading (starts with number like "1." or has colon at end)
            if (/^\d+\./.test(trimmed) || trimmed.endsWith(':')) {
                return `<strong>${line}</strong>`;
            }
            // Regular text
            return line;
        });

        return formattedLines.join('<br />');
    };

    const formatRiskFactor = (factor) => {
        // Handle if factor is an object with description, impact, name
        if (typeof factor === 'object' && factor !== null) {
            if (factor.name || factor.description) {
                return factor.name || factor.description || JSON.stringify(factor);
            }
            return JSON.stringify(factor);
        }
        // Handle if factor is a string
        return factor;
    };

    return (
        <div className="policy-output-container">
            <button className="btn-back" onClick={() => navigate('/')}>
                <FaArrowLeft /> Back to Home
            </button>

            <div className="output-grid">
                {/* Left Section - Audio Player */}
                <div className="audio-section card">
                    <h3>Policy Narration</h3>
                    <div className="audio-player">
                        <div className="audio-visual">
                            {isPlaying ? (
                                <div className="eq-bars">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            ) : (
                                <FaPlay className="play-icon-large" />
                            )}
                        </div>
                        <button className="play-btn" onClick={handlePlayAudio}>
                            {isPlaying ? <><FaPause /> Pause</> : <><FaPlay /> Play Policy</>}
                        </button>
                        <p className="audio-hint">
                            Listen to your policy with professional AI narration
                        </p>
                    </div>
                </div>

                {/* Center Section - Policy Details */}
                <div className="policy-section card">
                    <div className="policy-header-section">
                        <h2>Your Personalized Policy</h2>
                        <button className="btn-chatbot" onClick={() => setShowChatbot(true)}>
                            <FaComments /> Ask Questions
                        </button>
                    </div>

                    <div className="policy-content">
                        <div dangerouslySetInnerHTML={{ __html: formatPolicyText(policy_text) }} />
                    </div>
                </div>

                {/* Right Section - Insights Panel */}
                <div className="insights-section">
                    <div className={`risk-card card risk-${getRiskColor(risk_assessment?.score)}`}>
                        <h3>Risk Assessment</h3>
                        <div className="risk-badge">
                            {getRiskIcon(risk_assessment?.score)}
                            <span className="risk-level">{risk_assessment?.score || 'Medium'}</span>
                        </div>
                        {risk_assessment?.factors && (
                            <div className="risk-factors">
                                <h4>Risk Factors:</h4>
                                <ul>
                                    {risk_assessment.factors.map((factor, idx) => (
                                        <li key={idx}>{formatRiskFactor(factor)}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="pricing-card card">
                        <h3>Premium Details</h3>
                        <div className="price-display">
                            <div className="monthly-price">
                                <span className="price-label">Monthly</span>
                                <span className="price-value">${pricing?.monthly_premium || 0}</span>
                            </div>
                            <div className="yearly-price">
                                <span className="price-label">Yearly</span>
                                <span className="price-value">${pricing?.yearly_premium || 0}</span>
                            </div>
                        </div>
                        <div className="coverage-info">
                            <p><strong>Coverage Estimates:</strong></p>
                            <p className="coverage-amount">${(policyData.insurance_details?.coverage_amount || pricing?.coverage_amount || 0).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="download-card card">
                        <h3>Download Policy</h3>
                        <div className="download-buttons">
                            <button className="download-btn pdf" onClick={handleDownloadPDF}>
                                <FaFilePdf /> PDF
                            </button>
                            <button className="download-btn doc" onClick={handleDownloadDOC}>
                                <FaFileWord /> DOC
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showChatbot && (
                <Chatbot
                    policyContext={policy_text}
                    onClose={() => setShowChatbot(false)}
                />
            )}
        </div>
    );
};

export default PolicyOutputPage;
