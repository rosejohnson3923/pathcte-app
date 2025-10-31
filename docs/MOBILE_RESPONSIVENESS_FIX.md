# Mobile Responsiveness Fix for PathCTE

**Issue:** Desktop layouts rendering on mobile devices (iPhone 12 Pro 390x844)
**Priority:** CRITICAL - Must fix before adding new features

## Problems Identified

### 1. Landing Page (HomePage.tsx)
- No hamburger menu on mobile
- Login/Sign Up buttons cramped
- Logo text too large
- No responsive header

### 2. Header Component
- All nav links horizontal (4 links + XP + theme + user menu)
- Overflow on 390px screens
- No mobile menu

### 3. Sidebar Component
- Fixed width (w-64) always visible
- No mobile drawer
- Blocks content on mobile

### 4. Overall
- No mobile-first breakpoint strategy
- Desktop-centric layouts

## Solution Strategy

### Mobile-First Breakpoints (Tailwind)
```
sm:  640px   (small phones landscape, tablets portrait)
md:  768px   (tablets landscape, small desktops)
lg:  1024px  (desktops)
xl:  1280px  (large desktops)
2xl: 1536px  (extra large)
```

### Changes Needed

1. **Add Hamburger Menu Component** (new)
2. **Fix HomePage Header** (mobile menu)
3. **Fix Header Component** (responsive nav)
4. **Fix Sidebar Component** (mobile drawer)
5. **Typography Scale** (responsive text sizes)

## Implementation

### 1. Create Mobile Menu Component

New file: `packages/web/src/components/common/MobileMenu.tsx`

Features:
- Hamburger icon button
- Slide-in overlay menu
- Touch-friendly buttons
- Smooth animations

### 2. Update HomePage

Changes:
- Add hamburger menu for mobile
- Stack buttons vertically on small screens
- Reduce logo size on mobile
- Responsive padding/spacing

### 3. Update Header Component

Changes:
- Hide nav links on mobile (< md)
- Show hamburger menu on mobile
- Responsive XP badge
- Collapsible user menu

### 4. Update Sidebar Component

Changes:
- Hide on mobile by default
- Show as overlay drawer when toggled
- Backdrop click to close
- Swipe gestures (future)

### 5. Typography Responsive Scale

Before:
```tsx
<h1 className="text-5xl md:text-7xl">
```

After:
```tsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl">
```

## Testing Checklist

- [ ] iPhone 12 Pro (390x844) - Portrait
- [ ] iPhone 12 Pro - Landscape
- [ ] iPad (768x1024) - Portrait
- [ ] iPad - Landscape
- [ ] Android phone (360x740)
- [ ] Desktop (1920x1080)

## Performance Considerations

- Lazy load mobile menu (React.lazy)
- Use CSS transforms for animations (GPU accelerated)
- Avoid layout shifts (reserve space for hamburger)
- Touch targets minimum 44x44px

## Accessibility

- Hamburger button: aria-label, aria-expanded
- Mobile menu: aria-modal, role="dialog"
- Focus trap when menu open
- Keyboard navigation (Escape to close)
- Screen reader announcements
