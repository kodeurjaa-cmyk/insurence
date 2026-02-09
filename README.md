# AI-based Personalized Insurance Policy Generation Engine

This project is an AI-powered engine that generates custom insurance policies based on user risk profiles and natural language prompts.

## Features
- **Dynamic Risk Assessment**: Rule-based engine to evaluate client risk.
- **Actuarial Pricing**: Personalized premium calculations.
- **AI Policy Generation**: Powered by Google Gemini Pro.
- **Natural Language Refinement**: Update policies using prompts like "make it cheaper".
- **Version Tracking**: History of all policy versions and prompts.
- **Export**: Export policies to PDF and DOCX.

## Tech Stack
- **Backend**: Flask (Python)
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini Pro
- **Frontend**: React (Vite, Framer Motion, Lucide)

## Setup

### Backend
1. `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Create `.env` from `.env.example` and add your keys (Supabase, Gemini).
6. Run the app: `python app.py`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Database
1. Create a new project in [Supabase](https://supabase.com/).
2. Run the SQL in `supabase_schema.sql` in the SQL Editor.
3. Copy your project URL and Service Role Key to the backend `.env`.

## Architecture
- `backend/services/`: Core business logic (Risk, Pricing, AI).
- `backend/routes/`: API endpoints.
- `backend/models/`: Database interactions.
- `frontend/src/`: Modern React UI.
