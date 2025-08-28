# Lesson Card Resize Changes

## Mục tiêu
Giảm kích thước lessoncard trong LessonPendingClient, LessonTeachingClient, LessonCompleteClient trên desktop và tablet (width > 1024px) để không quá to.

## Các thay đổi đã thực hiện

### 1. LessonPendingClient (src/app/(smk)/tien-trinh-giang-day/bai-giang-chua-day/lesson-pending-client.tsx)

**Trước:**
```tsx
<div className="lesson-card-size w-full h-full max-w-[360px] md:max-w-[420px] xl:max-w-[460px] min-h-[220px] md:min-h-[240px] xl:min-h-[260px] mx-auto">
```

**Sau:**
```tsx
<div className="lesson-card-size w-full h-full max-w-[360px] md:max-w-[380px] lg:max-w-[320px] xl:max-w-[340px] min-h-[220px] md:min-h-[240px] lg:min-h-[200px] xl:min-h-[220px] mx-auto">
```

### 2. LessonCompleteClient (src/app/(smk)/tien-trinh-giang-day/bai-giang-hoan-thanh/lesson-complete-client.tsx)

**Trước:**
```tsx
<div className="lesson-card-size w-full h-full max-w-[360px] md:max-w-[420px] xl:max-w-[460px] min-h-[220px] md:min-h-[240px] xl:min-h-[260px] mx-auto">
```

**Sau:**
```tsx
<div className="lesson-card-size w-full h-full max-w-[360px] md:max-w-[380px] lg:max-w-[320px] xl:max-w-[340px] min-h-[220px] md:min-h-[240px] lg:min-h-[200px] xl:min-h-[220px] mx-auto">
```

### 3. CourseCarousel (src/components/carousel/course-carousel.tsx)

**Trước:**
```tsx
// Adjust for container type on desktop
if (containerType === "current") {
  if (isLargeScreen) return "50%";
  return "66%";
} else {
  if (isLargeScreen) return "33%";
  return "40%";
}
```

**Sau:**
```tsx
// Adjust for container type on desktop - make cards smaller
if (containerType === "current") {
  if (isLargeScreen) return "33%"; // Changed from 50% to 33%
  return "50%"; // Changed from 66% to 50%
} else {
  if (isLargeScreen) return "25%"; // Changed from 33% to 25%
  return "33%"; // Changed from 40% to 33%
}
```

### 4. CourseCarouselV2 (src/components/carousel/course-carousel-v2.tsx)

Tương tự như CourseCarousel, giảm slidesPerView để hiển thị nhiều card hơn trên desktop.

### 5. LessonCard CSS (src/components/lesson/lesson-card.tsx)

**Thêm CSS responsive:**
```css
/* Giới hạn kích thước trên desktop và tablet lớn */
@media (min-width: 1024px) {
  .lesson-card {
    max-width: 320px !important;
  }
}

@media (min-width: 1280px) {
  .lesson-card {
    max-width: 340px !important;
  }
}

@media (min-width: 1536px) {
  .lesson-card {
    max-width: 360px !important;
  }
}
```

## Kết quả mong đợi

### Trên Desktop (width > 1024px):
- **LessonPendingClient & LessonCompleteClient**: Card nhỏ hơn với max-width 320px-340px thay vì 420px-460px
- **LessonTeachingClient**: Hiển thị nhiều card hơn trong carousel (3-4 cards thay vì 1-2 cards)
- **ClassroomChildClient**: Card được giới hạn kích thước bởi CSS mới

### Trên Tablet (768px - 1024px):
- Card có kích thước vừa phải, không quá to
- Grid layout vẫn responsive tốt

### Trên Mobile:
- Không thay đổi, vẫn giữ kích thước phù hợp như trước

## Cách test
1. Mở các trang: Bài giảng chưa dạy, Bài giảng đang dạy, Bài giảng hoàn thành
2. Kiểm tra trên các kích thước màn hình khác nhau
3. Đảm bảo lessoncard không quá to trên desktop và tablet
4. Kiểm tra responsive layout vẫn hoạt động tốt
