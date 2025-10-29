import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://festwdkldwnpmqxrkiso.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlc3R3ZGtsZHducG1xeHJraXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjczOTgsImV4cCI6MjA3NzEwMzM5OH0.6DPT5zAwGfPGDLcuV8kTq0TKntyh93Ee57oQY3hHZJA'
);

console.log('Listing all pathkeys in database...\n');

const { data, error, count } = await supabase
  .from('pathkeys')
  .select('id, key_code, name, image_url, rarity, key_type', { count: 'exact' });

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log(`Total pathkeys: ${count}\n`);

if (data && data.length > 0) {
  data.forEach((pk, i) => {
    console.log(`${i + 1}. ${pk.name}`);
    console.log(`   ID: ${pk.id}`);
    console.log(`   Code: ${pk.key_code}`);
    console.log(`   Type: ${pk.key_type}`);
    console.log(`   Rarity: ${pk.rarity}`);
    console.log(`   Image: ${pk.image_url?.substring(0, 60)}...`);
    console.log('');
  });
} else {
  console.log('No pathkeys found in database!');
}
