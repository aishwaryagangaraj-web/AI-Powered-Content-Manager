# Frontend

Responsive React/Vite interface for ContentOS, including authentication, protected routing, AI streaming, content CRUD, analytics, theme persistence, exports, and responsive navigation.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The app opens at `http://localhost:5173` and expects the backend root at `http://localhost:8000`. Override it with `VITE_API_URL`; do not include `/api`, because the client adds that prefix internally.
