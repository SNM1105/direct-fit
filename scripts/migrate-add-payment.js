// Migration to add payment and buyer info columns to orders table
const supabase = require('./supabaseClient');

const migrationSQL = `
-- Add buyer info columns for easier lookup
ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_email VARCHAR(255);

-- Add payment tracking columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50); -- 'stripe', 'credit_card', etc.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending'; -- 'pending', 'completed', 'failed', 'refunded'
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255); -- Stripe payment intent ID
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10, 2); -- Amount paid
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_buyer_email ON orders(buyer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
`;

console.log('SQL Migration Commands:');
console.log('=======================');
console.log(migrationSQL);
console.log('\nTo apply these changes:');
console.log('1. Go to https://app.supabase.com');
console.log('2. Select your project');
console.log('3. Click "SQL Editor" in the left sidebar');
console.log('4. Click "New Query"');
console.log('5. Paste the above SQL commands');
console.log('6. Click "Run"');
