"use client";

import React, { useState } from "react";
import { CourseCarousel } from "@/components/carousel/course-carousel";

// Mock data
const mockData = [
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
  }
];

export default function TestCarouselV2Page() {
  const [removingLessons, setRemovingLessons] = useState<Set<number>>(
    new Set()
  );
  const [showLoading, setShowLoading] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Carousel V1 vs V2 Comparison
          </h1>
          <p className="text-gray-600 mb-6">
            Compare the old CourseCarousel with the new shadcn-based version
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={handleToggleLoading}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              {showLoading ? "Hide Loading State" : "Show Loading State"}
            </button>

            <button
              onClick={() => setShowArrows(!showArrows)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showArrows ? "Hide Arrows" : "Show Arrows"}
            </button>
          </div>
        </div>

        {/* Version 1 - Original */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Version 1 - Original (Swiper-based)
          </h2>
        </div>

        {/* Version 2 - New */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-600">
            Version 2 - New (Shadcn Carousel)
          </h2>
          <div className="min-h-[300px]">
            <CourseCarousel
              courseData={mockData}
              containerType="next"
              removingLessons={showLoading ? removingLessons : undefined}
              onLikeUpdate={handleLikeUpdate}
              onLessonClick={handleLessonClick}
              showArrows={showArrows}
            />
          </div>
        </div>

        {/* Current Container Type Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">
              V1 - Current Container
            </h3>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-green-600">
              V2 - Current Container
            </h3>
            <div className="lg:w-4/12 mx-auto">
              <CourseCarousel
                courseData={mockData}
                containerType="current"
                onLikeUpdate={handleLikeUpdate}
                onLessonClick={handleLessonClick}
                showArrows={showArrows}
              />
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Features Comparison
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">
                Version 1 (Swiper)
              </h4>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>✅ Virtual scrolling for large datasets</li>
                <li>✅ Complex responsive logic</li>
                <li>✅ Mobile pagination</li>
                <li>✅ Custom navigation dots</li>
                <li>❌ Heavy bundle size</li>
                <li>❌ Complex configuration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">
                Version 2 (Shadcn)
              </h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>✅ Lightweight (Embla-based)</li>
                <li>✅ Better accessibility</li>
                <li>✅ Simpler configuration</li>
                <li>✅ Consistent with design system</li>
                <li>✅ Better TypeScript support</li>
                <li>⚠️ No virtual scrolling (yet)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Responsive Test Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            Test Instructions
          </h3>
          <div className="text-yellow-800 space-y-2">
            <p>
              <strong>Desktop:</strong> Both should show navigation arrows and
              dots
            </p>
            <p>
              <strong>Mobile:</strong> Both should show dots pagination
            </p>
            <p>
              <strong>Loading State:</strong> Click button to test loading
              animation
            </p>
            <p>
              <strong>Responsive:</strong> Resize browser to test different
              breakpoints
            </p>
          </div>
        </div>

        {/* Breakpoint Indicator */}
        <div className="fixed top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm z-50">
          <span className="block sm:hidden">Mobile (≤640px)</span>
          <span className="hidden sm:block md:hidden">Tablet (641-768px)</span>
          <span className="hidden md:block lg:hidden">
            Small Desktop (769-1024px)
          </span>
          <span className="hidden lg:block xl:hidden">
            Desktop (1025-1536px)
          </span>
          <span className="hidden xl:block">Large Desktop ({">"}1536px)</span>
        </div>
      </div>
    </div>
  );
}
