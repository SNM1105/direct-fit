// Script to display SQL migration for adding address fields to users table
console.log('=== SQL Migration for Address Fields ===\n');
console.log('Run these commands in your Supabase SQL editor:\n');

console.log(`
-- Add address columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS street_address VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS state_province VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- Add address column to orders table to store address at time of order
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
`);
