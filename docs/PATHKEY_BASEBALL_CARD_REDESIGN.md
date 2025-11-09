# Career Pathkey Baseball Card Redesign

## Overview

Redesigned the CareerPathkeyCard component from a **stacked three-section layout** to a **single baseball card-style composite layout**, matching the user's vision.

## Before vs After

### ❌ Before (Original Design)
- Three separate horizontal sections stacked vertically
- Each section: 16:9 aspect ratio (landscape)
- Progress bars and driver grids shown inline
- Total card was very tall and wide
- Similar to a vertical accordion

### ✅ After (Baseball Card Design)
- Single composite card with portrait aspect ratio (3:4)
- **Top section (65% height):** Large career image
- **Bottom row (35% height):** Lock (left) and Key (right) side by side
- Compact, baseball card proportions
- Visual badges instead of detailed progress displays

## Layout Structure

```
┌─────────────────────────────────┐
│   CAREER TITLE HEADER           │ ← Header (colored gradient)
├─────────────────────────────────┤
│                                 │
│     CAREER IMAGE (Section 1)    │ ← 60% height
│         (Large)                 │
│                                 │
├─────────────────┬───────────────┤
│  LOCK IMAGE     │  KEY IMAGE    │ ← 40% height
│  (Section 2)    │ (Section 3)   │
│   (Small)       │(Small, 45° ↗) │
└─────────────────┴───────────────┘
```

**Aspect Ratio:** 3:4 (portrait, like a baseball card)

## Key Features

### 1. Composite Image Layout
- Three images arranged into a single card
- CSS Grid/Flexbox positioning
- No need for pre-composed images
- Dynamic showing/hiding of sections based on unlock status

### 2. Section States

**Unlocked Section:**
- Shows actual image from Azure Blob Storage
- Green checkmark badge in top-left corner
- Gradient overlay for depth

**Locked Section:**
- Gray background with icon (Trophy, Lock, or Key)
- Short text hint (e.g., "3 Sets" or "6 Drivers")
- Numbered badge (1, 2, or 3) in top-left corner

### 3. Visual Indicators

**Complete State (All 3 sections unlocked):**
- Gold/amber border (4px)
- Gold gradient header
- "✨ COMPLETE" badge in top-right corner
- Pulsing animation

**In Progress (1-2 sections unlocked):**
- Blue border (4px)
- Blue gradient header
- Active sections show checkmarks

**Not Started (0 sections unlocked):**
- Gray border (4px)
- Gray gradient header
- All sections show locks/numbers

### 4. Compact Design
- Header shows career title + sector badge
- No inline progress bars or driver grids
- All detailed progress moved to detail modal (future)
- Hover effect: scale and glow

## Implementation Details

### Component File
`packages/web/src/components/pathkeys/CareerPathkeyCard.tsx`

**Key Changes:**
- Line 96: `style={{ aspectRatio: '3/4' }}`
- Lines 128-156: Career image section (60% height)
- Lines 159-219: Bottom row with lock (left) and key (right) (40% height)
- Lock and Key icons: Reduced to size={16} (from 24)
- Key icon: Added `rotate-45` class for horizontal orientation
- Removed: Progress bars, driver grids, section dividers

### Test Page
`packages/web/src/pages/TestPathkeyCardPage.tsx`

**Layout Changes:**
- Changed from 2-column to 3-column grid
- Left column (1/3): Baseball card preview (max-width: 300px)
- Right columns (2/3): JSON data preview
- Updated documentation to explain composite layout

### CSS Highlights

```css
/* Main card container */
aspect-ratio: 3/4;
border: 4px solid;
border-radius: 1rem;

/* Top section: Career image */
height: 60%;
border-bottom: 2px solid gray;

/* Bottom row */
height: 40%;
display: flex;

/* Lock (left) and Key (right) */
width: 50%;
border-right: 2px solid gray; /* Lock only */

/* Key icon rotation */
transform: rotate(45deg); /* Makes key horizontal */
```

## Unlocking Flow Examples

### Example 1: New Player (0 sections)
```
┌─────────────────────────────────┐
│   Public Relations Specialist   │ GRAY HEADER
├─────────────────────────────────┤
│         🏆 Trophy Icon          │
│      "Unlock: Top 3"            │ ALL GRAY
│            [1]                  │ BACKGROUNDS
├─────────────────┬───────────────┤
│   🔒 Lock Icon  │  🔑 Key Icon  │
│    "Locked"     │   "Locked"    │
│       [2]       │      [3]      │
└─────────────────┴───────────────┘
```

