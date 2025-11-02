# Azure AI Foundry Integration for PathCTE

**Date:** 2025-10-31
**Last Updated:** 2025-11-02
**Status:** ✅ **TESTED AND WORKING**
**Resource:** Pathfinity-AI (OpenAI Service, East US)
**Endpoint:** `https://pathfinity-ai.openai.azure.com/`

## Available Models & Deployments

### Language Models (Tested ✅)
- ✅ **gpt-4o** (2024-11-20) - Latest GPT-4 Omni - *Recommended for content generation*
  - Deployment name: `gpt-4o`
  - Capacity: 250 TPM
  - **Status:** Tested and working
- ✅ **gpt-4** (turbo-2024-04-09)
  - Deployment name: `gpt-4`
  - Capacity: 250 TPM
- ✅ **gpt-35-turbo** (0125)
  - Deployment name: `gpt-35-turbo`
  - Capacity: 100 TPM

### Image Generation (Available)
- ✅ **dall-e-3** (3.0)
  - Deployment name: `dall-e-3`
  - Capacity: 2
  - **Cost:** $0.08 per image (1024x1024, HD quality)

### Azure AI Services
- ✅ **Azure AI Speech** - Text-to-speech, speech-to-text
- ✅ **Azure AI Vision** - Image analysis, OCR
- ✅ **Azure AI Document Intelligence** - Document extraction
- ✅ **Azure AI Language** - Sentiment, key phrases, entity extraction
- ✅ **Azure AI Translator** - Multi-language support
- ✅ **Azure AI Content Safety** - Content moderation
- ✅ **Azure AI Content Understanding** - Advanced content analysis

---

## PathCTE Use Cases

### 1. Question Generation (GPT-4o-3)

**Scenario:** Generate multiple-choice questions from career descriptions

```typescript
// packages/shared/src/services/ai-content-generation.service.ts
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const endpoint = 'https://pathfinity-ai-foundry.openai.azure.com/';
const apiKey = process.env.AZURE_OPENAI_API_KEY!;
const deployment = 'gpt-4o-3'; // Latest model

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

export interface GeneratedQuestion {
  questionText: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

/**
 * Generate questions about a specific career
 */
export async function generateCareerQuestions(
  careerTitle: string,
  careerDescription: string,
  count: number = 5
): Promise<GeneratedQuestion[]> {
  const prompt = `You are an educational content creator for PathCTE, a career exploration platform for students.

Generate ${count} multiple-choice questions about the "${careerTitle}" career to help students learn.

Career Description:
${careerDescription}

Requirements:
1. Each question should have 4 options (A, B, C, D)
2. Only ONE correct answer per question
3. Mix difficulty levels: easy, medium, hard
4. Focus on: job duties, required skills, education requirements, career outlook, typical work environment
5. Make questions engaging and relevant to high school/college students
6. Include an explanation for why the correct answer is right

Format your response as a JSON array:
[
  {
    "questionText": "What is the primary role of a ${careerTitle}?",
    "options": [
      {"text": "Option A text", "isCorrect": false},
      {"text": "Option B text", "isCorrect": true},
      {"text": "Option C text", "isCorrect": false},
      {"text": "Option D text", "isCorrect": false}
    ],
    "explanation": "The correct answer is B because...",
    "difficultyLevel": "medium"
  }
]`;

  const result = await client.getChatCompletions(deployment, [
    {
      role: 'system',
      content: 'You are an expert educational content creator specializing in career education.'
    },
    {
      role: 'user',
      content: prompt
    }
  ], {
    temperature: 0.7,
    maxTokens: 2000,
    responseFormat: { type: 'json_object' }
  });

  const content = result.choices[0].message.content;
  return JSON.parse(content);
}
```

### 2. Pathkey Flavor Text (GPT-4o-3)

**Scenario:** Generate engaging descriptions for pathkey achievements

```typescript
/**
 * Generate flavor text for a pathkey
 */
export async function generatePathkeyDescription(
  pathkeyName: string,
  careerCluster: string,
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
): Promise<string> {
  const rarityDescriptions = {
    common: 'accessible to many students',
    uncommon: 'earned by dedicated students',
    rare: 'achieved by persistent learners',
    epic: 'reserved for exceptional performers',
    legendary: 'the pinnacle of achievement'
  };

  const prompt = `Create an engaging, motivational description for a career achievement badge called "${pathkeyName}" in the ${careerCluster} career cluster.

Rarity: ${rarity} (${rarityDescriptions[rarity]})

