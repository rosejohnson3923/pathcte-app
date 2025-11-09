#!/usr/bin/env node

/**
 * Create or Reset Admin Account
 * =============================
 * Creates the sysadmin account or resets its password
 *
 * Usage: node scripts/create-admin-account.mjs [password]
 * If no password provided, defaults to 'password123'
 */

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';

const SUPABASE_URL = 'https://festwdkldwnpmqxrkiso.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlc3R3ZGtsZHducG1xeHJraXNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyNzM5OCwiZXhwIjoyMDc3MTAzMzk4fQ.mNDfxupQ3i7w6Yx_xh8Aysh9YqWTyXGpugoHqtFVzZ4';

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = 'sysadmin@pathcte.com';
const password = process.argv[2] || 'password123';

console.log('🔧 Admin Account Setup');
console.log('======================\n');
console.log(`Email: ${ADMIN_EMAIL}`);
console.log(`Password: ${password}`);
console.log('');

try {
  // Check if auth user exists
  console.log('1. Checking if auth user exists...');
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('❌ Error listing users:', listError);
    process.exit(1);
  }

  const existingAuthUser = users.find(u => u.email === ADMIN_EMAIL);

  let userId;

  if (existingAuthUser) {
    console.log(`✓ Auth user exists (ID: ${existingAuthUser.id})`);
    console.log('');
    console.log('2. Updating password...');

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingAuthUser.id,
      { password }
    );

    if (updateError) {
      console.error('❌ Error updating password:', updateError);
      process.exit(1);
    }

    console.log('✓ Password updated');
    userId = existingAuthUser.id;
  } else {
    console.log('✗ Auth user does not exist');
    console.log('');
    console.log('2. Creating new auth user...');

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: 'System Admin'
      }
    });

    if (createError) {
      console.error('❌ Error creating user:', createError);
      process.exit(1);
    }

    console.log(`✓ Auth user created (ID: ${newUser.user.id})`);
    userId = newUser.user.id;
  }

  console.log('');
  console.log('3. Checking profile...');

  // Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
    console.error('❌ Error checking profile:', profileError);
    process.exit(1);
  }

  if (profile) {
    console.log(`✓ Profile exists`);

    if (profile.user_type !== 'admin') {
      console.log('');
      console.log('4. Updating profile to admin...');

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ user_type: 'admin' })
        .eq('id', userId);

      if (updateProfileError) {
        console.error('❌ Error updating profile:', updateProfileError);
        process.exit(1);
      }

      console.log('✓ Profile updated to admin');
    } else {
      console.log('✓ Profile already has admin role');
    }
  } else {
    console.log('✗ Profile does not exist');
    console.log('');
    console.log('4. Creating profile...');

    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: ADMIN_EMAIL,
        display_name: 'System Admin',
        user_type: 'admin',
        settings: {}
      });

    if (insertError) {
      console.error('❌ Error creating profile:', insertError);
      process.exit(1);
    }

    console.log('✓ Profile created');
  }

  console.log('');
  console.log('✅ Admin account setup complete!');
  console.log('');
  console.log('You can now login with:');
  console.log(`  Email: ${ADMIN_EMAIL}`);
  console.log(`  Password: ${password}`);
  console.log('');

} catch (error) {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
}
