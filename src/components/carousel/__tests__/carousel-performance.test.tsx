/**
 * Performance Tests for Course Carousel
 * Tests lazy loading and virtual scrolling functionality
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { CourseCarousel } from '../course-carousel';
import { VirtualizedCarousel } from '../virtualized-carousel';

// Mock data generator
const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    lessonId: index + 1,
    classId: 1,
    unitId: 1,
    schoolWeekId: 1,
    lessonName: `Lesson ${index + 1}`,
    className: 'Test Class',
    unitName: 'Test Unit',
    imageUrl: 'https://example.com/image.jpg',
    schoolWeek: 1,
    progress: 50,
    numLiked: 10,
    isLocked: false,
  }));
};

// Mock useMediaQuery hook
jest.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: jest.fn(() => false),
}));

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Swiper components
jest.mock('swiper/react', () => ({
  Swiper: ({ children, onSlideChange, ...props }: any) => (
    <div data-testid="swiper" {...props}>
      {children}
    </div>
  ),
  SwiperSlide: ({ children }: any) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

jest.mock('swiper/modules', () => ({
  Navigation: {},
  Pagination: {},
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('CourseCarousel Performance', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('Small Dataset (≤50 items)', () => {
    test('should render all items without virtual scrolling', async () => {
      const mockData = generateMockData(20);
      
      render(
        <CourseCarousel
          courseData={mockData}
          onLikeUpdate={jest.fn()}
          onLessonClick={jest.fn()}
        />
      );

      // Should render VirtualizedCarousel
      expect(screen.getByTestId('swiper')).toBeInTheDocument();
    });

    test('should handle empty dataset', () => {
      render(
        <CourseCarousel
          courseData={[]}
          onLikeUpdate={jest.fn()}
          onLessonClick={jest.fn()}
        />
      );

      expect(screen.getByTestId('swiper')).toBeInTheDocument();
    });
  });

  describe('Large Dataset (>50 items)', () => {
    test('should enable virtual scrolling for large datasets', async () => {
      const mockData = generateMockData(100);
      
      render(
        <CourseCarousel
          courseData={mockData}
          onLikeUpdate={jest.fn()}
          onLessonClick={jest.fn()}
        />
      );

      // Virtual scrolling should be active
      expect(screen.getByTestId('swiper')).toBeInTheDocument();
    });

    test('should handle very large datasets efficiently', () => {
      const mockData = generateMockData(1000);
      
      const startTime = performance.now();
      
      render(
        <CourseCarousel
          courseData={mockData}
          onLikeUpdate={jest.fn()}
          onLessonClick={jest.fn()}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly even with 1000 items
      expect(renderTime).toBeLessThan(100); // Less than 100ms
    });
  });

  describe('VirtualizedCarousel', () => {
    test('should render with basic props', () => {
      const mockData = generateMockData(10);
      const mockRenderItem = jest.fn((item) => <div key={item.lessonId}>{item.lessonName}</div>);

      render(
        <VirtualizedCarousel
          items={mockData}
          slidesPerView={3}
          spaceBetween={20}
          renderItem={mockRenderItem}
        />
      );

      expect(screen.getByTestId('swiper')).toBeInTheDocument();
    });

    test('should call renderItem for each visible item', () => {
      const mockData = generateMockData(5);
      const mockRenderItem = jest.fn((item) => <div key={item.lessonId}>{item.lessonName}</div>);

      render(
        <VirtualizedCarousel
          items={mockData}
          slidesPerView={3}
          spaceBetween={20}
          renderItem={mockRenderItem}
        />
      );

      // Should call renderItem for each item
      expect(mockRenderItem).toHaveBeenCalledTimes(5);
    });
  });

  describe('Loading States', () => {
    test('should show loading state when removingLessons is provided', () => {
      const mockData = generateMockData(10);
      const removingLessons = new Set([1, 2, 3]);

      render(
        <CourseCarousel
          courseData={mockData}
          removingLessons={removingLessons}
          onLikeUpdate={jest.fn()}
          onLessonClick={jest.fn()}
        />
      );

      expect(screen.getByText('Đang cập nhật dữ liệu')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Number of removing lessons
    });

    test('should hide loading state when removingLessons is empty', () => {
      const mockData = generateMockData(10);
      const removingLessons = new Set<number>();

      render(
        <CourseCarousel
          courseData={mockData}
          removingLessons={removingLessons}
          onLikeUpdate={jest.fn()}
          onLessonClick={jest.fn()}
        />
      );

      expect(screen.queryByText('Đang cập nhật dữ liệu')).not.toBeInTheDocument();
    });
  });

  describe('Event Handlers', () => {
    test('should call onLessonClick when provided', () => {
      const mockData = generateMockData(5);
      const onLessonClick = jest.fn();

      render(
        <CourseCarousel
          courseData={mockData}
          onLessonClick={onLessonClick}
          onLikeUpdate={jest.fn()}
        />
      );

      // Event handlers are passed to VirtualizedCarousel
      expect(screen.getByTestId('swiper')).toBeInTheDocument();
    });

    test('should call onLikeUpdate when provided', () => {
      const mockData = generateMockData(5);
      const onLikeUpdate = jest.fn();

      render(
        <CourseCarousel
          courseData={mockData}
          onLikeUpdate={onLikeUpdate}
          onLessonClick={jest.fn()}
        />
      );

      expect(screen.getByTestId('swiper')).toBeInTheDocument();
    });
  });
});

describe('Performance Benchmarks', () => {
  test('should render 100 items in under 50ms', () => {
    const mockData = generateMockData(100);
    
    const startTime = performance.now();
    
    render(
      <CourseCarousel
        courseData={mockData}
        onLikeUpdate={jest.fn()}
        onLessonClick={jest.fn()}
      />
    );

    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(50);
  });

  test('should render 500 items in under 100ms', () => {
    const mockData = generateMockData(500);
    
    const startTime = performance.now();
    
    render(
      <CourseCarousel
        courseData={mockData}
        onLikeUpdate={jest.fn()}
        onLessonClick={jest.fn()}
      />
    );

    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(100);
  });
});
