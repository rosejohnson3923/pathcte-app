# Theme Fix - Restart Instructions

## ✅ All Code Changes Complete!

The design system has been fully fixed. To see the changes, you need to restart your development server.

## 🔄 Required Steps:

### 1. Stop the Current Dev Server
Press `Ctrl+C` in the terminal where your dev server is running.

### 2. Clear the Build Cache (Important!)
```bash
cd packages/web
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist
```

### 3. Restart the Dev Server
```bash
npm run dev
```

### 4. Hard Refresh Your Browser
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

## 📋 What Was Fixed:

### Tailwind Configuration Updated
- Added proper `backgroundColor`, `textColor`, and `borderColor` mappings
- CSS variables are now correctly referenced

### All Components Updated (17 files)
- ✅ App.tsx
- ✅ Card.tsx, Modal.tsx
- ✅ Header.tsx, Sidebar.tsx, DashboardLayout.tsx
- ✅ DashboardPage.tsx, CollectionPage.tsx, CareersPage.tsx
- ✅ CareerDetail.tsx
- ✅ index.css with semantic base styles

### New Semantic Utilities Available:

**Backgrounds:**
- `bg-bg-primary` - Main background
- `bg-bg-secondary` - Secondary background
- `bg-bg-tertiary` - Tertiary background

**Text:**
- `text-text-primary` - Primary text
- `text-text-secondary` - Secondary text
- `text-text-tertiary` - Tertiary text

**Borders:**
- `border-border-default` - Default borders
- `border-border-strong` - Strong borders
- `border-border-subtle` - Subtle borders

## 🧪 Testing:

After restarting:

1. **Check Light Mode**: The app should look normal
2. **Toggle to Dark Mode**: Click the theme toggle button
3. **Verify**:
   - No white blocks in dark mode ✅
   - All text is readable ✅
   - Cards and modals have proper backgrounds ✅
   - Borders are visible ✅

## 🐛 If Issues Persist:

1. Check browser console for errors
2. Verify `data-theme` attribute on `<html>` element
3. Check if CSS file is loaded: Look for `tokens.css` in Network tab
4. Clear browser cache completely

## 📞 Need Help?

The Tailwind config now properly maps:
- `bg-bg-primary` → `var(--color-bg-primary)` → `#ffffff` (light) / `#111827` (dark)
- `text-text-primary` → `var(--color-text-primary)` → `#111827` (light) / `#f9fafb` (dark)

All CSS variables are defined in `packages/shared/src/design-system/tokens.css` and automatically switch based on the `[data-theme="dark"]` attribute.