### Example 2: Section 1 Only
```
┌─────────────────────────────────┐
│   Public Relations Specialist   │ BLUE HEADER
├─────────────────────────────────┤
│   [PR Specialist Image]         │ IMAGE SHOWN
│         ✓ Checkmark             │ WITH CHECKMARK
│                                 │
├─────────────────┬───────────────┤
│   🔒 Lock Icon  │  🔑 Key Icon  │ BOTTOM SECTIONS
│    "3 Sets"     │  "6 Drivers"  │ STILL LOCKED
│       [2]       │      [3]      │ (Blue tint)
└─────────────────┴───────────────┘
```

### Example 3: Complete (All 3 sections)
```
┌─────────────────────────────────┐
│   Public Relations Specialist   │ GOLD HEADER
├─────────────────────────────────┤ "✨ COMPLETE"
│   [PR Specialist Image]         │
│         ✓ Checkmark             │ ALL THREE
│                                 │ IMAGES SHOWN
├─────────────────┬───────────────┤
│  [Lock Image]   │  [Key Image]  │ WITH
│      ✓          │      ✓        │ CHECKMARKS
└─────────────────┴───────────────┘
```

## Benefits

### User Experience
✅ **Familiar format** - Looks like a collectible baseball/trading card
✅ **At-a-glance status** - Immediate visual understanding of progress
✅ **Compact display** - Fits in grids, dashboards, collections
✅ **Progressive disclosure** - Detail view can show full progress

### Technical
✅ **No composite images needed** - Uses existing pathkey PNGs
✅ **Flexible states** - CSS handles all unlock combinations
✅ **Responsive** - Scales to any size while maintaining aspect ratio
✅ **Reusable** - Same component for all 50 careers

### Future-Proof
✅ **Detail modal ready** - Card can expand to show full progress
✅ **Grid friendly** - Works in 2x2, 3x3, or list layouts
✅ **Hover/tap ready** - Easy to add interactions

## Image Requirements

### Per Career (3 images needed)
1. **Career Image** - Main professional image (portrait preferred)
   - Recommended: 800x600 or larger
   - Shows the professional in action
   - Used in top section (65% of card)

2. **Lock Image** - Industry/cluster themed lock graphic
   - Recommended: 400x400 or larger
   - Gold/amber colored lock design
   - Used in bottom-left (17.5% of card)

3. **Key Image** - Business driver themed key graphic
   - Recommended: 400x400 or larger
   - Career-cluster specific design
   - Used in bottom-right (17.5% of card)

### Naming Convention
Currently using existing pathkey images for testing:
- `PR-001.png` (Career - Public Relations)
- `MILE-FIRST.png` (Lock - Milestone)
- `SKILL-CODE.png` (Key - Coding)

**Future naming for career-specific images:**
```
{career-slug}-career.png
{career-slug}-lock.png
{career-slug}-key.png

Example:
public-relations-career.png
public-relations-lock.png
public-relations-key.png
```

## Testing

### Test Page
`http://localhost:5173/test-pathkey-card`

**Scenarios Available:**
1. **Complete** - All 3 sections unlocked
2. **Section 1 Only** - Career image only
3. **Sections 1 & 2** - Career + Lock images
4. **In Progress** - All sections locked

### Visual Verification
- [x] Baseball card aspect ratio (3:4)
- [x] Large career image at top
- [x] Small lock/key images at bottom
- [x] Border colors change with status (gold/blue/gray)
- [x] Checkmarks appear on unlocked sections
- [x] Complete badge shows when all unlocked
- [x] Hover effect works
- [x] Images load from Azure with SAS tokens

## Next Steps

### Future Enhancements
1. **Detail Modal** - Click card to view:
   - Full progress bars for Section 2
   - Business driver grid for Section 3
   - Unlock dates and timestamps
   - Achievement history

2. **Collection Grid** - Integrate into Collection page:
   - Grid layout (3-4 cards per row)
   - Filter by sector/cluster
   - Sort by completion, recency
   - Search by career name

3. **Dashboard Widget** - Recent unlocks:
   - Show latest 3-4 cards
   - Animated when new section unlocks
   - Quick stats overlay

4. **Animations** - Polish:
   - Unlock animation when section completes
   - Flip card animation to show back (stats)
   - Shine/glint effect on complete cards

---

**Created:** January 2025
**Design:** Baseball card composite layout
**Implementation:** CSS Grid + Flexbox
**Status:** ✅ Complete and tested
