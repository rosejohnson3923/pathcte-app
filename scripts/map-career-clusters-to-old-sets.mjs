#!/usr/bin/env node
/**
 * Map CTE Career Clusters to Older Question Sets
 * ================================================
 * Maps the 10 older sector-based sets to official CTE Career Clusters
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

/**
 * Mapping of old question set titles to CTE Career Clusters
 * Based on official 16 CTE Career Clusters
 */
const CAREER_CLUSTER_MAPPING = {
  'Healthcare Careers Fundamentals': 'Health Science',
  'Technology & Engineering Basics': 'Information Technology', // Could also be STEM
  'Business & Finance Careers': 'Business Management & Administration', // Could also be Finance
  'Arts & Entertainment Careers': 'Arts, Audio/Video Technology & Communications',
  'Science & Research Careers': 'Science, Technology, Engineering & Mathematics',
  'Education & Teaching Careers': 'Education & Training',
  'Public Service & Law Careers': 'Law, Public Safety, Corrections & Security',
  'Agriculture & Environmental Careers': 'Agriculture, Food & Natural Resources',
  'Construction & Skilled Trades Careers': 'Architecture & Construction',
  'Hospitality & Service Industry Careers': 'Hospitality & Tourism',
};

async function analyzeAndMapCareerClusters() {
  console.log('🗺️  Career Cluster Mapping for Older Question Sets\n');
  console.log('='.repeat(80) + '\n');

  // Get the 10 sets with NULL career_cluster
  const { data: nullSets, error } = await supabase
    .from('question_sets')
    .select('id, title, career_sector, career_cluster')
    .is('career_cluster', null)
    .is('career_id', null)
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${nullSets.length} question sets with NULL career_cluster\n`);

  // Show the mapping
  console.log('📋 Proposed Mapping:\n');

  const mappedSets = [];
  const unmappedSets = [];

  nullSets.forEach(set => {
    const proposedCluster = CAREER_CLUSTER_MAPPING[set.title];

    if (proposedCluster) {
      mappedSets.push({ ...set, proposedCluster });
      console.log(`✅ "${set.title}"`);
      console.log(`   career_sector: ${set.career_sector}`);
      console.log(`   → career_cluster: "${proposedCluster}"`);
      console.log('');
    } else {
      unmappedSets.push(set);
      console.log(`❌ "${set.title}"`);
      console.log(`   No mapping defined!`);
      console.log('');
    }
  });

  console.log('='.repeat(80) + '\n');
  console.log('📊 Summary:\n');
  console.log(`   Mapped: ${mappedSets.length}`);
  console.log(`   Unmapped: ${unmappedSets.length}`);
  console.log('');

  if (unmappedSets.length > 0) {
    console.log('⚠️  WARNING: Some sets could not be mapped!');
    console.log('   Please add mappings for:');
    unmappedSets.forEach(set => {
      console.log(`   - ${set.title}`);
    });
    console.log('');
  }

  // Show the 16 official CTE Career Clusters for reference
  console.log('='.repeat(80) + '\n');
  console.log('📚 Official 16 CTE Career Clusters:\n');

  const OFFICIAL_CLUSTERS = [
    'Agriculture, Food & Natural Resources',
    'Architecture & Construction',
    'Arts, Audio/Video Technology & Communications',
    'Business Management & Administration',
    'Education & Training',
    'Finance',
    'Government & Public Administration',
    'Health Science',
    'Hospitality & Tourism',
    'Human Services',
    'Information Technology',
    'Law, Public Safety, Corrections & Security',
    'Manufacturing',
    'Marketing',
    'Science, Technology, Engineering & Mathematics',
    'Transportation, Distribution & Logistics',
  ];

  OFFICIAL_CLUSTERS.forEach((cluster, i) => {
    const used = Object.values(CAREER_CLUSTER_MAPPING).includes(cluster);
    console.log(`   ${i + 1}. ${cluster} ${used ? '✅' : ''}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n💡 Next Steps:\n');
  console.log('   1. Review the proposed mappings above');
  console.log('   2. If correct, run the UPDATE migration script');
  console.log('   3. Consider if any sets should map to different clusters');
  console.log('');
  console.log('   Alternative mappings to consider:');
  console.log('   - "Technology & Engineering Basics" → "Science, Technology, Engineering & Mathematics"');
  console.log('   - "Business & Finance Careers" → "Finance" (instead of Business Management)');
  console.log('');

  return mappedSets;
}

analyzeAndMapCareerClusters().catch(console.error);
