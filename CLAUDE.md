# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EasyBudget is a full-stack personal finance web app. Users can register/login, manage income, expenses, and savings goals. The production repo is derived from the original at https://github.com/akurapati1/CSCI5300_Project_EasyBudget.

## Development Commands

### Frontend (React)
```bash
cd client
npm start        # Dev server on port 3000
npm test         # Run Jest tests
npm run build    # Production build (CI=false to ignore warnings)
```

### Backend (Node/Express)
```bash
cd Backend
npm run dev      # nodemon (auto-reload)
npm start        # node server.js
```

### Running a single test
```bash
cd client && CI=true npx react-scripts test --watchAll=false src/__tests__/Login.test.js
cd Backend && npx jest tests/api.test.js -t "reset"
```

## Architecture

**Frontend** (`client/`): React 18, Create React App, React Router v6, Context API for auth/user state, Axios for HTTP, Chart.js for visualizations, styled-components.

**Backend** (`Backend/`): Express on port 5001, MongoDB via Mongoose 8, JWT authentication, bcryptjs password hashing, helmet + rate limiting. MVC pattern: `routes/` → `controllers/` → `models/`.

### Key data flow
- Auth state lives in `client/src/context/AuthContext.js` (JWT token)
- User data (income, expenses, savings) lives in `client/src/context/UserContext.js`
- All user data is stored on a single MongoDB `User` document with embedded arrays for income, expenses, and savingsGoals

### Routes
| Frontend Route | Component |
|---|---|
| `/` | Login |
| `/register` | Register |
| `/forgot-password` | ForgotPassword |
| `/reset-password/:token` | ResetPassword |
| `/dashboard/*` | Dashboard (nested: home, income, budget, savingsgoal, chart) |

**Backend routes** (`Backend/app.js` mounts `/auth` → `routes/auth.js` and `/api/budget` → `routes/budgetRoutes.js`; `Backend/server.js` only connects MongoDB and listens):

| Backend Route | Auth | Purpose |
|---|---|---|
| `POST /auth/register`, `POST /auth/login` | None | Create user / login (JWT + user data) |
| `GET /auth/me` | JWT | Current user |
| `POST /auth/forgot-password`, `POST /auth/reset-password/:token` | None | Password reset (token stored as SHA-256 hash) |
| `POST /api/budget/income\|expense\|saving` | JWT | Add entry (validated in `utils/validators.js`) |
| `DELETE /api/budget/income\|expense\|saving/:id` | JWT | Remove entry |
| `GET /health` | None | Liveness |

All budget routes derive the user from the JWT (`req.user.id`); never accept a `userId` from the body.

### Auth middleware
`Backend/middleware/authMiddleware.js` — reads `Authorization` header (with or without `Bearer `), verifies the JWT, attaches the decoded payload to `req.user`; responds 401 on missing/invalid tokens.

### User model schema
All user data is embedded in a single `User` document (`Backend/models/User.js`):
- `income[]`: `{ date, amount, description, frequency }`
- `expenses[]`: `{ date, amount, description, frequency }`
- `savingsGoals[]`: `{ goalName, goalAmount, allocatedPercentage }`

### API base URL
Components read `process.env.REACT_APP_API_URL` (default `http://localhost:5001`); it is baked in at build time.

## Environment

Backend requires `Backend/.env` (see `Backend/.env.example`): `MONGODB_URI` and `JWT_SECRET` are mandatory (server exits without them); optional `CLIENT_ORIGIN`, `EMAIL_*`, `AUTH_RATE_LIMIT`.

## CI/CD

GitHub Actions (`.github/workflows/main.yaml`) runs on push/PR to `main`: backend tests, client tests + build, then Docker image builds. `docker-compose.yml` runs MongoDB + API + nginx-served client.

## Testing

- Backend: `cd Backend && npm test` — Jest + supertest in `Backend/tests/`; the Mongoose `User` model is replaced by an in-memory fake (`tests/helpers/fakeUserModel.js`), so no database is required. Extend the fake if a controller starts using new query operators.
- Client: `cd client && CI=true npm test -- --watchAll=false` — tests in `client/src/__tests__/`; axios is mocked via `client/src/__mocks__/axios.js`.
