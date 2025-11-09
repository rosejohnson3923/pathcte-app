/**
 * Validate Unique Counts
 * ======================
 * Count distinct careers, industries, and clusters
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

async function main() {
  console.log('📊 VALIDATING UNIQUE COUNTS\n');
  console.log('='.repeat(80) + '\n');

  // Fetch all question sets
  const { data: questionSets, error } = await supabase
    .from('question_sets')
    .select('id, title, career_id, career_cluster, created_at')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  console.log(`Total question sets in database: ${questionSets.length}\n`);

  // Group by title to identify unique sets
  const uniqueTitles = new Map();
  for (const set of questionSets) {
    if (!uniqueTitles.has(set.title)) {
      uniqueTitles.set(set.title, []);
    }
    uniqueTitles.get(set.title).push(set);
  }

  console.log(`Unique titles: ${uniqueTitles.size}\n`);

  // Categorize by type
  const careers = new Map();
  const industries = new Map();
  const clusters = new Map();

  for (const [title, sets] of uniqueTitles.entries()) {
    // Use the oldest set as the canonical one
    const canonical = sets.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0];

    if (canonical.career_cluster) {
      clusters.set(title, canonical);
    } else if (canonical.career_id) {
      careers.set(title, canonical);
    } else {
      industries.set(title, canonical);
    }
  }

  console.log('CAREERS (career_id IS NOT NULL AND career_cluster IS NULL):');
  console.log(`  Count: ${careers.size}`);
  console.log(`  Examples: ${Array.from(careers.keys()).slice(0, 5).join(', ')}\n`);

  console.log('INDUSTRIES (career_id IS NULL AND career_cluster IS NULL):');
  console.log(`  Count: ${industries.size}`);
  console.log(`  List:`);
  for (const title of Array.from(industries.keys()).sort()) {
    console.log(`    - ${title}`);
  }
  console.log('');

  console.log('CLUSTERS (career_cluster IS NOT NULL):');
  console.log(`  Count: ${clusters.size}`);
  console.log(`  List with career_cluster values:`);
  for (const [title, set] of Array.from(clusters.entries()).sort()) {
    console.log(`    - ${title} (${set.career_cluster})`);
  }
  console.log('');

  // Check for any overlap
  const careerTitles = Array.from(careers.keys());
  const clusterTitles = Array.from(clusters.keys());
  const overlap = careerTitles.filter(t => clusterTitles.includes(t));

  if (overlap.length > 0) {
    console.log('⚠️  WARNING: Titles appearing in BOTH Career and Cluster:');
    console.log(`  Count: ${overlap.length}`);
    console.log(`  Examples: ${overlap.slice(0, 5).join(', ')}\n`);
  }

  console.log('='.repeat(80));
  console.log('\nSUMMARY:');
  console.log(`  - Careers: ${careers.size}`);
  console.log(`  - Industries: ${industries.size}`);
  console.log(`  - Clusters: ${clusters.size}`);
  console.log(`  - Total unique: ${uniqueTitles.size}`);
  console.log(`  - Total in DB: ${questionSets.length} (including duplicates)`);
}

main().catch(console.error);
