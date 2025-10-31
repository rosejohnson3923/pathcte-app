# Azure Storage Assets - Upload Plan
**Date:** October 28, 2025
**Status:** 📋 PLANNING

---

## Overview

This document outlines the assets needed for Azure Storage containers and provides a plan for sourcing and uploading them.

---

## 1. Pathkey Images (16 total)

### Container: `pathkeys`
### Format: PNG (400x400px recommended)
### Naming: `{key_code}.png` (e.g., `DEV-001.png`)

| Key Code | Name | Type | Rarity | Color | Description |
|----------|------|------|--------|-------|-------------|
| **Career Pathkeys** |
| DEV-001 | Code Master | career | epic | #6366f1 (Indigo) | Software development 💻 |
| NURSE-001 | Caring Heart | career | rare | #ef4444 (Red) | Healthcare ❤️ |
| MARKET-001 | Brand Builder | career | uncommon | #f59e0b (Amber) | Marketing 📊 |
| PR-001 | Voice of Change | career | uncommon | #8b5cf6 (Purple) | Public relations 📢 |
| CIVIL-001 | Foundation Layer | career | rare | #06b6d4 (Cyan) | Civil engineering 🏗️ |
| TEACH-001 | Knowledge Keeper | career | uncommon | #10b981 (Green) | Teaching 📚 |
| PHYS-001 | Reality Bender | career | legendary | #ec4899 (Pink) | Physics ⚛️ |
| ADMIN-001 | Office Ace | career | common | #64748b (Slate) | Administration 📋 |
| **Skill Pathkeys** |
| SKILL-CODE | First Lines | skill | common | #3b82f6 (Blue) | Programming </> |
| SKILL-PROB | Problem Solver | skill | uncommon | #14b8a6 (Teal) | Critical thinking 🧩 |
| SKILL-COMM | Great Communicator | skill | uncommon | #f97316 (Orange) | Communication 💬 |
| SKILL-LEAD | Team Leader | skill | rare | #84cc16 (Lime) | Leadership 👥 |
| **Industry Pathkeys** |
| IND-TECH | Tech Pioneer | industry | uncommon | #6366f1 (Indigo) | Technology 🚀 |
| IND-HEALTH | Healthcare Hero | industry | rare | #dc2626 (Red) | Healthcare ⚕️ |
| IND-BIZ | Business Mogul | industry | uncommon | #0891b2 (Cyan) | Business 💼 |
| **Milestone Pathkeys** |
| MILE-FIRST | First Victory | milestone | common | #fbbf24 (Amber) | First game 🏆 |

### Design Guidelines for Pathkeys:
- **Size:** 400x400px (square)
- **Format:** PNG with transparency
- **Style:**
  - Badge/shield shape with icon in center
  - Gradient background using primary → secondary color
  - White or gold border based on rarity
  - Emoji/icon should be prominent
  - Add subtle shine/glow effect for rare+ pathkeys
- **Rarity Visual Indicators:**
  - **common:** Simple border, matte finish
  - **uncommon:** Silver border, slight glow
  - **rare:** Gold border, moderate glow
  - **epic:** Purple border, strong glow with particle effects
  - **legendary:** Rainbow/prismatic border, animated glow, sparkles

---

## 2. Career Images (8 total)

### Container: `careers`
### Format: JPG (main), MP4 (optional video)
### Naming: `{career_code}/main.jpg`, `{career_code}/main.mp4`

| O*NET Code | Title | Career Code | Industry | Suggested Image Content |
|------------|-------|-------------|----------|------------------------|
| 15-1252.00 | Software Developer | software-developer | Technology | Person coding at desk, multiple monitors, modern office |
| 29-1141.00 | Registered Nurse | registered-nurse | Healthcare | Nurse caring for patient, hospital setting, compassionate |
| 11-2021.00 | Marketing Manager | marketing-manager | Business | Professional presenting campaign, charts, creative team |
| 27-3031.00 | Public Relations Specialist | pr-specialist | Communications | Person at press event, microphones, media engagement |
| 17-2051.00 | Civil Engineer | civil-engineer | Engineering | Engineer at construction site, blueprints, hard hat |
| 25-2021.00 | Elementary School Teacher | elementary-teacher | Education | Teacher with students, classroom, engaging lesson |
| 19-2012.00 | Physicist | physicist | Science | Scientist in lab, equations, research equipment |
| 43-6014.00 | Administrative Assistant | admin-assistant | Business | Professional organizing office, desk, multitasking |

