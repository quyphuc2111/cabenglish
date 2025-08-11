"use client";

import React from "react";
import { CourseCarousel } from "@/components/carousel/course-carousel";

// Simple mock data
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
  }
];

export default function TestMobilePaginationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Test Mobile Pagination
          </h1>
          <p className="text-gray-600 mb-6">
            Resize browser to mobile size to see pagination dots
          </p>
        </div>

        {/* NextLecture Style Container */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            NextLecture Container (lg:w-8/12)
          </h2>
          <div className="w-full lg:w-8/12 mx-auto">
            <div className="min-h-[230px] sm:min-h-[320px] md:min-h-[370px] lg:min-h-[330px]">
              <CourseCarousel
                courseData={mockData}
                className="h-full"
                containerType="next"
              />
            </div>
          </div>
        </div>

        {/* Full Width Test */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Full Width Container</h2>
          <div className="min-h-[230px] sm:min-h-[320px]">
            <CourseCarousel
              courseData={mockData}
              className="h-full"
              containerType="next"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Test Instructions
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>
              <strong>Desktop ({">"}640px):</strong> Should show navigation
              arrows and dots
            </p>
            <p>
              <strong>Mobile (≤640px):</strong> Should show swiper pagination
              dots at bottom
            </p>
            <p>
              <strong>Check:</strong> Open DevTools → Toggle device toolbar →
              Select mobile device
            </p>
          </div>
        </div>

        {/* Breakpoint Indicator */}
        <div className="fixed top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm z-50">
          <span className="block sm:hidden">Mobile (≤640px)</span>
          <span className="hidden sm:block md:hidden">Tablet (641-768px)</span>
          <span className="hidden md:block">Desktop ({">"}768px)</span>
        </div>
      </div>
    </div>
  );
}
