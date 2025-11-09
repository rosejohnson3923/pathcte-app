/**
 * Check Career Cluster → Sector Mapping
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../packages/web/.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
);

const { data } = await supabase
  .from('careers')
  .select('title, sector, career_cluster')
  .order('career_cluster, sector');

console.log('Career Cluster → Sector Mapping:\n');

const grouped = data.reduce((acc, c) => {
  const key = c.career_cluster || 'NULL';
  if (!acc[key]) acc[key] = {};
  if (!acc[key][c.sector]) acc[key][c.sector] = [];
  acc[key][c.sector].push(c.title);
  return acc;
}, {});

Object.entries(grouped).forEach(([cluster, sectors]) => {
  console.log(`📁 ${cluster}`);
  Object.entries(sectors).forEach(([sector, careers]) => {
    console.log(`   └─ ${sector} (${careers.length} careers)`);
    careers.forEach(c => console.log(`      • ${c}`));
  });
  console.log();
});
