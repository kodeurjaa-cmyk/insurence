import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, DollarSign, Send, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';

const App = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [policyData, setPolicyData] = useState(null);
    const [refinementInput, setRefinementInput] = useState('');

    const [formData, setFormData] = useState({
        client_details: {
            age: 30,
            gender: 'male',
            income: 50000,
            lifestyle: 'standard',
            medical_history: false
        },
        insurance_details: {
            type: 'life',
            coverage_amount: 100000
        }
    });

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/policies/', formData);
            setPolicyData(response.data);
            setStep(2);
        } catch (error) {
            console.error("Error generating policy:", error);
            alert("Failed to generate policy. Make sure backend is running.");
        }
        setLoading(false);
    };

    const handleRefine = async () => {
        if (!refinementInput) return;
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/prompts/refine', {
                policy_id: policyData.policy_id,
                prompt: refinementInput,
                current_text: policyData.policy_text
            });
            setPolicyData({ ...policyData, policy_text: response.data.updated_policy_text });
            setRefinementInput('');
        } catch (error) {
            console.error("Error refining policy:", error);
        }
        setLoading(false);
    };

    const handleExport = async (format) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/policies/${policyData.policy_id}/export`, {
                format,
                policy_text: policyData.policy_text
            }, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `policy_${policyData.policy_id}.${format}`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Export failed:", error);
        }
    };

    return (
        <div className="app-container">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Antigravity Insurance AI</h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '3rem' }}>
                    Personalized protection, powered by Intelligence.
                </p>
            </motion.header>

            <main style={{ width: '100%', maxWidth: '1000px' }}>
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="glass-card"
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h3 style={{ marginBottom: '1.5rem' }}>Client Profile</h3>
                                    <label>Age</label>
                                    <input type="number" value={formData.client_details.age} onChange={(e) => setFormData({ ...formData, client_details: { ...formData.client_details, age: parseInt(e.target.value) } })} />

                                    <label>Annual Income ($)</label>
                                    <input type="number" value={formData.client_details.income} onChange={(e) => setFormData({ ...formData, client_details: { ...formData.client_details, income: parseInt(e.target.value) } })} />

                                    <label>Lifestyle</label>
                                    <select value={formData.client_details.lifestyle} onChange={(e) => setFormData({ ...formData, client_details: { ...formData.client_details, lifestyle: e.target.value } })}>
                                        <option value="standard">Standard</option>
                                        <option value="active">Active</option>
                                        <option value="high_risk">High Risk</option>
                                    </select>
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '1.5rem' }}>Insurance Details</h3>
                                    <label>Insurance Type</label>
                                    <select value={formData.insurance_details.type} onChange={(e) => setFormData({ ...formData, insurance_details: { ...formData.insurance_details, type: e.target.value } })}>
                                        <option value="life">Life Insurance</option>
                                        <option value="health">Health Insurance</option>
                                        <option value="auto">Auto Insurance</option>
                                        <option value="property">Property Insurance</option>
                                    </select>

                                    <label>Coverage Amount ($)</label>
                                    <input type="number" value={formData.insurance_details.coverage_amount} onChange={(e) => setFormData({ ...formData, insurance_details: { ...formData.insurance_details, coverage_amount: parseInt(e.target.value) } })} />
                                </div>
                            </div>

                            <button
                                className="btn-primary"
                                style={{ width: '100%', marginTop: '2rem' }}
                                onClick={handleGenerate}
                                disabled={loading}
                            >
                                {loading ? <RefreshCw className="animate-spin" /> : 'Generate Personalized Policy'}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="policy-view"
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                                <div className="glass-card" style={{ height: 'fit-content' }}>
                                    <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}><Shield size={18} /> Risk Profile</h4>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{policyData.risk_assessment.score} Risk</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{policyData.risk_assessment.explanation}</p>

                                    <hr style={{ margin: '1.5rem 0', opacity: 0.1 }} />

                                    <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}><DollarSign size={18} /> Pricing</h4>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>${policyData.pricing.monthly_premium} /mo</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>${policyData.pricing.yearly_premium} /yr (save 5%)</p>

                                    <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleExport('pdf')} className="btn-primary" style={{ flex: 1, padding: '8px' }}><Download size={16} /> PDF</button>
                                        <button onClick={() => handleExport('docx')} className="btn-primary" style={{ flex: 1, padding: '8px', background: 'var(--accent)' }}><Download size={16} /> DOCX</button>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ textAlign: 'left' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3>Generated Policy</h3>
                                        <button onClick={() => setStep(1)} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border)' }}>Start Over</button>
                                    </div>

                                    <div style={{
                                        maxHeight: '500px',
                                        overflowY: 'auto',
                                        padding: '1.5rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderRadius: '12px',
                                        whiteSpace: 'pre-wrap',
                                        fontSize: '0.95rem'
                                    }}>
                                        {policyData.policy_text}
                                    </div>

                                    <div style={{ marginTop: '2rem' }}>
                                        <label>Refine with AI (e.g., "make it more affordable" or "increase dental coverage")</label>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <input
                                                type="text"
                                                placeholder="Type your refinement request..."
                                                value={refinementInput}
                                                onChange={(e) => setRefinementInput(e.target.value)}
                                                style={{ marginBottom: 0 }}
                                            />
                                            <button className="btn-primary" onClick={handleRefine} disabled={loading}>
                                                {loading ? <RefreshCw className="spin" /> : <Send size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default App;
