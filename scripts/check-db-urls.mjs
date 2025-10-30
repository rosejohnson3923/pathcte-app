import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://festwdkldwnpmqxrkiso.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlc3R3ZGtsZHducG1xeHJraXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjczOTgsImV4cCI6MjA3NzEwMzM5OH0.6DPT5zAwGfPGDLcuV8kTq0TKntyh93Ee57oQY3hHZJA'
);

console.log('Checking pathkey image URLs in database...\n');

const { data: pathkeys, error } = await supabase
  .from('pathkeys')
  .select('key_code, name, image_url')
  .order('key_code');

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log(`Found ${pathkeys.length} pathkeys:\n`);

pathkeys.forEach(pk => {
  const hasUrl = !!pk.image_url;
  const isAzure = pk.image_url && pk.image_url.includes('pathcte.blob.core.windows.net');
  console.log(`${pk.key_code}: ${pk.name}`);
  console.log(`  URL: ${pk.image_url || 'NULL'}`);
  console.log(`  Has URL: ${hasUrl ? 'YES' : 'NO'}, Is Azure: ${isAzure ? 'YES' : 'NO'}`);
  console.log('');
});