The description should:
1. Be 2-3 sentences long
2. Be inspiring and motivational for students
3. Hint at what students did to earn it
4. Match the ${rarity} rarity level in tone
5. Use vivid, career-specific language

Do NOT use the word "badge" or "pathkey" in the description.

Example style:
"You've demonstrated exceptional proficiency in data analysis and visualization. Your ability to transform complex datasets into actionable insights sets you apart in the field of business intelligence."`;

  const result = await client.getChatCompletions(deployment, [
    {
      role: 'system',
      content: 'You are a creative writer specializing in motivational content for career education.'
    },
    {
      role: 'user',
      content: prompt
    }
  ], {
    temperature: 0.8,
    maxTokens: 200
  });

  return result.choices[0].message.content?.trim() || '';
}
```

### 3. Career Description Enhancement (GPT-4o-3)

**Scenario:** Expand basic career data into rich, student-friendly descriptions

```typescript
/**
 * Enhance a career description for students
 */
export async function enhanceCareerDescription(
  careerTitle: string,
  basicDescription: string
): Promise<{
  summary: string;
  dayInTheLife: string;
  skillsRequired: string[];
  educationPath: string;
  careerOutlook: string;
}> {
  const prompt = `Enhance this career description for high school and college students exploring "${careerTitle}":

Basic Description:
${basicDescription}

Create an engaging, informative career profile with:
1. Summary (2-3 sentences): Overview that captures attention
2. Day in the Life (3-4 sentences): What a typical workday looks like
3. Skills Required (6-8 skills): Key skills needed for success
4. Education Path (2-3 sentences): Typical educational requirements
5. Career Outlook (2 sentences): Job market trends and growth potential

Use language that resonates with students (ages 16-22). Be realistic but encouraging.

Format as JSON:
{
  "summary": "...",
  "dayInTheLife": "...",
  "skillsRequired": ["skill1", "skill2", ...],
  "educationPath": "...",
  "careerOutlook": "..."
}`;

  const result = await client.getChatCompletions(deployment, [
    {
      role: 'system',
      content: 'You are a career counselor specializing in helping students explore career options.'
    },
    {
      role: 'user',
      content: prompt
    }
  ], {
    temperature: 0.7,
    maxTokens: 800,
    responseFormat: { type: 'json_object' }
  });

  const content = result.choices[0].message.content;
  return JSON.parse(content);
}
```

### 4. Content Safety Moderation

**Scenario:** Ensure all generated content is appropriate

```typescript
import { ContentSafetyClient, AzureKeyCredential as ContentSafetyCredential } from '@azure-rest/ai-content-safety';

const contentSafetyEndpoint = 'https://pathfinity-ai-foundry.cognitiveservices.azure.com/';
const contentSafetyKey = process.env.AZURE_CONTENT_SAFETY_KEY!;

const safetyClient = ContentSafetyClient(
  contentSafetyEndpoint,
  new ContentSafetyCredential(contentSafetyKey)
);

/**
 * Check if content is safe for students
 */
export async function moderateContent(text: string): Promise<{
  isSafe: boolean;
  categories: {
    hate: number;
    selfHarm: number;
    sexual: number;
    violence: number;
  };
}> {
  const response = await safetyClient.path('/text:analyze').post({
    body: {
      text,
      categories: ['Hate', 'SelfHarm', 'Sexual', 'Violence'],
      haltOnBlocklistHit: false,
      outputType: 'FourSeverityLevels'
    }
  });

  if (response.status !== '200') {
    throw new Error('Content moderation failed');
  }

  const result = response.body;
  const categories = {
    hate: result.hateResult?.severity || 0,
    selfHarm: result.selfHarmResult?.severity || 0,
    sexual: result.sexualResult?.severity || 0,
    violence: result.violenceResult?.severity || 0
  };

  // Safe if all categories are 0 or 1 (low severity)
  const isSafe = Object.values(categories).every(severity => severity <= 1);

  return { isSafe, categories };
}

/**
 * Generate and validate safe content
 */
export async function generateSafeQuestion(
  careerTitle: string,
  careerDescription: string
): Promise<GeneratedQuestion> {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    const questions = await generateCareerQuestions(careerTitle, careerDescription, 1);
    const question = questions[0];

    // Check if question text is safe
    const questionSafety = await moderateContent(question.questionText);

    // Check if all options are safe
    const optionTexts = question.options.map(opt => opt.text).join(' ');
    const optionsSafety = await moderateContent(optionTexts);

    if (questionSafety.isSafe && optionsSafety.isSafe) {
      return question;
    }

    attempts++;
    console.warn(`Generated unsafe content, retrying... (${attempts}/${maxAttempts})`);
  }

  throw new Error('Could not generate safe content after maximum attempts');
}
```

