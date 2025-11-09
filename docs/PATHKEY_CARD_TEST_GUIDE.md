# Pathkey Card Component - Isolated Test Guide

## Overview

This guide explains how to use the isolated test page for the new Career Pathkey Card component.

## What is This?

The Career Pathkey Award System has three progressive unlock sections:
- **Section 1:** Career Image (🎯 Top 3 in Career mode)
- **Section 2:** Lock (🔒 3 Industry/Cluster sets at 90%)
- **Section 3:** Key (🔑 All 6 business drivers mastered)

The isolated test page allows you to view and interact with the `CareerPathkeyCard` component using mock data, without needing to play actual games or set up database records.

## How to Access

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Navigate to Test Page

Open your browser and go to:
```
http://localhost:5173/test-pathkey-card
```

**Note:** The page is **not protected** by authentication - you can access it directly without logging in. This makes testing easier.

## Test Scenarios

The test page provides **4 different scenarios** to showcase the component in various states:

### Scenario 1: Complete Pathkey ✨
- **All 3 sections unlocked**
- Shows golden border and "COMPLETE" badge
- All images displayed (if available)
- All business drivers mastered
- Example: Student has fully completed Public Relations Specialist pathkey

### Scenario 2: Section 1 Only
- **Only Career Image unlocked**
- Blue border (in progress)
- Lock and Key sections show as locked
- Progress bars show Section 2 at 1/3 sets
- Business drivers show partial progress

### Scenario 3: Sections 1 & 2
- **Career Image + Lock unlocked**
- Blue border (in progress)
- Key section shows partial business driver progress
- 2 out of 6 drivers mastered

### Scenario 4: In Progress
- **No sections unlocked yet**
- Gray border
- All sections show as locked
- Shows initial state before any achievements

## Mock Data

### Career
- **Title:** Public Relations Specialist
- **Sector:** Marketing & Community
- **Cluster:** Marketing
- **Career ID:** c9525a26-27a7-43e3-9c63-cccf82119fd8

### Images (Azure Blob Storage)
- **Career:** PR-001.png (Public Relations pathkey)
- **Lock:** MILE-FIRST.png (First Milestone pathkey)
- **Key:** SKILL-CODE.png (Coding Skill pathkey)
- **Base URL:** https://pathctestore.blob.core.windows.net/pathkeys/

### Student
- **Email:** student@esposure.gg (mock data only)

## Component Features Demonstrated

### Visual Indicators
- ✅ **Green checkmarks** for unlocked sections
- 🔒 **Lock icons** for locked sections requiring prerequisites
- ❌ **X marks** for sections not yet unlocked
- **Progress bars** for Section 2 (sets completed)
- **Business driver grid** for Section 3 (6 drivers with status)

### Color Coding
- **Golden border** = Complete (all 3 sections)
- **Blue border** = In progress (at least 1 section unlocked)
- **Gray border** = Not started (no sections unlocked)

### Section Badges
- **Number badges** (1, 2, 3) show section status
- **Green badges** = Unlocked
- **Blue badges** = Available (prerequisite met)
- **Gray badges** = Locked (prerequisite not met)

### Interactive Elements
- Click scenario buttons to switch between states
- Hover over card for shine effect
- View JSON data structure on the right panel

## Image Handling

### Expected Behavior
- Images load from Azure Blob Storage
- If image fails to load, a placeholder is shown
- Placeholder shows appropriate icon (Trophy, Lock, or Key)
- Text indicates if image is "Image Pending" or unlock requirement

### Testing Without Images
The component gracefully handles missing images:
- **Section 1 unlocked but no image:** Shows Trophy icon + "Image Pending"
- **Section 2 unlocked but no image:** Shows Lock icon + "Image Pending"
- **Section 3 unlocked but no image:** Shows Key icon + "Image Pending"
- **Section locked:** Shows icon + unlock requirement text

## Data Structure

The component receives props in this format:

```typescript
{
  careerId: string,
  careerTitle: string,
  careerSector?: string,
  careerCluster?: string,

  section1: {
    unlocked: boolean,
    unlockedAt?: string, // ISO timestamp
  },

  section2: {
    unlocked: boolean,
    unlockedAt?: string,
    via?: 'industry' | 'cluster',
    progress?: number,  // e.g., 2
    required?: number,  // e.g., 3
  },

  section3: {
    unlocked: boolean,
    unlockedAt?: string,
    drivers?: [
      {
        driver: 'people' | 'product' | 'pricing' | 'process' | 'proceeds' | 'profits',
        mastered: boolean,
        currentProgress: number,  // e.g., 3
        required: number,         // always 5
      }
    ],
  },

  images: {
    career?: string,  // Full Azure URL
    lock?: string,
    key?: string,
  },

  showProgress?: boolean,  // Show progress bars/grids
  onClick?: () => void,
  className?: string,
}
```

