const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

(async () => {
  try {
    console.log('\n=== RESETTING PASSWORD ===\n');
    
    const email = 'simonmedalssy@gmail.com';
    const newPassword = 'Tamartal';
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('Creating new hash for password:', newPassword);
    console.log('Hash:', hashedPassword.substring(0, 30) + '...\n');
    
    // Update the user
    const { data, error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', email)
      .select();
    
    if (error) {
      console.error('❌ Error updating password:', error.message);
      process.exit(1);
    }
    
    console.log('✓ Password updated successfully!');
    console.log('  Email:', data[0].email);
    console.log('  Name:', data[0].name);
    console.log('\n✓ You can now login with:');
    console.log('  Email:', email);
    console.log('  Password:', newPassword);
    console.log('\n=== DONE ===\n');
    
  } catch (e) {
    console.error('ERROR:', e.message);
  }
  process.exit(0);
})();
