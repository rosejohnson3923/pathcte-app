import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://festwdkldwnpmqxrkiso.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlc3R3ZGtsZHducG1xeHJraXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjczOTgsImV4cCI6MjA3NzEwMzM5OH0.6DPT5zAwGfPGDLcuV8kTq0TKntyh93Ee57oQY3hHZJA'
);

console.log('Checking database tables...\n');

// Try to query pathkeys table
const { data: pathkeys, error: pathkeysError, count: pathkeysCount } = await supabase
  .from('pathkeys')
  .select('*', { count: 'exact', head: false })
  .limit(5);

console.log('Pathkeys table:');
console.log(`  Error: ${pathkeysError ? pathkeysError.message : 'None'}`);
console.log(`  Count: ${pathkeysCount}`);
console.log(`  Sample data:`, pathkeys);
console.log('');

// Try to query careers table
const { data: careers, error: careersError, count: careersCount } = await supabase
  .from('careers')
  .select('*', { count: 'exact', head: false })
  .limit(5);

console.log('Careers table:');
console.log(`  Error: ${careersError ? careersError.message : 'None'}`);
console.log(`  Count: ${careersCount}`);
console.log(`  Sample data:`, careers);