## Testing Checklist

Use this checklist to verify all component features:

### Visual Tests
- [ ] Complete pathkey shows golden border and "COMPLETE" badge
- [ ] In-progress pathkey shows blue border
- [ ] Locked pathkey shows gray border
- [ ] Section numbers display correct colors (green/blue/gray)
- [ ] Checkmarks and X icons appear correctly
- [ ] Hover effect works (shine animation)

### Section 1 Tests
- [ ] Unlocked state shows career image (or placeholder)
- [ ] Locked state shows Trophy icon + requirement text
- [ ] Unlock date displays when unlocked

### Section 2 Tests
- [ ] Unlocked state shows lock image (or placeholder)
- [ ] Locked state shows Lock icon + requirement text
- [ ] Progress bar displays correctly (1/3, 2/3, 3/3)
- [ ] "Unlock Section 1 First" message shows when Section 1 locked
- [ ] "via industry" or "via cluster" displays when unlocked

### Section 3 Tests
- [ ] Unlocked state shows key image (or placeholder)
- [ ] Locked state shows Key icon + requirement text
- [ ] Business driver grid displays 6 drivers (3x2 grid)
- [ ] Mastered drivers show green border and checkmark
- [ ] In-progress drivers show current progress (e.g., 3/5)
- [ ] Driver icons display correctly (👥 📦 💰 ⚙️ 📈 💎)

### Data Panel Tests
- [ ] JSON data structure displays correctly
- [ ] Props update when switching scenarios
- [ ] All fields present in mock data

### Documentation Tests
- [ ] "How to Earn Each Section" displays correctly
- [ ] All three sections explained
- [ ] Prerequisites noted
- [ ] Test information box shows career details

## Next Steps

### After Testing the Component

1. **Create Real Data Script** (if needed)
   - Script to populate actual database with test pathkey data
   - Use `student@esposure.gg` or another test account

2. **Integrate into Collection Page**
   - Add `CareerPathkeyCard` to the existing pathkey collection view
   - Query real student pathkey data
   - Handle loading states

3. **Create Pathkey Detail Modal**
   - Expanded view when clicking a pathkey card
   - Show detailed progress for each section
   - Display unlock dates and achievements

4. **Add to Dashboard**
   - Show recently earned sections
   - Display progress toward next unlock
   - Quick view of all pathkeys

## File Locations

### Component
```
packages/web/src/components/pathkeys/CareerPathkeyCard.tsx
```

### Test Page
```
packages/web/src/pages/TestPathkeyCardPage.tsx
```

### Router Configuration
```
packages/web/src/App.tsx
```
Route: `/test-pathkey-card`

### Documentation
```
docs/PATHKEY_CARD_TEST_GUIDE.md (this file)
docs/PATHKEY_AWARD_SYSTEM_DESIGN.md (system design)
docs/PATHKEY_IMPLEMENTATION_NOTES.md (implementation notes)
docs/HOW_TO_PLAY.md (user documentation)
```

## Troubleshooting

### Images Not Loading
**Symptom:** All three sections show placeholder icons instead of images.

**Causes:**
1. Images don't exist in Azure with the expected filenames
2. SAS token expired or invalid
3. CORS configuration blocking requests
4. Network connectivity issues

**Solution:**
1. Check browser DevTools Network tab for 404 or 403 errors
2. Verify image filenames match those in TestPathkeyCardPage.tsx
3. Confirm SAS token is valid (expires 2027-11-01)
4. Check CORS settings in Azure Storage Account if needed

### Component Not Rendering
**Symptom:** Blank page or error in console.

**Check:**
1. Development server is running (`npm run dev`)
2. No TypeScript errors in console
3. Route is correctly configured in `App.tsx`

### Scenario Buttons Not Working
**Symptom:** Clicking scenario buttons doesn't change the card.

**Check:**
1. React DevTools to verify state is updating
2. Console for JavaScript errors
3. Mock data structure is correct

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all files are in correct locations
3. Ensure development server restarted after changes
4. Review component props match expected interface

---

**Created:** January 2025
**Component Version:** 1.0
**Test Page Version:** 1.0
