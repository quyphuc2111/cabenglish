# Test Pagination State Persistence

## Các thay đổi đã thực hiện:

### 1. Cải thiện `usePagination` hook:
- Thêm logic để handle external `initialPage` changes
- Sử dụng `useRef` để track previous `initialPage` value
- Thêm debug logging để theo dõi state changes

### 2. Cải thiện `PaginatedContent` component:
- Loại bỏ logic duplicate để handle `initialPage` changes
- Đơn giản hóa logic để tránh conflicts

### 3. Cải thiện `classroom-child-client.tsx`:
- Thêm logic restore pagination state ngay từ khi component mount
- Sử dụng `paginationKey` để force re-render khi cần thiết
- Thêm debug logging để theo dõi restore process
- Đảm bảo `pageState` và `itemsPerPageState` được include trong dependency array của `handleLessonClick`

## Cách test:

1. Vào trang lop-hoc/[slug]
2. Chuyển sang page 2 (hoặc page khác)
3. Click vào một bài học để chuyển sang lesson/[lessonId]
4. Click back button để quay lại
5. Kiểm tra xem có ở đúng page 2 không

## Debug logs để theo dõi:

- `🔄 Restoring classroom state:` - Khi restore state từ navigation store
- `✅ Restored pagination state:` - Khi đã restore xong pagination state
- `📄 usePagination: First render` - Khi usePagination hook render lần đầu
- `📄 usePagination: External page change` - Khi initialPage thay đổi từ bên ngoài

## Các vấn đề đã fix:

1. **State không được lưu đúng**: Đã thêm `pageState` và `itemsPerPageState` vào dependency array
2. **State không được restore đúng**: Đã thêm logic restore ngay từ khi component mount
3. **PaginatedContent không sync với external state**: Đã cải thiện `usePagination` hook
4. **Race condition**: Sử dụng `paginationKey` để force re-render khi cần thiết
