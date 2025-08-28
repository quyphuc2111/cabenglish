# Performance Optimizations - Trang Tổng Quan

## 🎯 Mục tiêu
Giảm CPU usage từ 20-30% xuống mức tối ưu (<10%) trên trang tổng quan.

## 🔍 Nguyên nhân chính đã xác định

### 1. **React Query Hooks - Aggressive Refetching**
- `useUserInfo`: Polling mỗi 60 giây + refetch on focus/mount
- `useLessonData`: staleTime = 30s, refetch on focus/mount/reconnect
- `useLessonData` (client): staleTime = 0, refetch on focus/mount/reconnect

### 2. **Multiple Hook Instances**
- Nhiều component sử dụng cùng hooks → duplicate API calls
- Không có proper memoization → re-computation không cần thiết

### 3. **Complex Data Processing**
- `CurrentAndNextLecture`: Complex grouping/sorting logic
- `LectureFavouriteList`: Heavy filtering operations
- `TeachingProgress`: Animation + pagination logic

## ✅ Optimizations Đã Thực Hiện

### 1. **React Query Optimizations**

#### `useUserInfo` Hook
```typescript
// BEFORE
staleTime: 0,
refetchOnWindowFocus: true,
refetchOnMount: true,
refetchInterval: 60 * 1000  // ❌ Polling mỗi 60s

// AFTER  
staleTime: 5 * 60 * 1000,   // ✅ Cache 5 phút
refetchOnWindowFocus: false, // ✅ Tắt refetch on focus
refetchOnMount: false,       // ✅ Sử dụng cache
// refetchInterval: removed   // ✅ Tắt polling
```

#### `useLessonData` Hook
```typescript
// BEFORE
staleTime: 30 * 1000,        // ❌ Cache 30 giây
refetchOnWindowFocus: true,
refetchOnMount: true,

// AFTER
staleTime: 3 * 60 * 1000,    // ✅ Cache 3 phút
refetchOnWindowFocus: false, // ✅ Tắt refetch on focus
refetchOnMount: false,       // ✅ Sử dụng cache
```

#### `useLessonData` (Client) Hook
```typescript
// BEFORE
staleTime: 0,                // ❌ Không cache
refetchOnWindowFocus: true,
refetchOnMount: true,

// AFTER
staleTime: 2 * 60 * 1000,    // ✅ Cache 2 phút
refetchOnWindowFocus: false, // ✅ Tắt refetch on focus
refetchOnMount: false,       // ✅ Sử dụng cache
```

### 2. **Component Memoization**

#### React.memo Implementation
```typescript
// Components được memoize:
- CurrentAndNextLecture
- LectureFavouriteList  
- OverviewPage
- TeachingProgress
- ProgressStats
```

#### Data Processing Optimization
```typescript
// LectureFavouriteList
const filteredLessonData = useMemo(() => {
  // Heavy filtering logic
}, [courseData, filterValues, removingLessons]);
```

### 3. **Dashboard Data Hook Optimization**

#### Duplicate Call Prevention
```typescript
// useDashboardData
const lastFetchRef = useRef<{ userId: string; mode: string } | null>(null);

// Kiểm tra trước khi fetch
if (lastFetchRef.current && 
    lastFetchRef.current.userId === currentFetch.userId && 
    lastFetchRef.current.mode === currentFetch.mode) {
  setIsLoading(false);
  return; // ✅ Tránh duplicate calls
}
```

### 4. **Performance Utilities**

#### New Utilities Created
- `src/hooks/useDebounce.ts`: Debouncing hooks
- `src/utils/performance.ts`: Performance utilities
  - throttle, debounce functions
  - memoization helpers
  - shallow comparison
  - batch updates
  - performance monitoring

## 📊 Kết quả mong đợi

### CPU Usage Reduction
- **Trước**: 20-30% CPU usage
- **Sau**: <10% CPU usage (giảm 60-70%)

### API Calls Reduction
- **useUserInfo**: Từ mỗi 60s → chỉ khi cần thiết
- **Lesson Data**: Từ mỗi 30s → mỗi 2-3 phút
- **Dashboard Data**: Tránh duplicate calls

### Memory Usage
- Giảm re-renders không cần thiết
- Better garbage collection với longer cache times
- Memoized computations

## 🔧 Monitoring & Testing

### Development Monitoring
```typescript
// Sử dụng performance utilities
measurePerformance('DataProcessing', () => {
  // Heavy computation
});
```

### React DevTools
- Kiểm tra re-renders với Profiler
- Monitor component update frequency
- Verify memoization effectiveness

## 🚀 Next Steps

### Additional Optimizations
1. **Virtual Scrolling**: Cho danh sách dài
2. **Image Optimization**: Lazy loading + WebP format
3. **Bundle Splitting**: Code splitting cho components lớn
4. **Service Worker**: Cache API responses
5. **Web Workers**: Heavy computations

### Monitoring Setup
1. **Performance Metrics**: Core Web Vitals
2. **Error Tracking**: Sentry integration
3. **User Experience**: Real User Monitoring

## 📝 Best Practices Established

### React Query
- Sử dụng appropriate staleTime (2-5 phút cho user data)
- Tắt aggressive refetching
- Implement proper error boundaries

### Component Design
- Memoize expensive components
- Use useMemo for heavy computations
- Implement proper dependency arrays

### Data Flow
- Minimize prop drilling
- Use context wisely
- Implement proper loading states

## ⚠️ Cảnh báo

### Cache Invalidation
- Manual refetch khi cần data mới nhất
- Proper invalidation on user actions
- Balance between performance và data freshness

### Memory Leaks
- Cleanup subscriptions
- Clear timeouts/intervals
- Proper useEffect cleanup

### User Experience
- Maintain responsive UI
- Proper loading indicators
- Error handling