### 5. Pathkey Image Generation (DALL-E 3)

**Scenario:** Generate unique artwork for pathkeys

```typescript
/**
 * Generate pathkey artwork using DALL-E 3
 */
export async function generatePathkeyImage(
  pathkeyName: string,
  careerCluster: string,
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
): Promise<string> {
  const rarityStyles = {
    common: 'simple, clean design with subtle colors',
    uncommon: 'polished design with vibrant colors',
    rare: 'detailed illustration with glowing effects',
    epic: 'intricate, elaborate design with metallic accents and particle effects',
    legendary: 'masterpiece quality with elaborate details, holographic effects, and ethereal glow'
  };

  const prompt = `Create a digital achievement badge icon for "${pathkeyName}" in the ${careerCluster} career cluster.

Style: ${rarityStyles[rarity]}

Design requirements:
- Icon format: suitable for display at 256x256px
- Should represent the ${careerCluster} industry
- Professional but appealing to students
- Include symbolic elements related to the career field
- Badge/medallion shape
- No text or words in the image

Artistic style: Modern, flat design with slight depth, professional gaming achievement aesthetic`;

  const result = await client.getImages(
    'dall-e-3',
    prompt,
    {
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid'
    }
  );

  return result.data[0].url; // URL to generated image
}
```

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│          Azure AI Foundry (Pathfinity)                  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  GPT-4o-3 (Primary Content Generation)            │ │
│  │  - Question generation                             │ │
│  │  - Career descriptions                             │ │
│  │  - Pathkey flavor text                             │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  DALL-E 3 (Image Generation)                      │ │
│  │  - Pathkey artwork                                 │ │
│  │  - Career visuals                                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Content Safety (Moderation)                      │ │
│  │  - All generated content validation                │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│     PathCTE Content Generation Service                  │
│     (Azure Functions or API Routes)                     │
│                                                          │
│  POST /api/content/generate-questions                   │
│  POST /api/content/generate-pathkey-text                │
│  POST /api/content/generate-career-description          │
│  POST /api/content/generate-pathkey-image               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│          Supabase Database                              │
│  - Store generated questions                            │
│  - Store career descriptions                            │
│  - Store pathkey metadata                               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│          PathCTE Web Application                        │
│  - Admin panel for content generation                   │
│  - Review/edit generated content                        │
│  - Bulk generation tools                                │
└─────────────────────────────────────────────────────────┘
```

---

## Admin Tools Integration

### Content Generation Dashboard

```typescript
// packages/web/src/pages/admin/ContentGenerationPage.tsx
import { useState } from 'react';
import { generateCareerQuestions, moderateContent } from '@pathcte/shared';

