# Direct Fit Automotive Backend & Frontend Guide

## Setup & Running

### Prerequisites

- Node.js (v14+)
- npm

### Installation

```bash
npm install
```

### Development (both backend & frontend)

```bash
npm run dev
```

This runs both the backend server (port 5000) and React frontend (port 3000) concurrently.

### Backend Only

```bash
npm run server
```

Starts Express server on `http://localhost:5000`

### Frontend Only

```bash
npm start
```

Starts React app on `http://localhost:3000`

## Database

### SQLite Database File

The database is stored locally as `database.db` in the project root.

### Database Schema

#### Users Table

- `id` (INTEGER PRIMARY KEY)
- `email` (TEXT UNIQUE)
- `password` (TEXT - hashed with bcrypt)
- `name` (TEXT)
- `company` (TEXT - optional)
- `accountType` (TEXT - 'personal' or 'business')
- `margin` (REAL - pricing margin for user)
- `subscription` (TEXT - 'active' or 'inactive')
- `createdAt` (DATETIME)

#### Orders Table

- `id` (INTEGER PRIMARY KEY)
- `userId` (INTEGER - foreign key to users)
- `orderId` (TEXT UNIQUE)
- `items` (TEXT - JSON stringified)
- `total` (REAL)
- `vehicle` (TEXT - JSON stringified)
- `createdAt` (DATETIME)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user

  - Body: `{ email, password, name, company?, accountType }`
  - Returns: `{ success, token, user }`

- `POST /api/auth/login` - Login existing user

  - Body: `{ email, password }`
  - Returns: `{ success, token, user }`

- `POST /api/auth/verify` - Verify JWT token
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success, user }`

### Orders

- `POST /api/orders` - Create/save an order (requires auth)

  - Headers: `Authorization: Bearer <token>`
  - Body: `{ orderId, items, total, vehicle? }`
  - Returns: `{ success, message, id }`

- `GET /api/orders` - Get user's orders (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success, orders[] }`

### Health

- `GET /api/health` - Health check
  - Returns: `{ status }`

## Authentication Flow

1. **User Registration/Login**

   - User enters email and password in signup/login modal
   - Frontend sends request to `/api/auth/register` or `/api/auth/login`
   - Backend hashes password (bcrypt) and stores/validates in SQLite
   - Backend returns JWT token + user object
   - Frontend stores token in `localStorage` and updates state

2. **Authenticated Requests**
   - Frontend includes token in `Authorization: Bearer <token>` header
   - Backend verifies token with JWT middleware
   - Request succeeds if token is valid; fails if expired or invalid

## Environment Variables

### Backend (.env)

```
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

### Frontend (.env.development)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Testing

### Demo Accounts (local/in-memory only)

- Business: `demo@mechanic.com` / `demo123`
- Personal: `personal@email.com` / `demo123`
- Admin: `admin@directfit.com` / `admin123`

Note: These demo accounts are available in the initial React state for backwards compatibility but won't work with the backend. Register new accounts via the signup modal.

## Deploying to Production

1. Change `JWT_SECRET` in `.env` to a strong random value
2. Set `NODE_ENV=production`
3. Update `REACT_APP_API_URL` in production build to point to your server
4. Deploy backend server (e.g., via Heroku, AWS, DigitalOcean)
5. Build and deploy frontend (e.g., via Vercel, Netlify, GitHub Pages)
6. Ensure CORS is configured properly for your domain

## Troubleshooting

### "Connection refused" error

- Ensure backend server is running on port 5000: `npm run server`
- Check that `.env.development` has correct `REACT_APP_API_URL`

### Login returns "Invalid credentials"

- Ensure user exists in database (register first)
- Check backend logs for errors

### Database locked error

- Ensure only one instance of the backend is running
- Delete `database.db` to start fresh if needed
