# Resume and Interview Points — ContentOS

## Project title

**ContentOS — AI-Powered Content Management SaaS**

## Resume bullet points

- Engineered a full-stack AI content management platform using React, FastAPI, SQLAlchemy, and PostgreSQL-compatible persistence, covering generation, editing, organization, analytics, scheduling, and exports.
- Implemented secure JWT authentication with bcrypt password hashing, typed Pydantic validation, protected routes, and per-user content ownership across CRUD, search, favorite, archive, analytics, and export APIs.
- Built a provider-agnostic AI service supporting Groq, Gemini, and a deterministic local fallback, with Server-Sent Events for progressive generation and a rich-text workspace for targeted AI transformations.
- Designed a responsive SaaS interface with dark mode, persisted preferences, reusable templates, content calendar, team collaboration surfaces, notification center, dashboard visualizations, loading states, empty states, and accessible feedback.
- Added automated FastAPI integration tests, OpenAPI documentation, environment templates, production frontend builds, and deployment configuration for Render, PostgreSQL, and Vercel.

## Tech stack

- Frontend: React 18, React Router, Vite, Tailwind CSS, Zustand, Recharts, Axios, Lucide React
- Backend: Python 3.12, FastAPI, Pydantic, SQLAlchemy, Uvicorn
- Security: JWT, OAuth2 bearer flow, Passlib, bcrypt
- AI: Groq, Gemini, deterministic demo provider, Server-Sent Events
- Data: SQLite for development, PostgreSQL for production
- Export and testing: ReportLab, Pytest, FastAPI TestClient
- Deployment: Render Blueprint and PostgreSQL, Vercel

## Interview explanation

ContentOS solves the full content workflow rather than only generating text. A user can register, stream an AI draft, edit it, save it to a private library, organize it, export it, and review analytics. The frontend is organized around protected product routes and small persisted stores. The backend separates API routes, schemas, database models, security, AI providers, and activity logging. This boundary keeps the product maintainable and makes each subsystem independently testable.

## Why FastAPI?

FastAPI provides strong request validation through Pydantic, dependency injection for authentication and database sessions, automatic OpenAPI documentation, and clean support for async streaming. Those capabilities fit an AI API particularly well and reduce custom infrastructure code.

## Why React?

The product contains multiple interactive surfaces: streaming generation, a rich editor, filters, charts, calendars, comments, modals, notifications, and responsive navigation. React makes these flows composable, while React Router provides explicit public and protected application boundaries.

## Why PostgreSQL?

The domain is relational: users own content, activity belongs to users, and future workspaces connect members, comments, schedules, and templates. PostgreSQL provides transactions, indexing, concurrency, reliable constraints, and a straightforward deployment path. SQLite remains useful for zero-configuration local development and tests.

## Why JWT?

JWT access tokens keep protected API calls stateless and work cleanly between independently deployed Vercel and Render services. The token contains a short user identifier and expiry, while every protected operation still loads the user and enforces ownership in the database.

## Why Server-Sent Events?

AI generation is a one-directional stream from server to browser. SSE uses normal HTTP, has a simple event format, works well through proxies, and avoids the operational complexity of WebSockets when the client does not need a bidirectional persistent channel.

## Challenges faced

- Preserving a responsive interface while streaming partial AI responses
- Supporting real and demo AI providers through one validated request contract
- Enforcing ownership consistently across list, detail, update, delete, analytics, and export flows
- Keeping a feature-rich SaaS navigation usable on desktop and mobile
- Making the project runnable without paid AI credentials while preserving realistic architecture
- Keeping local SQLite behavior compatible with production PostgreSQL

## Future scope

- Alembic migrations, refresh tokens, email verification, password recovery, OAuth, and MFA
- Server-backed team workspaces, roles, comments, notifications, schedules, and template sharing
- Redis queues for long generation jobs and scheduled publishing
- Usage-based billing, subscriptions, quotas, audit logs, and administrator permissions
- Semantic search, version history, plagiarism checks, brand voice profiles, and publishing integrations
- Playwright end-to-end tests, accessibility automation, monitoring, and structured logging