### Design Guidelines for Career Images:
- **Size:** 1200x800px (3:2 ratio) for main image
- **Format:** JPG (high quality, ~200KB)
- **Style:**
  - Professional, realistic photography
  - Diverse representation (age, gender, ethnicity)
  - Bright, welcoming, modern environments
  - Show actual work environment/tools
  - Positive, aspirational tone

---

## 3. Avatar Placeholders (Optional)

### Container: `avatars`
### Format: JPG (profile picture)
### Naming: `default-{1-10}.jpg`

Create 10 default avatar images for users without uploaded avatars:
- Geometric patterns
- Abstract gradients
- Simple icons
- Size: 400x400px
- Circular-safe (important elements in center)

---

## 4. Achievement Icons (Future)

### Container: `achievements`
### Format: PNG (with transparency)
### Naming: `{achievement_id}.png`

Not needed immediately, but plan for future achievements/badges:
- Size: 256x256px
- Similar style to pathkeys but more badge-like
- Examples: "Streak Master", "Perfect Score", "Speed Demon", etc.

---

## Sourcing Options

### Option 1: AI Image Generation (Recommended for Pathkeys)
**Tool:** DALL-E, Midjourney, or Stable Diffusion
**Cost:** $10-30 for all pathkeys
**Time:** 2-3 hours

**Prompt Template for Pathkeys:**
```
Create a digital collectible badge icon for "{Pathkey Name}", {emoji} theme.
- Style: Modern gaming collectible, digital art, glossy finish
- Colors: Gradient from {primary_color} to {secondary_color}
- Shape: Shield or hexagonal badge
- Center: Large {emoji} icon
- Border: {rarity} quality (common/uncommon/rare/epic/legendary)
- Effects: {glow/sparkle effects based on rarity}
- Background: Transparent PNG
- Size: 400x400px
- Professional, high-quality, game asset style
```

### Option 2: Stock Photography (Recommended for Careers)
**Sources:**
- Unsplash (free, high quality)
- Pexels (free, diverse selection)
- Pixabay (free, good variety)

**Search Terms:**
- "software developer coding"
- "nurse patient care"
- "marketing professional presentation"
- etc.

**Cost:** FREE
**Time:** 2-3 hours to find and download

### Option 3: Custom Design (Premium)
**Tool:** Hire designer on Fiverr/Upwork
**Cost:** $100-500 for all assets
**Time:** 1-2 weeks

### Option 4: Placeholder Images (Temporary)
**Tool:** Use higher quality placeholders
**Sources:**
- UI Faces (for avatars)
- Hero Patterns (for backgrounds)
- Placeholder.com (current solution)

**Cost:** FREE
**Time:** 30 minutes

---

## Upload Process

### Prerequisites
1. Azure Storage configured ✅
2. SAS token valid (expires Oct 27, 2027) ✅
3. Containers created (pathkeys, careers, avatars, achievements) ✅
4. azure-storage.service.ts implemented ✅

### Upload Script

We'll create a Node.js script to batch upload assets:

**File:** `scripts/upload-assets.mjs`

Features:
- Upload all pathkey images to `pathkeys` container
- Upload all career images to `careers` container
- Verify uploads with checksums
- Update database `image_url` fields
- Progress reporting

### Manual Upload Steps (Alternative)

Use Azure Portal or Azure Storage Explorer:

1. **Azure Portal:**
   - Navigate to pathcte storage account
   - Select container
   - Click "Upload"
   - Select files
   - Set content type

2. **Azure Storage Explorer:**
   - Download: https://azure.microsoft.com/en-us/products/storage/storage-explorer/
   - Connect with SAS URL
   - Drag and drop files
   - Set metadata

---

## Implementation Plan

