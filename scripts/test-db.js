const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

(async () => {
  try {
    console.log('\n=== DATABASE TEST ===\n');
    
    // Get the user
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'simonmedalssy@gmail.com');
    
    if (!users || users.length === 0) {
      console.error('❌ User not found');
      process.exit(1);
    }
    
    const user = users[0];
    console.log('✓ User found:', user.email);
    console.log('  ID:', user.id);
    console.log('  Password hash:', user.password.substring(0, 30) + '...');
    console.log('  Is bcrypt:', user.password.startsWith('$2'));
    
    // Test password comparison
    console.log('\nTesting password comparison...');
    const testPassword = 'test123';
    const matches = await bcrypt.compare(testPassword, user.password);
    console.log(`  Password "${testPassword}" matches:`, matches);
    
    if (!matches) {
      console.log('\n⚠️  Password does NOT match. Trying to hash and compare a test password...');
      const testHash = await bcrypt.hash('test123', 10);
      console.log('  New hash would be:', testHash.substring(0, 30) + '...');
    }
    
    console.log('\n=== END TEST ===\n');
  } catch (e) {
    console.error('ERROR:', e.message);
  }
  process.exit(0);
})();
