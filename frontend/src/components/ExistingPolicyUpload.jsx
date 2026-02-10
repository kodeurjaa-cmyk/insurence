import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaFilePdf, FaFileWord, FaComments, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Chatbot from './Chatbot';
import './ExistingPolicyUpload.css';

const ExistingPolicyUpload = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [policyData, setPolicyData] = useState(null);
    const [error, setError] = useState('');
    const [showChatbot, setShowChatbot] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (!validTypes.includes(selectedFile.type)) {
            setError('Please upload a PDF or DOC file');
            return;
        }

        setFile(selectedFile);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                navigate('/policy-output', {
                    state: {
                        policyData: response.data
                    }
                });
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="existing-policy-container">
            <div className="policy-header">
                <button className="btn-back" onClick={() => navigate('/')}>
                    <FaArrowLeft /> Back
                </button>
                <h1>Existing Policy Analysis</h1>
                <p>Upload your current policy for AI-powered insights</p>
            </div>

            {!policyData ? (
                <div className="upload-section card">
                    <div
                        className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <FaCloudUploadAlt className="upload-icon" />
                        <h3>Drag & Drop your policy file here</h3>
                        <p>or</p>
                        <label htmlFor="file-input" className="btn btn-primary">
                            Choose File
                        </label>
                        <input
                            id="file-input"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileInput}
                            style={{ display: 'none' }}
                        />
                        <div className="supported-formats">
                            <FaFilePdf className="format-icon pdf" /> PDF
                            <FaFileWord className="format-icon doc" /> DOC/DOCX
                        </div>
                    </div>

                    {file && (
                        <div className="selected-file">
                            <p><strong>Selected:</strong> {file.name}</p>
                            <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Upload & Analyze'}
                            </button>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}
                </div>
            ) : (
                <div className="policy-content">
                    <div className="policy-summary card">
                        <div className="summary-header">
                            <h2>Policy Summary</h2>
                            <button className="btn-chatbot" onClick={() => setShowChatbot(true)}>
                                <FaComments /> Ask Questions
                            </button>
                        </div>
                        <div className="policy-info">
                            <p><strong>File:</strong> {policyData.filename}</p>
                            <p><strong>Word Count:</strong> {policyData.wordCount}</p>
                        </div>
                        <div className="policy-text">
                            <pre>{policyData.text}</pre>
                        </div>
                    </div>
                </div>
            )}

            {showChatbot && policyData && (
                <Chatbot
                    policyContext={policyData.text}
                    onClose={() => setShowChatbot(false)}
                />
            )}
        </div>
    );
};

export default ExistingPolicyUpload;
