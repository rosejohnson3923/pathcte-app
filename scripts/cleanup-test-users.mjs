#!/usr/bin/env node

/**
 * Cleanup Test Users Script
 * =========================
 * Deletes test users from Supabase auth and their associated profiles
 * Useful for testing signup flows
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../packages/web/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   VITE_SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Delete a user by email
 */
async function deleteUserByEmail(email) {
  console.log(`\n🔍 Looking for user: ${email}`);

  // Find the user by email
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error(`❌ Error listing users:`, listError.message);
    return false;
  }

  const user = users.users.find(u => u.email === email);

  if (!user) {
    console.log(`⚠️  User not found: ${email}`);
    return false;
  }

  console.log(`✓ Found user: ${user.id}`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Created: ${user.created_at}`);
  console.log(`  Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);

  // Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    console.log(`✓ Found profile:`);
    console.log(`  Display Name: ${profile.display_name}`);
    console.log(`  User Type: ${profile.user_type}`);
    console.log(`  Created: ${profile.created_at}`);
  } else {
    console.log(`⚠️  No profile found (this is normal if email not confirmed)`);
  }

  // Delete the user (cascade will delete profile)
  console.log(`\n🗑️  Deleting user...`);
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error(`❌ Error deleting user:`, deleteError.message);
    return false;
  }

  console.log(`✅ Successfully deleted user: ${email}`);
  return true;
}

/**
 * List all users (for reference)
 */
async function listAllUsers() {
  console.log('\n📋 Listing all users:\n');

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ Error listing users:', error.message);
    return;
  }

  if (data.users.length === 0) {
    console.log('No users found.');
    return;
  }

  data.users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Created: ${user.created_at}`);
    console.log(`   Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log('');
  });

  console.log(`Total users: ${data.users.length}`);
}

/**
 * Delete all unconfirmed users
 */
async function deleteUnconfirmedUsers() {
  console.log('\n🔍 Finding unconfirmed users...\n');

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ Error listing users:', error.message);
    return;
  }

  const unconfirmedUsers = data.users.filter(u => !u.email_confirmed_at);

  if (unconfirmedUsers.length === 0) {
    console.log('✓ No unconfirmed users found.');
    return;
  }

  console.log(`Found ${unconfirmedUsers.length} unconfirmed user(s):\n`);

  for (const user of unconfirmedUsers) {
    console.log(`🗑️  Deleting: ${user.email} (${user.id})`);
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error(`   ❌ Error: ${deleteError.message}`);
    } else {
      console.log(`   ✅ Deleted`);
    }
  }

  console.log(`\n✅ Cleanup complete`);
}

// Main script
const args = process.argv.slice(2);
const command = args[0];
const email = args[1];

console.log('='.repeat(60));
console.log('Cleanup Test Users Script');
console.log('='.repeat(60));

if (command === 'list') {
  await listAllUsers();
} else if (command === 'delete' && email) {
  await deleteUserByEmail(email);
} else if (command === 'cleanup') {
  await deleteUnconfirmedUsers();
} else {
  console.log('\nUsage:');
  console.log('  node scripts/cleanup-test-users.mjs list');
  console.log('    - List all users\n');
  console.log('  node scripts/cleanup-test-users.mjs delete <email>');
  console.log('    - Delete a specific user by email\n');
  console.log('  node scripts/cleanup-test-users.mjs cleanup');
  console.log('    - Delete all unconfirmed users\n');
  console.log('Examples:');
  console.log('  node scripts/cleanup-test-users.mjs list');
  console.log('  node scripts/cleanup-test-users.mjs delete rosejohnson3923@aol.com');
  console.log('  node scripts/cleanup-test-users.mjs cleanup');
  console.log('');
}

console.log('='.repeat(60));
