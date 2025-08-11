"use client";

import React, { useState } from "react";
import { CourseCarousel } from "../carousel/course-carousel";

// Function to generate mock data
const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    lessonId: i + 1,
    title: `Bài học ${i + 1}`,
    description: `Mô tả bài học ${i + 1}`,
    className: `Lớp ${Math.floor(i / 2) + 1}${String.fromCharCode(
      65 + (i % 2)
    )}`,
    likeCount: Math.floor(Math.random() * 50) + 5,
    isLiked: Math.random() > 0.5,
    thumbnailUrl: "/placeholder-image.jpg"
  }));
};

// Mock data for testing - small set
const mockCourseData = [
  {
    lessonId: 1,
    title: "Bài học 1",
    description: "Mô tả bài học 1",
    className: "Lớp 1A",
    likeCount: 10,
    isLiked: false,
    thumbnailUrl: "/placeholder-image.jpg"
  },
  {
    lessonId: 2,
    title: "Bài học 2",
    description: "Mô tả bài học 2",
    className: "Lớp 1B",
    likeCount: 15,
    isLiked: true,
    thumbnailUrl: "/placeholder-image.jpg"
  },
  {
    lessonId: 3,
    title: "Bài học 3",
    description: "Mô tả bài học 3",
    className: "Lớp 2A",
    likeCount: 8,
    isLiked: false,
    thumbnailUrl: "/placeholder-image.jpg"
  },
  {
    lessonId: 4,
    title: "Bài học 4",
    description: "Mô tả bài học 4",
    className: "Lớp 2B",
    likeCount: 12,
    isLiked: true,
    thumbnailUrl: "/placeholder-image.jpg"
  },
  {
    lessonId: 5,
    title: "Bài học 5",
    description: "Mô tả bài học 5",
    className: "Lớp 3A",
    likeCount: 20,
    isLiked: false,
    thumbnailUrl: "/placeholder-image.jpg"
  },
  {
    lessonId: 6,
    title: "Bài học 6",
    description: "Mô tả bài học 6",
    className: "Lớp 3B",
    likeCount: 18,
    isLiked: true,
    thumbnailUrl: "/placeholder-image.jpg"
  },
  {
    lessonId: 7,
    title: "Bài học 7",
    description: "Mô tả bài học 7",
    className: "Lớp 4A",
    likeCount: 25,
    isLiked: false,
    thumbnailUrl: "/placeholder-image.jpg"
  },
  {
    lessonId: 8,
    title: "Bài học 8",
    description: "Mô tả bài học 8",
    className: "Lớp 4B",
    likeCount: 22,
    isLiked: true,
    thumbnailUrl: "/placeholder-image.jpg"
  },
  {
    lessonId: 9,
    title: "Bài học 9",
    description: "Mô tả bài học 9",
    className: "Lớp 5A",
    likeCount: 30,
    isLiked: false,
    thumbnailUrl: "/placeholder-image.jpg"
  },
  {
    lessonId: 10,
    title: "Bài học 10",
    description: "Mô tả bài học 10",
    className: "Lớp 5B",
    likeCount: 28,
    isLiked: true,
    thumbnailUrl: "/placeholder-image.jpg"
  },
  {
    lessonId: 11,
    title: "Bài học 11",
    description: "Mô tả bài học 11",
    className: "Lớp 6A",
    likeCount: 35,
    isLiked: false,
    thumbnailUrl: "/placeholder-image.jpg"
  },
  {
    lessonId: 12,
    title: "Bài học 12",
    description: "Mô tả bài học 12",
    className: "Lớp 6B",
    likeCount: 32,
    isLiked: true,
    thumbnailUrl: "/placeholder-image.jpg"
  }
];

