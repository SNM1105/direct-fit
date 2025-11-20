# Database & Backend API Guide

## Overview

The backend uses **Supabase** (PostgreSQL) for data storage with Express.js for the API layer.

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  account_type TEXT DEFAULT 'personal',
  margin REAL DEFAULT 20,
  subscription TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  order_id TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL,
  total REAL NOT NULL,
  vehicle JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Authentication

#### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "company": "Mechanic Shop",
  "accountType": "business"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Mechanic Shop",
    "accountType": "business",
    "margin": 15,
    "subscription": "active"
  }
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response: Same as register

#### Verify Token

```
POST /api/auth/verify
Authorization: Bearer <token>
```

Response:

```json
{
  "success": true,
  "user": {
    "userId": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "accountType": "business"
  }
}
```

### Orders

#### Save Order

```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "ORDER-20240101-ABCD",
  "items": [
    {
      "id": 1,
      "name": "Brake Pad Set",
      "price": 45.99,
      "quantity": 2
    }
  ],
  "total": 91.98,
  "vehicle": {
    "year": "2020",
    "make": "Toyota",
    "model": "Camry"
  }
}
```

Response:

```json
{
  "success": true,
  "message": "Order saved successfully",
  "id": "uuid"
}
```

#### Get User Orders

```
GET /api/orders
Authorization: Bearer <token>
```

Response:

```json
{
  "success": true,
  "orders": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "order_id": "ORDER-20240101-ABCD",
      "items": [...],
      "total": 91.98,
      "vehicle": {...},
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

## Environment Variables

Create a `.env` file in the project root:

```env
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
```

## Running the Backend

Development mode (runs both frontend and backend):

```bash
npm run dev
```

Backend only:

```bash
npm run server
```

Frontend only:

```bash
npm start
```

## Security Notes

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- Row Level Security (RLS) is enabled on Supabase tables
- Never commit `.env` file to version control
- Use environment variables for all sensitive data
