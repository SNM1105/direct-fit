// Express backend server with SQLite database and JWT authentication
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      company TEXT,
      accountType TEXT DEFAULT 'personal',
      margin REAL DEFAULT 20,
      subscription TEXT DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      orderId TEXT UNIQUE NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      vehicle TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  console.log('Database tables initialized');
});

// ============ AUTHENTICATION ROUTES ============

// Register route
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, company, accountType } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = accountType === 'business' ? company : name;

    db.run(
      `INSERT INTO users (email, password, name, company, accountType, margin)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, fullName, company || null, accountType || 'personal', accountType === 'business' ? 15 : 20],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: this.lastID, email, name: fullName, accountType },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.status(201).json({
          success: true,
          token,
          user: {
            id: this.lastID,
            email,
            name: fullName,
            accountType,
            margin: accountType === 'business' ? 15 : 20,
            subscription: 'active'
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Registration error' });
  }
});

// Login route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name, accountType: user.accountType },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          accountType: user.accountType,
          margin: user.margin,
          subscription: user.subscription
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Login error' });
    }
  });
});

// Verify token route
app.post('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// ============ ORDERS ROUTES ============

// Save order
app.post('/api/orders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { orderId, items, total, vehicle } = req.body;

    if (!orderId || !items || !total) {
      return res.status(400).json({ error: 'Missing order data' });
    }

    db.run(
      `INSERT INTO orders (userId, orderId, items, total, vehicle)
       VALUES (?, ?, ?, ?, ?)`,
      [decoded.userId, orderId, JSON.stringify(items), total, JSON.stringify(vehicle)],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to save order' });
        }

        res.status(201).json({
          success: true,
          message: 'Order saved successfully',
          id: this.lastID
        });
      }
    );
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get user orders
app.get('/api/orders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    db.all(
      `SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC`,
      [decoded.userId],
      (err, orders) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch orders' });
        }

        const parsedOrders = orders.map(order => ({
          ...order,
          items: JSON.parse(order.items),
          vehicle: order.vehicle ? JSON.parse(order.vehicle) : null
        }));

        res.json({ success: true, orders: parsedOrders });
      }
    );
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST   /api/auth/register  - Register new user');
  console.log('  POST   /api/auth/login     - Login user');
  console.log('  POST   /api/auth/verify    - Verify JWT token');
  console.log('  POST   /api/orders         - Save order (requires auth)');
  console.log('  GET    /api/orders         - Get user orders (requires auth)');
  console.log('  GET    /api/health         - Health check');
});
