// Express backend server with Supabase database and JWT authentication
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');
const { generateVerificationToken, sendVerificationEmail } = require('./email-verification');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripeClient = STRIPE_SECRET_KEY ? stripe(STRIPE_SECRET_KEY) : null;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

console.log('Connected to Supabase');
if (STRIPE_SECRET_KEY) {
  console.log('Stripe integration enabled');
} else {
  console.log('Warning: STRIPE_SECRET_KEY not configured. Payment processing disabled.');
}

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
    const { count: userCount } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });
    
    const isAdmin = email.includes('admin@') || (userCount === 0);

    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

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
        is_admin: isAdmin,
        email_verified: false,
        verification_token: verificationToken,
        verification_token_expires: tokenExpires.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Registration failed' });
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken, BASE_URL);
      console.log('[REGISTER] Verification email sent to:', email);
    } catch (emailError) {
      console.error('[REGISTER] Email send error:', emailError.message);
      // Still allow registration even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        id: newUser.id,
        email,
        name: fullName,
        accountType,
        email_verified: false
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
  console.log('[LOGIN] Attempting login for:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    console.log('[LOGIN] Querying database for user...');
    // Get user by email
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    console.log('[LOGIN] Query result:', { error, userCount: users?.length });

    if (error || !users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    console.log('[LOGIN] Found user, checking password...');

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('[LOGIN] Password match:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.email_verified) {
      console.log('[LOGIN] Email not verified for:', email);
      return res.status(403).json({ 
        error: 'Please verify your email address before logging in. Check your email for the verification link.',
        needsVerification: true
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, accountType: user.account_type, isAdmin: user.is_admin || false },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('[LOGIN] Login successful for:', email);
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
    console.error('[LOGIN] Error:', error.message, error.stack);
    res.status(500).json({ error: 'Login error: ' + error.message });
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
    console.error('[VERIFY] Error:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Email verification route
app.post('/api/auth/verify-email', async (req, res) => {
  const { token, email } = req.body;

  if (!token || !email) {
    return res.status(400).json({ error: 'Token and email are required' });
  }

  try {
    console.log('[VERIFY-EMAIL] Verifying:', email);

    // Get user by email and token
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('verification_token', token);

    if (error || !users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid verification token' });
    }

    const user = users[0];

    // Check if token has expired
    const tokenExpires = new Date(user.verification_token_expires);
    if (tokenExpires < new Date()) {
      return res.status(401).json({ error: 'Verification token has expired' });
    }

    // Update user to verified
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        verification_token_expires: null
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('[VERIFY-EMAIL] Update error:', updateError);
      return res.status(500).json({ error: 'Verification failed' });
    }

    // Generate JWT token for login
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, accountType: user.account_type, isAdmin: user.is_admin || false },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('[VERIFY-EMAIL] Email verified for:', email);
    res.json({
      success: true,
      message: 'Email verified successfully!',
      token: jwtToken,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        accountType: updatedUser.account_type,
        margin: updatedUser.margin,
        email_verified: true
      }
    });
  } catch (error) {
    console.error('[VERIFY-EMAIL] Error:', error.message);
    res.status(500).json({ error: 'Email verification error' });
  }
});

// Resend verification email
app.post('/api/auth/resend-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Get user by email
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (error || !users || users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Check if already verified
    if (user.email_verified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_token: verificationToken,
        verification_token_expires: tokenExpires.toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[RESEND-VERIFICATION] Update error:', updateError);
      return res.status(500).json({ error: 'Failed to generate new verification token' });
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken, BASE_URL);
      console.log('[RESEND-VERIFICATION] Verification email sent to:', email);
      res.json({
        success: true,
        message: 'Verification email sent! Please check your inbox.'
      });
    } catch (emailError) {
      console.error('[RESEND-VERIFICATION] Email send error:', emailError.message);
      res.status(500).json({ error: 'Failed to send verification email. Please try again later.' });
    }
  } catch (error) {
    console.error('[RESEND-VERIFICATION] Error:', error.message);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

// Get user profile
app.get('/api/auth/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, street_address, city, state_province, postal_code, country, margin, account_type')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update user profile (including address)
app.put('/api/auth/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { streetAddress, city, stateProvince, postalCode, country } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        street_address: streetAddress || null,
        city: city || null,
        state_province: stateProvince || null,
        postal_code: postalCode || null,
        country: country || null
      })
      .eq('id', decoded.userId)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ============ STRIPE PAYMENT ROUTES ============

// Create payment intent
app.post('/api/payment/create-intent', async (req, res) => {
  if (!stripeClient) {
    return res.status(503).json({ error: 'Payment processing not configured' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { amount, orderId, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Fetch user for metadata
    const { data: userData } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', decoded.userId)
      .single();

    // Create or retrieve Stripe customer
    let customerId;
    const customers = await stripeClient.customers.list({
      email: userData?.email,
      limit: 1
    });

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripeClient.customers.create({
        email: userData?.email,
        name: userData?.name,
        metadata: {
          userId: decoded.userId
        }
      });
      customerId = customer.id;
    }

    // Create payment intent with customer
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      description: description || `Order ${orderId}`,
      metadata: {
        userId: decoded.userId,
        orderId: orderId,
        userEmail: userData?.email || 'unknown'
      },
      receipt_email: userData?.email
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment and save order
app.post('/api/payment/confirm', async (req, res) => {
  if (!stripeClient) {
    return res.status(503).json({ error: 'Payment processing not configured' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { paymentIntentId, orderId, items, total, vehicle, shippingAddress } = req.body;

    // Verify payment intent with Stripe
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Fetch user info
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', decoded.userId)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      // Continue with Unknown if user fetch fails
    }

    // Send order confirmation email
    const { sendOrderConfirmationEmail } = require('./email-verification');
    try {
      await sendOrderConfirmationEmail(
        userData?.email,
        userData?.name,
        orderId,
        items,
        total,
        vehicle,
        shippingAddress
      );
      console.log(`Order confirmation email sent to ${userData?.email}`);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Continue even if email fails
    }

    // Save order with payment info
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: decoded.userId,
        order_id: orderId,
        items,
        total,
        vehicle,
        shipping_address: shippingAddress || null,
        buyer_name: userData?.name || 'Unknown',
        buyer_email: userData?.email || 'Unknown',
        payment_method: 'stripe',
        payment_status: 'completed',
        stripe_payment_intent_id: paymentIntentId,
        payment_amount: total,
        payment_date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Order save error:', error);
      return res.status(500).json({ error: 'Failed to save order' });
    }

    res.status(201).json({
      success: true,
      message: 'Order saved, payment confirmed, and confirmation email sent',
      id: data.id
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
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
    const { orderId, items, total, vehicle, shippingAddress } = req.body;

    if (!orderId || !items || !total) {
      return res.status(400).json({ error: 'Missing order data' });
    }

    // Fetch user info for buyer details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', decoded.userId)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      // Continue with Unknown if user fetch fails
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: decoded.userId,
        order_id: orderId,
        items,
        total,
        vehicle,
        shipping_address: shippingAddress || null,
        buyer_name: userData?.name || 'Unknown',
        buyer_email: userData?.email || 'Unknown',
        payment_method: 'pending',
        payment_status: 'pending'
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
    res.status(500).json({ error: 'Failed to process order' });
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

// ============ CART ROUTES ============

// Get user's cart
app.get('/api/cart', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', decoded.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Cart fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }

    res.json({ success: true, cart: cartItems || [] });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Add item to cart
app.post('/api/cart', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const item = req.body;

    if (!item.id || !item.partNumber || !item.name || !item.price) {
      return res.status(400).json({ error: 'Missing required item data' });
    }

    // Check if item already exists in cart
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', decoded.userId)
      .eq('part_id', item.id);

    const existing = existingItems && existingItems.length > 0 ? existingItems[0] : null;
    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + (item.quantity || 1) })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Cart update error:', error);
        return res.status(500).json({ error: 'Failed to update cart' });
      }

      return res.json({ success: true, item: data });
    }

    // Insert new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: decoded.userId,
        part_id: item.id,
        part_number: item.partNumber,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        stock: item.stock,
        brand: item.brand,
        main_category: item.mainCategory,
        sub_category: item.subCategory,
        detail_category: item.detailCategory,
        fits: item.fits,
        images: item.images,
        description: item.description
      })
      .select()
      .single();

    if (error) {
      console.error('Cart insert error:', error);
      return res.status(500).json({ error: 'Failed to add to cart' });
    }

    res.status(201).json({ success: true, item: data });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update cart item quantity
app.put('/api/cart/:itemId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    if (quantity === 0) {
      // Delete item if quantity is 0
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', decoded.userId);

      if (error) {
        console.error('Cart delete error:', error);
        return res.status(500).json({ error: 'Failed to remove item' });
      }

      return res.json({ success: true, deleted: true });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .eq('user_id', decoded.userId)
      .select();

    if (error) {
      console.error('Cart update error:', error);
      return res.status(500).json({ error: 'Failed to update cart' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ success: true, item: data[0] });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Remove item from cart
app.delete('/api/cart/:itemId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { itemId } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', decoded.userId);

    if (error) {
      console.error('Cart delete error:', error);
      return res.status(500).json({ error: 'Failed to remove item' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Clear entire cart
app.delete('/api/cart', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', decoded.userId);

    if (error) {
      console.error('Cart clear error:', error);
      return res.status(500).json({ error: 'Failed to clear cart' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ============ WISHLIST ROUTES ============

// Get user's wishlist
app.get('/api/wishlist', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { data: wishlistItems, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', decoded.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Wishlist fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch wishlist' });
    }

    res.json({ success: true, wishlist: wishlistItems || [] });
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Add item to wishlist
app.post('/api/wishlist', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const item = req.body;

    if (!item.id || !item.partNumber || !item.name || !item.price) {
      return res.status(400).json({ error: 'Missing required item data' });
    }

    // Check if item already exists in wishlist
    const { data: existingItems } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', decoded.userId)
      .eq('part_id', item.id);

    const existing = existingItems && existingItems.length > 0 ? existingItems[0] : null;
    if (existing) {
      return res.status(409).json({ error: 'Item already in wishlist' });
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: decoded.userId,
        part_id: item.id,
        part_number: item.partNumber,
        name: item.name,
        price: item.price,
        stock: item.stock,
        brand: item.brand,
        main_category: item.mainCategory,
        sub_category: item.subCategory,
        detail_category: item.detailCategory,
        fits: item.fits,
        images: item.images,
        description: item.description
      })
      .select()
      .single();

    if (error) {
      console.error('Wishlist insert error:', error);
      return res.status(500).json({ error: 'Failed to add to wishlist' });
    }

    res.status(201).json({ success: true, item: data });
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Remove item from wishlist
app.delete('/api/wishlist/:itemId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { itemId } = req.params;

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('part_id', parseInt(itemId))
      .eq('user_id', decoded.userId);

    if (error) {
      console.error('Wishlist delete error:', error);
      return res.status(500).json({ error: 'Failed to remove item' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ============ VEHICLE DATA CACHE ROUTES ============
// Hardcoded list of car makes (faster than calling NHTSA each time)
const CAR_MAKES = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti',
  'Cadillac', 'Chevrolet', 'Chrysler', 'Citroën', 'Dodge', 'Donkervoort',
  'Ferrari', 'Fiat', 'Ford', 'Geo', 'GMC', 'Honda', 'Hummer', 'Hyundai',
  'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Lancia',
  'Land Rover', 'Lexus', 'Lotus', 'Maserati', 'Maybach', 'Mazda', 'McLaren',
  'Mercedes-Benz', 'Mercury', 'MG', 'Mini', 'Mitsubishi', 'Morgan', 'Nissan',
  'Oldsmobile', 'Pagani', 'Panoz', 'Peugeot', 'Plymouth', 'Pontiac', 'Porsche',
  'Ram', 'Renault', 'Rolls-Royce', 'Rover', 'Saab', 'Saturn', 'Scion', 'Seat',
  'Shelby', 'Smart', 'Spyker', 'Studebaker', 'Subaru', 'Suzuki', 'Tesla',
  'Toyota', 'Triumph', 'Volkswagen', 'Volvo', 'Zenvo'
];

// Models for each make (simplified - commonly available models)
const CAR_MODELS_BY_MAKE = {
  'Honda': ['Accord', 'Civic', 'CR-V', 'Odyssey', 'Pilot', 'Ridgeline', 'Insight'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', 'Prius', 'Yaris'],
  'Ford': ['F-150', 'Mustang', 'Fusion', 'Edge', 'Explorer', 'Ranger', 'Escape', 'Transit'],
  'Chevrolet': ['Silverado', 'Cruze', 'Equinox', 'Traverse', 'Colorado', 'Malibu', 'Blazer'],
  'Nissan': ['Altima', 'Rogue', 'Maxima', 'Murano', 'Frontier', 'Titan', 'Sentra', 'Versa'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'Z4', '2 Series'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'A-Class', 'GLE', 'GLA', 'GLB'],
  'Audi': ['A1', 'A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'TT'],
  'Volkswagen': ['Golf', 'Jetta', 'Passat', 'Tiguan', 'Atlas', 'Beetle', 'Taos'],
  'Hyundai': ['Elantra', 'Sonata', 'Santa Fe', 'Tucson', 'Kona', 'Venue', 'Palisade'],
  'Kia': ['Forte', 'K5', 'Sportage', 'Sorento', 'Niro', 'Seltos', 'Telluride'],
  'Lexus': ['ES', 'GS', 'LS', 'RX', 'NX', 'UX', 'LX'],
  'Infiniti': ['Q50', 'Q60', 'QX50', 'QX60', 'QX80'],
  'Dodge': ['Charger', 'Challenger', 'Durango', 'Journey', 'Ram'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade'],
  'GMC': ['Sierra', 'Terrain', 'Acadia', 'Yukon'],
  'Cadillac': ['CTS', 'Escalade', 'XT6', 'XT5', 'Lyriq'],
  'Chrysler': ['300', 'Pacifica'],
  'Mazda': ['3', '6', 'CX-5', 'CX-9', 'MX-5'],
  'Subaru': ['Outback', 'Legacy', 'Impreza', 'Crosstrek', 'Forester', 'Ascent'],
  'Acura': ['ILX', 'TLX', 'MDX', 'RDX'],
  'Ram': ['1500', '2500', '3500'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
  'Porsche': ['911', 'Cayenne', 'Panamera', 'Macan'],
  'Jaguar': ['F-PACE', 'XE', 'XF', 'F-TYPE'],
  'Land Rover': ['Range Rover', 'Discovery', 'Defender'],
  'Volvo': ['S60', 'S90', 'XC40', 'XC60', 'XC90'],
  'Peugeot': ['308', '3008', '5008'],
  'Citroën': ['C3', 'C5', 'Berlingo'],
  'Fiat': ['500', '500X', '500L'],
  'Alfa Romeo': ['Giulia', 'Stelvio'],
  'Mini': ['Cooper', 'Countryman'],
  'Smart': ['Fortwo', 'Forfour'],
  'Lotus': ['Evora', 'Emira'],
  'Morgan': ['Plus Four', '3Wheeler'],
  'Triumph': ['Spitfire', 'TR6'],
  'Scion': ['tC', 'xA', 'xB'],
  'Saturn': ['Ion', 'Aura', 'Outlook'],
  'Pontiac': ['G6', 'Grand Am'],
  'Oldsmobile': ['Alero', 'Aurora'],
  'Mercury': ['Mariner', 'Grand Marquis'],
  'Geo': ['Metro', 'Prizm'],
  'Isuzu': ['D-Max', 'MU-X'],
  'Suzuki': ['Swift', 'Vitara', 'Jimny'],
  'Mitsubishi': ['Outlander', 'Lancer', 'Pajero'],
  'Bentley': ['Continental', 'Flying Spur'],
  'Rolls-Royce': ['Phantom', 'Ghost'],
  'Lamborghini': ['Huracán', 'Aventador'],
  'Ferrari': ['F8', '812', 'Roma'],
  'Maserati': ['Ghibli', 'Levante', 'MC20'],
  'Bugatti': ['Chiron', 'Bolide'],
};

// In-memory cache for vehicle makes and models
let vehicleMakesCache = CAR_MAKES;
let modelsCache = {}; // Cache models per make
let lastCacheFetch = Date.now();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Get all makes with caching
app.get('/api/vehicle-data/makes', async (req, res) => {
  console.log('[MAKES] Request received');
  try {
    // Return cached makes (using hardcoded list)
    console.log('[MAKES] Returning makes, count:', vehicleMakesCache.length);
    return res.json({ success: true, makes: vehicleMakesCache });
  } catch (error) {
    console.error('[MAKES] Error:', error.message);
    res.json({ 
      success: true, 
      makes: CAR_MAKES
    });
  }
});

// Get models for a specific make with caching
app.get('/api/vehicle-data/models/:make', async (req, res) => {
  const { make } = req.params;
  const decodedMake = decodeURIComponent(make);
  console.log('[MODELS] Request received for:', decodedMake);
  
  try {
    // Check if we have models for this make in our hardcoded list
    if (CAR_MODELS_BY_MAKE[decodedMake]) {
      const models = CAR_MODELS_BY_MAKE[decodedMake];
      console.log(`[MODELS] Returning models for ${decodedMake}, count:`, models.length);
      // Cache for future requests
      modelsCache[decodedMake] = {
        data: models,
        timestamp: Date.now()
      };
      return res.json({ success: true, models });
    }
    
    // If not in hardcoded list, try to fetch from NHTSA
    console.log(`[MODELS] Make ${decodedMake} not in hardcoded list, returning empty`);
    res.json({ success: true, models: [] });
  } catch (error) {
    console.error(`[MODELS] Error fetching models for ${decodedMake}:`, error.message);
    res.json({ success: true, models: [] });
  }
});

// ============ GARAGE ROUTES ============

// Get user's garage vehicles
app.get('/api/garage', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { data: vehicles, error } = await supabase
      .from('garage_vehicles')
      .select('*')
      .eq('user_id', decoded.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Garage fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch garage' });
    }

    res.json({ success: true, vehicles: vehicles || [] });
  } catch (error) {
    console.error('Garage error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Add vehicle to garage
app.post('/api/garage', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { year, make, model, full } = req.body;

    if (!year || !make || !model) {
      return res.status(400).json({ error: 'Year, make, and model are required' });
    }

    // Check if vehicle already exists
    const { data: existingVehicles } = await supabase
      .from('garage_vehicles')
      .select('*')
      .eq('user_id', decoded.userId)
      .eq('year', year)
      .eq('make', make)
      .eq('model', model);

    const existing = existingVehicles && existingVehicles.length > 0 ? existingVehicles[0] : null;
    if (existing) {
      return res.status(409).json({ error: 'Vehicle already in garage' });
    }

    const { data, error } = await supabase
      .from('garage_vehicles')
      .insert({
        user_id: decoded.userId,
        year,
        make,
        model
      })
      .select()
      .single();

    if (error) {
      console.error('Garage insert error:', error);
      return res.status(500).json({ error: 'Failed to add vehicle' });
    }

    res.status(201).json({ success: true, vehicle: data });
  } catch (error) {
    console.error('Garage error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Remove vehicle from garage
app.delete('/api/garage/:vehicleId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { vehicleId } = req.params;

    const { error } = await supabase
      .from('garage_vehicles')
      .delete()
      .eq('id', vehicleId)
      .eq('user_id', decoded.userId);

    if (error) {
      console.error('Garage delete error:', error);
      return res.status(500).json({ error: 'Failed to remove vehicle' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Garage error:', error);
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
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('id, email, margin')
      .eq('id', userId);

    const existingUser = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;
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
  console.log('  GET    /api/cart           - Get user cart');
  console.log('  POST   /api/cart           - Add item to cart');
  console.log('  PUT    /api/cart/:id       - Update cart item quantity');
  console.log('  DELETE /api/cart/:id       - Remove item from cart');
  console.log('  DELETE /api/cart           - Clear entire cart');
  console.log('  GET    /api/wishlist       - Get user wishlist');
  console.log('  POST   /api/wishlist       - Add item to wishlist');
  console.log('  DELETE /api/wishlist/:id   - Remove item from wishlist');
  console.log('  GET    /api/garage         - Get user garage vehicles');
  console.log('  POST   /api/garage         - Add vehicle to garage');
  console.log('  DELETE /api/garage/:id     - Remove vehicle from garage');
  console.log('  POST   /api/orders         - Save order (requires auth)');
  console.log('  GET    /api/orders         - Get user orders (requires auth)');
  console.log('  GET    /api/admin/users    - Get all users (admin)');
  console.log('  PUT    /api/admin/users/:id/margin - Update user margin (admin)');
  console.log('  GET    /api/health         - Health check');
});

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
