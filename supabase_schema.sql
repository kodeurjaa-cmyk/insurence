-- Database Schema for AI Insurance Engine

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    age INT,
    gender TEXT,
    location TEXT,
    income DECIMAL,
    lifestyle_factors TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies Table
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type TEXT,
    coverage_amount DECIMAL,
    duration TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Assessments Table
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES policies(id),
    score TEXT,
    score_value FLOAT,
    factors JSONB,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing Details Table
CREATE TABLE pricing_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES policies(id),
    monthly_premium DECIMAL,
    yearly_premium DECIMAL,
    breakdown JSONB,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy Versions Table
CREATE TABLE policy_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES policies(id),
    policy_text TEXT,
    version_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompts Log Table
CREATE TABLE prompts_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES policies(id),
    prompt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
