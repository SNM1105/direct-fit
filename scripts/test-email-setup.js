// Test email verification setup
const { createClient } = require('@supabase/supabase-js');
const { sendVerificationEmail, generateVerificationToken } = require('./email-verification');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

(async () => {
  try {
    console.log('\n=== EMAIL VERIFICATION TEST ===\n');
    
    // Check 1: Verify email credentials
    console.log('1. Checking email credentials...');
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ EMAIL_USER or EMAIL_PASSWORD not set in .env');
      process.exit(1);
    }
    console.log('   ✓ Email user:', process.env.EMAIL_USER);
    console.log('   ✓ Email password:', '***hidden***\n');
    
    // Check 2: Verify database columns exist
    console.log('2. Checking database columns...');
    const { data: users, error } = await supabase
      .from('users')
      .select('email_verified, verification_token')
      .limit(1);
    
    if (error) {
      console.error('❌ Database error:', error.message);
      console.error('   Make sure you ran the SQL migration in Supabase!');
      process.exit(1);
    }
    console.log('   ✓ Database columns exist\n');
    
    // Check 3: Test email sending
    console.log('3. Testing email sending...');
    const testEmail = process.env.EMAIL_USER; // Send to yourself
    const testToken = generateVerificationToken();
    
    try {
      console.log('   Attempting to send to:', testEmail);
      console.log('   Email user from env:', process.env.EMAIL_USER);
      console.log('   Email password length:', process.env.EMAIL_PASSWORD?.length);
      await sendVerificationEmail(testEmail, testToken, process.env.REACT_APP_BASE_URL);
      console.log('   ✓ Test email sent successfully to:', testEmail);
      console.log('   ✓ Check your inbox!\n');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      console.error('   Full error:', emailError);
      console.error('   Possible issues:');
      console.error('   - Wrong Gmail password (must be app password, not regular password)');
      console.error('   - Gmail account not set up for app passwords');
      console.error('   - Email not configured in .env\n');
      process.exit(1);
    }
    
    console.log('=== ALL CHECKS PASSED ===\n');
    console.log('Your email verification system is ready!');
    console.log('New users will receive verification emails.\n');
    
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
  process.exit(0);
})();
