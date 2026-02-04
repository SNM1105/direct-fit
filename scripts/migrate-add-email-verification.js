// Run this script once to add email verification columns to your database
// node migrate-add-email-verification.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

(async () => {
  try {
    console.log('\n=== ADDING EMAIL VERIFICATION COLUMNS ===\n');
    
    // Note: Supabase doesn't support direct SQL via JavaScript client
    // You must run these SQL commands manually in Supabase SQL Editor
    
    console.log('Please run the following SQL commands in your Supabase SQL Editor:');
    console.log('(Go to: SQL Editor -> New Query -> Paste below -> Run)\n');
    
    const sql = `
-- Add email verification columns if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_email_verified ON users(email_verified);
    `;
    
    console.log(sql);
    console.log('\n=== AFTER RUNNING THE SQL ===\n');
    console.log('These columns are now ready for email verification.');
    console.log('Your new users will need to verify their email before full access.\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
})();