export const ContentGenerationPage = () => {
  const [careerTitle, setCareerTitle] = useState('');
  const [careerDescription, setCareerDescription] = useState('');
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generated = await generateCareerQuestions(
        careerTitle,
        careerDescription,
        5
      );

      // Moderate all content
      const moderated = [];
      for (const q of generated) {
        const safety = await moderateContent(q.questionText);
        if (safety.isSafe) {
          moderated.push(q);
        }
      }

      setQuestions(moderated);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">AI Content Generation</h1>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Career Title (e.g., Software Engineer)"
          value={careerTitle}
          onChange={(e) => setCareerTitle(e.target.value)}
          className="w-full p-3 border rounded"
        />

        <textarea
          placeholder="Career Description..."
          value={careerDescription}
          onChange={(e) => setCareerDescription(e.target.value)}
          rows={6}
          className="w-full p-3 border rounded"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Generated Questions</h2>
          {questions.map((q, idx) => (
            <div key={idx} className="border p-4 rounded-lg">
              <p className="font-medium mb-2">{q.questionText}</p>
              <div className="space-y-2 ml-4">
                {q.options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className={opt.isCorrect ? 'text-green-600 font-semibold' : ''}
                  >
                    {String.fromCharCode(65 + optIdx)}. {opt.text}
                    {opt.isCorrect && ' ✓'}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2 italic">{q.explanation}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-gray-200 rounded text-xs">
                {q.difficultyLevel}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Environment Configuration

```bash
# .env
AZURE_OPENAI_ENDPOINT=https://pathfinity-ai-foundry.openai.azure.com/
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_DEPLOYMENT_GPT4=gpt-4o-3
AZURE_OPENAI_DEPLOYMENT_DALLE=dall-e-3

AZURE_CONTENT_SAFETY_ENDPOINT=https://pathfinity-ai-foundry.cognitiveservices.azure.com/
AZURE_CONTENT_SAFETY_KEY=<your-key>
```

---

## Cost Optimization

### Model Selection Strategy

1. **GPT-4o-3** (Primary)
   - Use for: Question generation, career descriptions, pathkey text
   - Pricing: ~$2.50-10 per 1M tokens (input) / ~$10-30 per 1M tokens (output)
   - **Estimated:** $0.01-0.05 per question set (5 questions)

2. **GPT-3.5-turbo** (Budget option)
   - Use for: Simple text enhancements, rephrasing
   - Pricing: ~$0.50-1.50 per 1M tokens
   - **Estimated:** $0.001-0.01 per question set

3. **DALL-E 3** (Images)
   - Pricing: ~$0.04-0.12 per image (depending on quality/size)
   - HD 1024x1024: $0.08 per image
   - **Use sparingly**: Generate images only when needed, cache results

### Caching Strategy

```typescript
// Cache generated content in Supabase
export async function getOrGenerateQuestions(
  careerId: string,
  forceRegenerate = false
): Promise<Question[]> {
  // Check cache first
  if (!forceRegenerate) {
    const { data: cached } = await supabase
      .from('questions')
      .select('*')
      .eq('career_id', careerId)
      .eq('generated_by', 'ai');

    if (cached && cached.length > 0) {
      return cached;
    }
  }

  // Generate new
  const career = await getCareer(careerId);
  const generated = await generateCareerQuestions(career.title, career.description);

  // Save to cache
  await supabase.from('questions').insert(
    generated.map(q => ({
      career_id: careerId,
      question_text: q.questionText,
      options: q.options,
      generated_by: 'ai',
      created_at: new Date()
    }))
  );

  return generated;
}
```

---

## Testing Results ✅

**Test Script:** `scripts/test-azure-ai.mjs`

### GPT-4o Chat Completion
✅ **PASSED** - Successfully generated educational content

**Example Output:**
```
Question: Imagine you're designing an app that helps students organize their homework...
Which of the following is the most important first step in the software development process?

A) Start coding the app immediately.
B) Test the app with your friends to see if they like it.
C) Identify the problem and plan the app's features. ✓ CORRECT
D) Choose the app's color scheme and fonts.
```

### Structured Question Generation (JSON)
✅ **PASSED** - Successfully generated structured questions with JSON response format

**Example Output:**
```json
{
  "questionText": "Which of the following is a primary responsibility of a Registered Nurse?",
  "options": [
    {"text": "Diagnosing medical conditions", "isCorrect": false},
    {"text": "Providing direct patient care and administering medications", "isCorrect": true},
    {"text": "Performing surgical procedures", "isCorrect": false},
    {"text": "Prescribing medications independently", "isCorrect": false}
  ],
  "explanation": "RNs are primarily responsible for providing direct patient care...",
  "difficultyLevel": "medium"
}
```

### DALL-E 3 Image Generation
⏭️ **SKIPPED** - Available but not tested to avoid cost ($0.08 per image)

---

## Working Configuration

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: 'https://pathfinity-ai.openai.azure.com/openai/deployments/gpt-4o',
  defaultQuery: { 'api-version': '2024-08-01-preview' },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

// Generate content
const result = await client.chat.completions.create({
  model: '', // model is in baseURL for Azure
  messages: [
    { role: 'system', content: 'You are an educational content creator.' },
    { role: 'user', content: 'Generate a question about nursing...' }
  ],
  temperature: 0.7,
  max_tokens: 600,
  response_format: { type: 'json_object' } // For structured responses
});
```

---

## Next Steps

1. ✅ **Set up API keys** - COMPLETE
   - API key retrieved and tested
   - Add `AZURE_OPENAI_API_KEY` to environment variables

2. ⏳ **Implement content generation service** - READY
   - Create `packages/shared/src/services/ai-content-generation.service.ts`
   - Use working configuration from test script
   - Add moderation layer (optional)
   - Set up caching in Supabase

3. ⏳ **Build admin dashboard** - READY
   - Create `packages/web/src/pages/admin/ContentGenerationPage.tsx`
   - Content generation UI
   - Review/edit interface
   - Bulk generation tools

4. ⏳ **Production deployment**
   - Add API key to Netlify environment variables
   - Consider Azure Functions for server-side generation (avoid exposing API key)

Ready to implement the content generation service!
