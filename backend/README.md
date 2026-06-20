# Backend

FastAPI service for authentication, AI generation and streaming, content management, analytics, and PDF/TXT export.

## Local setup

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs are available at `http://localhost:8000/docs`. Run tests with `pytest`.

For PostgreSQL set `DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE`. For AI generation, set `AI_PROVIDER=groq` or `gemini` and add the corresponding key. Without a key the deterministic demo provider keeps the full workflow runnable.