export function CarouselDotsTest() {
  const [removingLessons, setRemovingLessons] = useState<Set<number>>(
    new Set()
  );
  const [showLoading, setShowLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [useVirtualData, setUseVirtualData] = useState(false);

  // Generate large dataset for virtual scrolling test
  const largeDataset = generateMockData(60); // Above VIRTUAL_THRESHOLD = 50
  const currentDataset = useVirtualData ? largeDataset : mockCourseData;

  const handleToggleLoading = () => {
    if (showLoading) {
      setRemovingLessons(new Set());
      setShowLoading(false);
    } else {
      setRemovingLessons(new Set([1, 2, 3]));
      setShowLoading(true);
    }
  };

  const handleLikeUpdate = (lessonId: number, newLikeCount: number) => {
    console.log(`Lesson ${lessonId} updated with ${newLikeCount} likes`);
  };

  const handleLessonClick = (lessonId: number) => {
    console.log(`Clicked lesson ${lessonId}`);
  };

  const handleSlideChange = (activeIndex: number) => {
    setDebugInfo({
      activeIndex,
      timestamp: new Date().toLocaleTimeString(),
      datasetSize: currentDataset.length,
      isVirtualMode: useVirtualData
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Carousel Dots Test
          </h1>
          <p className="text-gray-600 mb-6">
            Test responsive behavior của progress dots và navigation dots
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={handleToggleLoading}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              {showLoading ? "Ẩn Loading State" : "Hiển thị Loading State"}
            </button>

            <button
              onClick={() => setUseVirtualData(!useVirtualData)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {useVirtualData
                ? `Small Dataset (${mockCourseData.length})`
                : `Large Dataset (${largeDataset.length})`}
            </button>
          </div>

          <div className="mt-2 text-sm text-gray-600 text-center">
            Current: {useVirtualData ? "Virtual Scrolling Mode" : "Normal Mode"}{" "}
            - {currentDataset.length} items
          </div>

          {/* Debug Info */}
          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
              <strong>Debug Info:</strong> Active Index: {debugInfo.activeIndex}
              , Dataset: {debugInfo.datasetSize} items (
              {debugInfo.isVirtualMode ? "Virtual" : "Normal"}), Time:{" "}
              {debugInfo.timestamp}
            </div>
          )}
        </div>

        {/* Test Current Container Type */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Current Container Type (Smaller Width)
          </h2>
          <div className="lg:w-4/12 mx-auto">
            <CourseCarousel
              courseData={currentDataset}
              containerType="current"
              removingLessons={showLoading ? removingLessons : undefined}
              onLikeUpdate={handleLikeUpdate}
              onLessonClick={handleLessonClick}
              onSlideChange={handleSlideChange}
            />
          </div>
        </div>

        {/* Test Next Container Type */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Next Container Type (Larger Width)
          </h2>
          <div className="lg:w-8/12 mx-auto">
            <CourseCarousel
              courseData={currentDataset}
              containerType="next"
              removingLessons={showLoading ? removingLessons : undefined}
              onLikeUpdate={handleLikeUpdate}
              onLessonClick={handleLessonClick}
              onSlideChange={handleSlideChange}
            />
          </div>
        </div>

        {/* Test Full Width */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Full Width Container</h2>
          <CourseCarousel
            courseData={currentDataset}
            containerType="next"
            removingLessons={showLoading ? removingLessons : undefined}
            onLikeUpdate={handleLikeUpdate}
            onLessonClick={handleLessonClick}
            onSlideChange={handleSlideChange}
          />
        </div>

        {/* Responsive Test Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Hướng dẫn Test Responsive
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>
              <strong>Extra Small (≤480px):</strong> Progress dots nhỏ hơn, ít
              dots hơn
            </p>
            <p>
              <strong>Mobile (≤640px):</strong> Hiển thị mobile pagination, ẩn
              desktop navigation
            </p>
            <p>
              <strong>Tablet (≤768px):</strong> Dots trung bình, navigation
              buttons nhỏ hơn
            </p>
            <p>
              <strong>Desktop ({">"}768px):</strong> Full size dots và
              navigation buttons
            </p>
          </div>
        </div>

        {/* Breakpoint Indicator */}
        <div className="fixed top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm z-50">
          <span className="block sm:hidden">Extra Small (≤480px)</span>
          <span className="hidden sm:block md:hidden">Mobile (481-640px)</span>
          <span className="hidden md:block lg:hidden">
            Small Tablet (641-768px)
          </span>
          <span className="hidden lg:block xl:hidden">Tablet (769-1024px)</span>
          <span className="hidden xl:block 2xl:hidden">
            Desktop (1025-1536px)
          </span>
          <span className="hidden 2xl:block">Large Desktop ({">"}1536px)</span>
        </div>
      </div>
    </div>
  );
}

export default CarouselDotsTest;
