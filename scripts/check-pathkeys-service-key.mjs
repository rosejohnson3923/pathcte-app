/**
 * Check Pathkeys with Service Role Key
 * =====================================
 * Use service role key to bypass RLS
 */

import { createClient } from '@supabase/supabase-js';

// Note: This uses service role key which bypasses RLS
// Only use for admin scripts, never expose in client code
const supabase = createClient(
  'https://festwdkldwnpmqxrkiso.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

console.log('Checking pathkeys (with service role key)...\n');

const { data: pathkeys, error } = await supabase
  .from('pathkeys')
  .select('key_code, name, image_url, rarity, key_type')
  .order('key_code');

if (error) {
  console.error('Error:', error.message);
  console.log('\nNote: You need to set SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

console.log(`Found ${pathkeys.length} pathkeys:\n`);

pathkeys.forEach((pk) => {
  const isAzureUrl = pk.image_url?.includes('pathket.blob.core.windows.net');
  const isPlaceholder = pk.image_url?.includes('placehold.co');

  console.log(`${pk.key_code}: ${pk.name}`);
  console.log(`  Type: ${pk.key_type} | Rarity: ${pk.rarity}`);
  console.log(`  Image: ${pk.image_url}`);
  console.log(`  Status: ${isAzureUrl ? '✅ Azure URL' : isPlaceholder ? '⚠️  Placeholder' : '❌ Unknown'}`);
  console.log('');
});
