// Setup script to create Supabase tables
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function setupDatabase() {
  console.log('Setting up Supabase database...');

  try {
    // Create users table
    console.log('Creating users table...');
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          company VARCHAR(255),
          account_type VARCHAR(50) DEFAULT 'personal',
          margin DECIMAL(5, 2) DEFAULT 0,
          is_admin BOOLEAN DEFAULT false,
          subscription VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (usersError) {
      console.log('Users table might already exist or:', usersError.message);
    } else {
      console.log('✓ Users table created');
    }

    // Create cart table
    console.log('Creating cart table...');
    const { error: cartError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cart (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          part_id VARCHAR(255),
          part_number VARCHAR(255),
          name VARCHAR(255),
          price DECIMAL(10, 2),
          quantity INTEGER DEFAULT 1,
          stock INTEGER,
          brand VARCHAR(255),
          main_category VARCHAR(255),
          sub_category VARCHAR(255),
          detail_category VARCHAR(255),
          fits TEXT,
          images TEXT,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (cartError) {
      console.log('Cart table might already exist or:', cartError.message);
    } else {
      console.log('✓ Cart table created');
    }

    // Create wishlist table
    console.log('Creating wishlist table...');
    const { error: wishlistError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS wishlist (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          part_id VARCHAR(255),
          part_number VARCHAR(255),
          name VARCHAR(255),
          price DECIMAL(10, 2),
          stock INTEGER,
          brand VARCHAR(255),
          main_category VARCHAR(255),
          sub_category VARCHAR(255),
          detail_category VARCHAR(255),
          fits TEXT,
          images TEXT,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (wishlistError) {
      console.log('Wishlist table might already exist or:', wishlistError.message);
    } else {
      console.log('✓ Wishlist table created');
    }

    // Create garage table
    console.log('Creating garage table...');
    const { error: garageError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS garage (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          year VARCHAR(4),
          make VARCHAR(255),
          model VARCHAR(255),
          vehicle_full VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (garageError) {
      console.log('Garage table might already exist or:', garageError.message);
    } else {
      console.log('✓ Garage table created');
    }

    // Create orders table
    console.log('Creating orders table...');
    const { error: ordersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          order_id VARCHAR(255),
          items JSONB,
          total DECIMAL(10, 2),
          vehicle JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (ordersError) {
      console.log('Orders table might already exist or:', ordersError.message);
    } else {
      console.log('✓ Orders table created');
    }

    console.log('\n✓ Database setup complete!');
    console.log('You can now test the application.');
    process.exit(0);
  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  }
}

setupDatabase();
