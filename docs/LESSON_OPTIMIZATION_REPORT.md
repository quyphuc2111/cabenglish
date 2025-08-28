# Lesson Interface Optimization

## Tổng quan
Đã tối ưu hóa giao diện trang lesson/[lessonId] để tối đa hóa không gian hiển thị nội dung iframe trên tất cả các thiết bị.

## Các tối ưu hóa đã thực hiện

### 1. Mobile Portrait (Điện thoại dọc)
- **Giảm padding/margin**: Từ p-4 xuống p-0.5
- **Thu nhỏ TabsList**: Từ min-h-48px xuống min-h-32px
- **Thu nhỏ control buttons**: Từ py-2 xuống py-0.5
- **Ẩn description text**: Chỉ hiện nút fullscreen
- **Font size nhỏ hơn**: text-xs → text-[10px]
- **Icon size nhỏ hơn**: w-5 h-5 → w-4 h-4

### 2. Mobile Landscape (Điện thoại ngang)
- **Tối ưu height**: Sử dụng 96% viewport height
- **Tab list compact**: min-h-40px
- **Responsive spacing**: landscape:p-1, landscape:gap-1
- **Hiện minimal description**: Chỉ 1 dòng với ellipsis

### 3. Tablet & Desktop
- **Spacing tăng dần**: sm:p-2, md:p-4, lg:p-6
- **Font size phù hợp**: sm:text-sm, md:text-base
- **Icon size lớn hơn**: sm:w-8 sm:h-8, md:w-10 md:h-10

### 4. Viewport Height Handling
- **Custom hook useViewportHeight**: Xử lý thanh địa chỉ mobile
- **CSS variables**: --vh cho height calculations
- **Safe area insets**: Hỗ trợ notch và punch-hole cameras

## Files đã thay đổi

### 1. `/src/components/lesson/tabs-container.tsx`
- Giảm padding/margin cho mobile
- Thêm responsive classes với `landscape:` prefix
- Tối ưu hóa TabsList và control buttons
- Sử dụng OptimizedIframe component
- Thêm CSS classes cho styling

### 2. `/src/app/lesson/[lessonId]/lesson-client.tsx`
- Điều chỉnh main content container
- Tối ưu header spacing
- Responsive width: 98% mobile → 85% desktop

### 3. `/src/components/lesson/optimized-iframe.tsx` (Mới)
- Component iframe tối ưu với loading state
- Sandbox permissions đầy đủ
- Style responsive cho orientation

### 4. `/src/hooks/useViewport.ts` (Mới)
- Custom hook xử lý viewport height
- Fix mobile browser address bar issues
- Device info detection

### 5. `/src/styles/lesson-optimize.css` (Mới)
- CSS tối ưu cho mobile/tablet/desktop
- Safe area inset support
- Orientation-specific optimizations
- Accessibility và performance improvements

### 6. `/src/app/layout.tsx`
- Import lesson-optimize.css

## Kích thước tối ưu theo thiết bị

| Device | Container Width | Container Height | Iframe Area |
|--------|----------------|------------------|-------------|
| Mobile Portrait | 98% | 92vh | ~85% |
| Mobile Landscape | 96% | 90vh | ~88% |
| Tablet Portrait | 90% | 85vh | ~80% |
| Tablet Landscape | 90% | 85vh | ~82% |
| Desktop | 85% | 90vh | ~75% |

## CSS Classes được thêm

- `.lesson-container`: Container chính
- `.lesson-tabs-container`: Tabs wrapper
- `.lesson-tab-list`: Tab navigation
- `.lesson-tab-trigger`: Individual tabs
- `.lesson-mobile-controls`: Mobile control buttons
- `.lesson-iframe-container`: Iframe wrapper
- `.lesson-fullscreen`: Fullscreen mode

## Responsive Breakpoints

```css
/* Mobile Portrait */
@media screen and (orientation: portrait) and (max-width: 767px)

/* Mobile Landscape */  
@media screen and (orientation: landscape) and (max-width: 1023px)

/* Tablet Portrait */
@media screen and (orientation: portrait) and (min-width: 768px) and (max-width: 1023px)

/* Desktop */
@media screen and (min-width: 1024px)
```

## Performance Improvements

1. **Lazy loading**: iframe với loading="lazy"
2. **Debounced resize**: Giảm tần suất update viewport
3. **CSS-only animations**: Ưu tiên CSS thay vì JS
4. **Reduced DOM updates**: Batch style changes
5. **Memory cleanup**: Proper event listener removal

## Browser Support

- ✅ Chrome/Edge (Android/Windows)
- ✅ Safari (iOS/macOS) 
- ✅ Firefox (Android/Windows)
- ✅ Samsung Internet
- ✅ WebView (in-app browsers)

## Accessibility Features

- High contrast mode support
- Reduced motion respect
- Screen reader friendly
- Keyboard navigation
- Focus management

## Testing Recommendations

1. **Mobile Portrait**: iPhone SE, Galaxy S20
2. **Mobile Landscape**: iPhone 12 Pro landscape
3. **Tablet**: iPad, Galaxy Tab
4. **Desktop**: 1920x1080, 2560x1440
5. **Edge cases**: Very small screens, ultra-wide displays
