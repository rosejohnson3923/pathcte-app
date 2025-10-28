# Data Generation Scripts

Scripts for generating realistic data using AI to populate the Pathket database.

## Setup

1. **Install dependencies:**
   ```bash
   npm install openai @supabase/supabase-js dotenv tsx
   ```

2. **Add OpenAI API key to your `.env` file:**
   ```bash
   # In packages/web/.env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

3. **Make sure you have Supabase credentials in `.env`:**
   ```bash
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Scripts

### Generate Question Sets (`generate-questions-openai.ts`)

Generates diverse question sets about various career fields using OpenAI, then inserts them into Supabase.

**What it creates:**
- 8 question sets covering different career sectors
- 10 questions per set (80 total questions)
- Multiple choice questions with 4 options each
- Appropriate for grades 9-12
- Varying difficulty levels (easy, medium, hard)

**Topics covered:**
1. Healthcare Careers Fundamentals
2. Technology & Engineering Basics
3. Business & Finance Careers
4. Creative Arts & Design
5. Science & Research Careers
6. Education & Teaching
7. Public Service & Law
8. Environmental & Agriculture

**Run the script:**
```bash
npx tsx scripts/generate-questions-openai.ts
```

**Prerequisites:**
- You must have a teacher account created in the database
- If no teacher exists, the script will prompt you to create one at `/signup`

**Cost estimate:**
- Uses GPT-4-mini model (~$0.15 per million tokens)
- Generating 80 questions costs approximately $0.02-0.05

**Output:**
```
🚀 Starting Question Generation Script
==================================================
👤 Finding or creating teacher user...
✅ Using existing teacher: abc-123-def
==================================================
🤖 Generating 10 questions for: Healthcare Careers Fundamentals
✅ Generated 10 questions
📝 Creating question set: Healthcare Careers Fundamentals
✅ Question set created with ID: xyz-789-abc
📚 Inserting 10 questions...
✅ Successfully inserted 10 questions
✨ Completed: Healthcare Careers Fundamentals
...
🎉 All question sets generated successfully!
Total question sets created: 8
Total questions created: 80
```

## Customization

### Add More Question Sets

Edit the `QUESTION_SET_TEMPLATES` array in `generate-questions-openai.ts`:

```typescript
const QUESTION_SET_TEMPLATES = [
  {
    title: 'Your Custom Topic',
    description: 'Description of the topic',
    subject: 'Subject Name',
    career_sector: 'Sector Name',
    grade_level: [9, 10, 11, 12],
    difficulty_level: 'medium',
    tags: ['tag1', 'tag2'],
  },
  // ... more templates
];
```

### Change Number of Questions

Modify the call to `generateQuestionsForSet()`:

```typescript
// Generate 15 questions instead of 10
const questions = await generateQuestionsForSet(template, 15);
```

### Customize Question Generation

Edit the prompt in the `generateQuestionsForSet()` function to change:
- Question style
- Difficulty
- Focus areas
- Answer format

## Troubleshooting

**Error: "No teacher account found"**
- Solution: Create a teacher account at `/signup` with `user_type="teacher"`

**Error: "OPENAI_API_KEY is not set"**
- Solution: Add your OpenAI API key to `packages/web/.env`

**Error: "Invalid API key"**
- Solution: Verify your OpenAI API key is correct and active

**Error: "Rate limit exceeded"**
- Solution: The script includes 1-second delays between sets. If still hitting limits, increase the delay.

**Questions seem low quality**
- Solution: Adjust the `temperature` parameter (currently 0.8) or modify the system prompt

## Future Scripts

Additional data generation scripts can be created for:
- Career data enrichment
- Pathkey descriptions
- Student progress simulation
- Analytics event generation
- Market item descriptions
