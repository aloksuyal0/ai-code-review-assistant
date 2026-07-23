# AI Code Review Assistant

A full-stack code review app built with Next.js, FastAPI, Monaco Editor, and OpenRouter. Paste code, select its language, and receive Markdown feedback covering bugs, improvements, best practices, complexity, and an optimized rewrite.

## Prerequisites

- Node.js 20+
- Python 3.10+
- An [OpenRouter API key](https://openrouter.ai/keys)

## Run locally

Open two terminals from the project root.

### 1. Start the backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Add your `OPENROUTER_API_KEY` to `backend/.env`, then start the API:

```powershell
python -m uvicorn app.main:app --reload --port 8000
```

The API health check is available at `http://127.0.0.1:8000/health`.

### 2. Start the frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000` in your browser. The default frontend configuration points to the local backend. For deployments, set `NEXT_PUBLIC_API_URL` and add the deployed frontend URL to `CORS_ORIGINS` in the backend environment.

## Project structure

```text
backend/   FastAPI review service and OpenRouter integration
frontend/  Next.js interface, Monaco editor, and Markdown review renderer
```

## Quality checks

```powershell
cd frontend
npm run lint
npm run build
```

Keep `backend/.env` private. It is intentionally ignored by Git.
