import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ExistingPolicyUpload from './components/ExistingPolicyUpload';
import NewPolicyForm from './components/NewPolicyForm';
import PolicyOutputPage from './components/PolicyOutputPage';
import './index.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/existing-policy" element={<ExistingPolicyUpload />} />
                    <Route path="/new-policy" element={<NewPolicyForm />} />
                    <Route path="/policy-output" element={<PolicyOutputPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
