// Express backend server with Supabase database and JWT authentication
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

console.log('Connected to Supabase');

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
    const margin = accountType === 'business' ? 15 : 20;
    
    // Make admin if email contains 'admin@' or is first user
    const { data: userCount } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });
    
    const isAdmin = email.includes('admin@') || (userCount?.length === 0);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Insert new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        name: fullName,
        company: company || null,
        account_type: accountType || 'personal',
        margin,
        is_admin: isAdmin
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Registration failed' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email, name: fullName, accountType, isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email,
        name: fullName,
        accountType,
        margin,
        subscription: 'active',
        isAdmin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration error' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Get user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, accountType: user.account_type, isAdmin: user.is_admin || false },
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
        accountType: user.account_type,
        margin: user.margin,
        subscription: user.subscription,
        isAdmin: user.is_admin || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login error' });
  }
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
app.post('/api/orders', async (req, res) => {
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

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: decoded.userId,
        order_id: orderId,
        items,
        total,
        vehicle
      })
      .select()
      .single();

    if (error) {
      console.error('Order save error:', error);
      return res.status(500).json({ error: 'Failed to save order' });
    }

    res.status(201).json({
      success: true,
      message: 'Order saved successfully',
      id: data.id
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get user orders
app.get('/api/orders', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', decoded.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Orders fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Orders error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ============ ADMIN ROUTES ============

// Get all users (admin only)
app.get('/api/admin/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, company, account_type, margin, subscription, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Users fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json({ success: true, users });
  } catch (error) {
    console.error('Admin error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update user margin (admin only)
app.put('/api/admin/users/:userId/margin', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { userId } = req.params;
    const { margin } = req.body;

    console.log('Updating user margin:', { userId, margin, type: typeof userId });

    if (margin === undefined || margin < 0 || margin > 100) {
      return res.status(400).json({ error: 'Invalid margin value' });
    }

    // First check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id, email, margin')
      .eq('id', userId)
      .single();

    console.log('Existing user:', existingUser, 'Error:', fetchError);

    if (fetchError || !existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ margin: parseFloat(margin) })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Margin update error:', error);
      return res.status(500).json({ error: 'Failed to update margin' });
    }

    res.json({ success: true, user: data });
  } catch (error) {
    console.error('Admin error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running with Supabase' });
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
  console.log('  GET    /api/admin/users    - Get all users (admin)');
  console.log('  PUT    /api/admin/users/:id/margin - Update user margin (admin)');
  console.log('  GET    /api/health         - Health check');
});
