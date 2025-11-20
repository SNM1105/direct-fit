# SUPABASE SETUP INSTRUCTIONS

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up/log in
2. Click "New Project"
3. Fill in project details:
   - Name: direct-fit-automotive
   - Database Password: (create a strong password - save it!)
   - Region: Choose closest to you
4. Click "Create new project" (takes ~2 minutes)

## Step 2: Create Database Tables

1. Go to SQL Editor in Supabase dashboard
2. Click "New query"
3. Paste and run this SQL:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  account_type TEXT DEFAULT 'personal' CHECK (account_type IN ('personal', 'business')),
  margin REAL DEFAULT 20,
  subscription TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL,
  total REAL NOT NULL,
  vehicle JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for orders table
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (true);
```

## Step 3: Get API Credentials

1. Go to Settings → API in your Supabase project
2. Find these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon/public key** (under "Project API keys")

## Step 4: Update .env File

1. Open the `.env` file in the project root
2. Add these lines (replace with your actual values):

```
JWT_SECRET=your-random-secret-key-change-this-to-something-secure
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key-here
```

## Step 5: Update server.js

Replace the old `server.js` with `server-supabase.js`:

```bash
Remove-Item server.js
Rename-Item server-supabase.js server.js
```

## Step 6: Remove SQLite dependency

```bash
npm uninstall sqlite3
```

## Step 7: Test the setup

```bash
npm run dev
```

The server should start and connect to Supabase. Test by creating an account!

## Troubleshooting

- If you get "Invalid API key": Check that SUPABASE_KEY is the anon/public key, not service_role
- If you get "relation does not exist": Make sure the SQL script ran successfully in Step 2
- If RLS blocks requests: The policies are set to allow all for now (you can tighten them later)
