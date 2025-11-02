#!/usr/bin/env node
/**
 * Test Azure OpenAI API Connection
 * Tests GPT-4o and DALL-E 3 access
 */

import OpenAI from 'openai';

// Configuration
const endpoint = 'https://pathfinity-ai.openai.azure.com/';
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const apiVersion = '2024-08-01-preview';

if (!apiKey) {
  console.error('❌ Error: AZURE_OPENAI_API_KEY environment variable not set');
  console.error('Set it by running: export AZURE_OPENAI_API_KEY=your-key-here\n');
  process.exit(1);
}

const client = new OpenAI({
  apiKey,
  baseURL: `${endpoint}openai/deployments/gpt-4o`,
  defaultQuery: { 'api-version': apiVersion },
  defaultHeaders: { 'api-key': apiKey },
});

console.log('🧪 Testing Azure OpenAI Connection\n');
console.log('Endpoint:', endpoint);
console.log('Available deployments: gpt-4o, gpt-4, gpt-35-turbo, dall-e-3\n');

// Test 1: GPT-4o Chat Completion
async function testGPT4o() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: GPT-4o Chat Completion');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const deploymentName = 'gpt-4o';

    console.log(`Calling ${deploymentName}...`);

    const result = await client.chat.completions.create({
      model: deploymentName,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates career education content.'
        },
        {
          role: 'user',
          content: 'Generate a single multiple-choice question about Software Engineering. Make it engaging for high school students.'
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = result.choices[0].message.content;

    console.log('✅ SUCCESS!\n');
    console.log('Response:');
    console.log('─────────────────────────────────────────');
    console.log(response);
    console.log('─────────────────────────────────────────\n');
    console.log('Usage:', {
      prompt: result.usage.promptTokens,
      completion: result.usage.completionTokens,
      total: result.usage.totalTokens
    });
    console.log('\n');

    return true;
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    if (error.code) console.error('Error code:', error.code);
    console.log('\n');
    return false;
  }
}

// Test 2: Generate Career Question with JSON Response
async function testQuestionGeneration() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: Structured Question Generation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const deploymentName = 'gpt-4o';

    console.log('Generating structured question with JSON response...');

    const result = await client.chat.completions.create({
      model: deploymentName,
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content creator. You always respond with valid JSON.'
        },
        {
          role: 'user',
          content: `Generate a multiple-choice question about being a Registered Nurse.

Return ONLY a JSON object with this structure:
{
  "questionText": "The question",
  "options": [
    {"text": "Option A", "isCorrect": false},
    {"text": "Option B", "isCorrect": true},
    {"text": "Option C", "isCorrect": false},
    {"text": "Option D", "isCorrect": false}
  ],
  "explanation": "Why the correct answer is right",
  "difficultyLevel": "medium"
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: 'json_object' }
    });

    const response = result.choices[0].message.content;
    const parsed = JSON.parse(response);

    console.log('✅ SUCCESS!\n');
    console.log('Generated Question:');
    console.log('─────────────────────────────────────────');
    console.log('Q:', parsed.questionText);
    console.log('\nOptions:');
    parsed.options.forEach((opt, idx) => {
      const letter = String.fromCharCode(65 + idx);
      const mark = opt.isCorrect ? ' ✓ CORRECT' : '';
      console.log(`  ${letter}. ${opt.text}${mark}`);
    });
    console.log('\nExplanation:', parsed.explanation);
    console.log('Difficulty:', parsed.difficultyLevel);
    console.log('─────────────────────────────────────────\n');

    return true;
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    console.log('\n');
    return false;
  }
}

// Test 3: DALL-E 3 Image Generation (optional - costs $0.08)
async function testDALLE3(skip = true) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 3: DALL-E 3 Image Generation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (skip) {
    console.log('⏭️  SKIPPED (costs $0.08 per image)\n');
    console.log('To enable, run: node test-azure-ai.mjs --test-dalle\n');
    return true;
  }

  try {
    const deploymentName = 'dall-e-3';

    console.log('Generating image with DALL-E 3...');
    console.log('Prompt: "A digital badge icon for a software developer pathkey"\n');

    const result = await client.images.generate({
      model: deploymentName,
      prompt: 'Create a digital collectible badge icon for a software developer pathkey. Modern, gaming collectible style with a gradient blue background and a code symbol in the center.',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid'
    });

    const imageUrl = result.data[0].url;

    console.log('✅ SUCCESS!\n');
    console.log('Generated Image URL:');
    console.log('─────────────────────────────────────────');
    console.log(imageUrl);
    console.log('─────────────────────────────────────────\n');
    console.log('💡 Tip: Copy the URL and paste in browser to view the image\n');

    return true;
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    console.log('\n');
    return false;
  }
}

// Run all tests
async function runTests() {
  const testDALLEFlag = process.argv.includes('--test-dalle');

  const results = {
    gpt4o: await testGPT4o(),
    questionGen: await testQuestionGeneration(),
    dalle3: await testDALLE3(!testDALLEFlag)
  };

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('GPT-4o Chat:', results.gpt4o ? '✅ PASS' : '❌ FAIL');
  console.log('Question Generation:', results.questionGen ? '✅ PASS' : '❌ FAIL');
  console.log('DALL-E 3:', results.dalle3 ? '✅ PASS' : '⏭️  SKIPPED');

  console.log('\n');

  const allPassed = results.gpt4o && results.questionGen;
  if (allPassed) {
    console.log('🎉 All tests passed! Azure AI Foundry is ready to use.\n');
    console.log('Next steps:');
    console.log('1. Add AZURE_OPENAI_API_KEY to your .env file');
    console.log('2. Implement content generation service');
    console.log('3. Build admin dashboard for question generation\n');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.\n');
  }

  process.exit(allPassed ? 0 : 1);
}

runTests();