### Phase 1: Create Pathkey Images (4-6 hours)
1. Set up AI image generation tool
2. Generate 16 pathkey images using prompts
3. Download and organize in `assets/pathkeys/` folder
4. Review and ensure quality

### Phase 2: Source Career Images (2-3 hours)
1. Search stock photo sites
2. Download 8 high-quality career images
3. Optimize images (resize, compress)
4. Organize in `assets/careers/` folder

### Phase 3: Create Upload Script (2-3 hours)
1. Write `scripts/upload-assets.mjs`
2. Test with sample files
3. Add error handling
4. Add progress reporting

### Phase 4: Upload Assets (1 hour)
1. Run upload script
2. Verify in Azure Portal
3. Test loading in application
4. Update database URLs if needed

### Phase 5: Update Database (1 hour)
1. Write SQL migration to update `image_url` fields
2. Update pathkeys table
3. Update careers table
4. Verify changes

**Total Estimated Time:** 10-14 hours

---

## SQL Updates After Upload

```sql
-- Update pathkey image URLs
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/DEV-001.png?{sas}' WHERE key_code = 'DEV-001';
UPDATE pathkeys SET image_url = 'https://pathcte.blob.core.windows.net/pathkeys/NURSE-001.png?{sas}' WHERE key_code = 'NURSE-001';
-- ... repeat for all pathkeys

-- Update career image URLs (using career_code derived from onet_code)
UPDATE careers SET image_url = 'https://pathcte.blob.core.windows.net/careers/software-developer/main.jpg?{sas}' WHERE onet_code = '15-1252.00';
UPDATE careers SET image_url = 'https://pathcte.blob.core.windows.net/careers/registered-nurse/main.jpg?{sas}' WHERE onet_code = '29-1141.00';
-- ... repeat for all careers
```

Or use the upload script to automatically generate and execute these updates.

---

## Testing Checklist

After uploading assets:

- [ ] Pathkey images load in CollectionPage
- [ ] Career images load in CareersPage
- [ ] Images load in DashboardPage pathkey display
- [ ] Fallback placeholders work when image missing
- [ ] Images display correctly in dark mode
- [ ] CORS configured correctly (no console errors)
- [ ] Images load with reasonable performance (<2s)
- [ ] Mobile display looks good (responsive images)

---

## Budget Estimate

| Item | Option | Cost |
|------|--------|------|
| Pathkey Images | AI Generation | $10-30 |
| Career Images | Stock Photos (Free) | $0 |
| Upload Script | DIY | $0 |
| Azure Storage (Monthly) | Pay-as-you-go | $5-10 |
| **TOTAL (One-time)** | | **$10-30** |
| **TOTAL (Monthly)** | | **$5-10** |

---

## Next Steps

1. **Choose pathkey image source** (AI generation recommended)
2. **Download career images** from stock photo sites
3. **Create upload script** (`scripts/upload-assets.mjs`)
4. **Generate/download all assets** and organize in `assets/` folder
5. **Upload to Azure** using script
6. **Update database** with new URLs
7. **Test in application** across all pages

---

## Files to Create

```
pathcte.app/
├── assets/                    # Local asset storage (not committed)
│   ├── pathkeys/
│   │   ├── DEV-001.png
│   │   ├── NURSE-001.png
│   │   └── ... (16 total)
│   └── careers/
│       ├── software-developer/
│       │   └── main.jpg
│       ├── registered-nurse/
│       │   └── main.jpg
│       └── ... (8 total)
├── scripts/
│   └── upload-assets.mjs      # Upload script (TO CREATE)
└── docs/
    └── AZURE_ASSETS_NEEDED.md # This file
```

---

## Status: Ready to Execute

✅ **Infrastructure:** Complete (Azure Storage configured)
✅ **Documentation:** Complete (this file)
⏭️ **Asset Creation:** Pending (next step)
⏭️ **Upload Script:** Pending (to be created)
⏭️ **Upload:** Pending (after assets created)
⏭️ **Testing:** Pending (after upload)

**Recommendation:** Start with Phase 1 (pathkey images) as they are more critical for the gaming experience. Career images can use stock photos temporarily.
