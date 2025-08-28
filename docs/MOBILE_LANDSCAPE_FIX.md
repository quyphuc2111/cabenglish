# Mobile Landscape Fix Report

## Vấn đề phát hiện
Mobile landscape mode (xoay ngang) có display issues, có thể liên quan đến:
1. Viewport height calculations
2. Media query conflicts
3. CSS specificity issues
4. Browser address bar behavior

## Fixes đã áp dụng

### 1. Fixed Media Query Conflicts
```css
/* Before: Conflicting ranges */
@media screen and (orientation: landscape) and (max-width: 1023px)

/* After: Specific mobile landscape only */
@media screen and (orientation: landscape) and (max-width: 767px)

/* Added: Separate tablet landscape */
@media screen and (orientation: landscape) and (min-width: 768px) and (max-width: 1023px)
```

### 2. Mobile Landscape Specific Optimizations
```css
/* Mobile Landscape (≤ 767px width) */
.lesson-tabs-container {
  height: calc(100vh - var(--safe-area-inset-top) - var(--safe-area-inset-bottom) - 2px) !important;
  min-height: 100vh !important;
}

.lesson-iframe-container {
  height: calc(100% - 72px) !important; /* Reduced for landscape */
}

.lesson-tab-list {
  min-height: 28px !important; /* Compact for landscape */
  padding: 2px !important;
}

.lesson-mobile-controls {
  min-height: 32px !important; /* Smaller for landscape */
  padding: 3px 8px !important;
}
```

### 3. Small Height Screens Fix
```css
/* Extra small height (landscape phones) */
@media screen and (max-height: 500px) {
  .lesson-iframe-container {
    height: calc(100% - 60px) !important;
  }
}

/* Mobile landscape height fix */
@media screen and (orientation: landscape) and (max-height: 600px) {
  .lesson-tabs-container {
    height: 100vh !important;
    height: calc(var(--vh, 1vh) * 100) !important;
    max-height: 100vh !important;
  }
}
```

### 4. iOS Safari Landscape Fix
```css
@supports (-webkit-touch-callout: none) {
  @media screen and (orientation: landscape) {
    .lesson-tabs-container {
      height: 100vh !important;
      height: -webkit-fill-available !important;
      min-height: -webkit-fill-available !important;
    }
    
    .lesson-iframe-container {
      height: calc(100% - 60px) !important;
      flex: 1 !important;
    }
  }
}
```

### 5. Android Chrome Landscape Fix
```css
@media screen and (max-width: 768px) {
  @media screen and (orientation: landscape) {
    .lesson-tabs-container {
      height: 100vh !important;
      height: calc(var(--vh, 1vh) * 100) !important;
      max-height: 100vh !important;
      min-height: 100vh !important;
    }
  }
}
```

### 6. Enhanced Viewport Hook
```typescript
// Added mobile landscape detection
if (window.innerWidth > window.innerHeight && window.innerWidth <= 896) {
  document.documentElement.style.setProperty("--mobile-landscape", "true");
  document.documentElement.style.setProperty("--vh-landscape", `${vh}px`);
}

// Enhanced orientation change handling
const handleOrientationChange = () => {
  setTimeout(() => {
    setVH();
    setTimeout(setVH, 100); // Double calculation for stability
  }, 500);
};
```

## Breakpoint Strategy Clarification

| Device Type | Width Range | Orientation | Media Query |
|-------------|-------------|-------------|-------------|
| **Mobile Portrait** | ≤ 767px | Portrait | `@media screen and (orientation: portrait) and (max-width: 767px)` |
| **Mobile Landscape** | ≤ 767px | Landscape | `@media screen and (orientation: landscape) and (max-width: 767px)` |
| **Tablet Portrait** | 768px - 1023px | Portrait | `@media screen and (orientation: portrait) and (min-width: 768px) and (max-width: 1023px)` |
| **Tablet Landscape** | 768px - 1023px | Landscape | `@media screen and (orientation: landscape) and (min-width: 768px) and (max-width: 1023px)` |
| **Desktop** | ≥ 1024px | Any | `@media screen and (min-width: 1024px)` |

## Expected Mobile Landscape Results

### ✅ iPhone (landscape)
- Compact tabs: 28px height
- Compact controls: 32px height  
- Maximized iframe area
- Proper viewport height handling

### ✅ Android phones (landscape)
- Address bar compensation
- Stable height calculations
- Responsive touch targets
- Smooth orientation transitions

### ✅ Tablet landscape
- Separate styling from mobile
- Larger touch targets (44px)
- Better typography
- Optimized spacing

## Browser-Specific Fixes

### iOS Safari
- Uses `-webkit-fill-available`
- Enhanced orientation change detection
- Viewport meta tag compensation

### Android Chrome
- Uses `calc(var(--vh, 1vh) * 100)`
- Address bar hide/show handling
- Stable height calculations

### Samsung Internet
- Fallback to standard viewport units
- Enhanced resize detection

## Debug Instructions

1. **Test on real devices** - Emulators không accurate cho landscape
2. **Check console** - Xem có viewport warnings không
3. **Monitor CSS specificity** - Đảm bảo mobile landscape CSS applies
4. **Test orientation changes** - Rotate nhiều lần để test stability

## Files Modified

1. **`/src/styles/lesson-optimize.css`**
   - Separated mobile landscape media queries
   - Added height-specific fixes
   - Enhanced browser-specific support

2. **`/src/hooks/useViewport.ts`**
   - Enhanced orientation change detection
   - Added mobile landscape variables
   - Improved timeout handling

## Testing Checklist

- [ ] iPhone 12/13 landscape rotation
- [ ] Samsung Galaxy landscape mode
- [ ] Pixel phones landscape behavior
- [ ] iPad landscape (should use tablet styles)
- [ ] Orientation change stability
- [ ] Address bar hide/show compensation

**Expected outcome**: Smooth, stable landscape experience với maximized iframe area! 📱🔄
