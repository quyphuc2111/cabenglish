# Theme System Debug Guide

## Các vấn đề đã được sửa

### 1. **Inconsistent Theme Colors** ✅
- **Vấn đề**: Màu sắc trong `ThemeSwitcher.tsx` không khớp với Tailwind config
- **Giải pháp**: Đã cập nhật màu sắc để khớp với định nghĩa trong `tailwind.config.ts`

### 2. **Missing Theme Indicator** ✅
- **Vấn đề**: ThemeSwitcher không hiển thị theme hiện tại
- **Giải pháp**: Thêm indicator màu sắc hiển thị theme đang active

### 3. **Cache Issues** ✅
- **Vấn đề**: Cache quá lâu (5 phút) gây delay khi update theme
- **Giải pháp**: 
  - Giảm staleTime từ 5 phút xuống 2 phút
  - Thêm optimistic update trong `useUpdateUserInfo`
  - Force invalidate và refetch sau khi update thành công

### 4. **BroadcastSync Disabled** ✅
- **Vấn đề**: Sync giữa các tab bị tắt mặc định
- **Giải pháp**: Tạo utility để enable/disable sync dễ dàng

### 5. **Performance Monitoring** ✅
- **Vấn đề**: Không có cách đo performance của theme switching
- **Giải pháp**: Thêm performance monitoring và logging

## Cách sử dụng

### Enable Theme Sync
```typescript
import { enableThemeSync } from '@/utils/theme-sync';
enableThemeSync(); // Enable sync across tabs
```

### Debug Theme Performance
```typescript
import { ThemeDebugger } from '@/components/debug/ThemeDebugger';

// Add to your layout (development only)
<ThemeDebugger userId={session?.user?.userId} />
```

### Monitor Performance
```typescript
import { themePerformanceMonitor } from '@/utils/theme-performance';

// View metrics
console.log(themePerformanceMonitor.getMetrics());

// Get average time for theme switches
console.log(themePerformanceMonitor.getAverageTime('Theme Switch'));
```

## Kiểm tra vấn đề

### 1. Theme không đổi ngay lập tức
- Kiểm tra console có lỗi không
- Kiểm tra network tab xem API call có thành công không
- Kiểm tra localStorage có `enableBroadcastSync: true` không

### 2. Theme không sync giữa các tab
```javascript
// Trong console browser
localStorage.setItem('enableBroadcastSync', 'true');
```

### 3. Performance chậm
- Mở ThemeDebugger component
- Kiểm tra console logs về performance
- Xem có warning nào về threshold exceeded không

## Cấu hình Performance

### Thresholds (có thể điều chỉnh)
```typescript
export const PERFORMANCE_THRESHOLDS = {
  THEME_SWITCH: 500, // ms - theme switch should be under 500ms
  CACHE_UPDATE: 100, // ms - cache update should be under 100ms
  UI_UPDATE: 200     // ms - UI update should be under 200ms
};
```

### Cache Settings
```typescript
// useUserInfo hook
staleTime: 2 * 60 * 1000, // 2 phút cache
refetchOnWindowFocus: false,
refetchOnMount: false,
refetchOnReconnect: true
```

## Troubleshooting

### Theme bị "lag" khi chuyển đổi
1. Kiểm tra optimistic update có hoạt động không
2. Kiểm tra animation có bị conflict không
3. Xem performance metrics

### Theme không persist sau refresh
1. Kiểm tra session update có thành công không
2. Kiểm tra database có được update không
3. Kiểm tra cache invalidation

### Console errors
- Kiểm tra userId có được truyền đúng không
- Kiểm tra session có valid không
- Kiểm tra API endpoints có hoạt động không

## Development Tools

### Enable Debug Mode
```javascript
// Trong console
localStorage.setItem('enablePerformanceStats', 'true');
localStorage.setItem('enableBroadcastSync', 'true');
```

### View Performance Summary
```javascript
// Trong console
import { themePerformanceMonitor } from '@/utils/theme-performance';
themePerformanceMonitor.logSummary();
```
