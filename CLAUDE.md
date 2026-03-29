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
cd client
npx jest src/__tests__/Dashboard.test.js
```

## Architecture

**Frontend** (`client/`): React 18, Create React App, React Router v6, Context API for auth/user state, Axios for HTTP, Chart.js for visualizations, styled-components.

**Backend** (`Backend/`): Express on port 5001, MongoDB Atlas via Mongoose, JWT authentication, bcryptjs password hashing. MVC pattern: `routes/` → `controllers/` → `models/`.

### Key data flow
- Auth state lives in `client/src/context/AuthContext.js` (JWT token)
- User data (income, expenses, savings) lives in `client/src/context/UserContext.js`
- All user data is stored on a single MongoDB `User` document with embedded arrays for income, expenses, and savingsGoals

### Routes
| Frontend Route | Component |
|---|---|
| `/` | Login |
| `/register` | Register |
| `/dashboard/*` | Dashboard (nested routes for Budget, Income, SavingsGoal, Chart) |

**Mounted backend routes** (`Backend/server.js` mounts `/auth` → `routes/auth.js` and `/api` → `routes/budgetRoutes.js`):

| Backend Route | Auth | Purpose |
|---|---|---|
| `POST /auth/register` | None | Create user |
| `POST /auth/login` | None | Login, returns JWT + full user data |
| `POST /auth/income` | JWT | Add income via `userController` |
| `POST /auth/expense` | JWT | Add expense via `userController` |
| `POST /api/budget/income` | None | Add income using `userId` in body |
| `POST /api/budget/expense` | None | Add expense using `userId` in body |
| `POST /api/budget/saving` | None | Add savings goal using `userId` in body |

> **Note:** `Backend/routes/incomeRoutes.js` and `expensesRoutes.js` exist but are **not mounted** in `server.js`. `UserContext.js` currently calls `/api/income`, `/api/expense`, `/api/saving` which are also not mounted — those calls will 404 in the current server config.

### Auth middleware
`Backend/middleware/authMiddleware.js` — reads `Authorization` header, verifies JWT, attaches decoded user to `req.user`.

### User model schema
All user data is embedded in a single `User` document (`Backend/models/User.js`):
- `income[]`: `{ date, amount, description, frequency }`
- `expenses[]`: `{ date, amount, description, frequency }`
- `savingsGoals[]`: `{ goalName, goalAmount, allocatedPercentage }`

### API base URL
`UserContext.js` hardcodes `http://localhost:5001` for all API calls. This must be changed for production deployments.

## Environment

Backend requires `Backend/.env`:
```
MONGODB_URI=<MongoDB Atlas connection string>
JWT_SECRET=<secret key>
```

## CI/CD

GitHub Actions (`.github/workflows/main.yaml`) runs on push/PR to `main`:
1. Client job: installs deps, runs tests, builds with `CI=false`
2. Backend job: installs deps, runs tests

## Testing

Tests are in `client/src/__tests__/`. Jest config is in `client/jest.config.js`. Axios is mocked via `client/src/__mocks__/axios.js`. CSS/style imports use `client/src/__mocks__/styleMock.js`.
