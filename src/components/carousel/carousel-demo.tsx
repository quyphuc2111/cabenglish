"use client";

import React, { useState } from "react";
import { CourseCarousel } from "./course-carousel";

// Mock data generator
const generateMockData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    lessonId: index + 1,
    classId: Math.floor(Math.random() * 10) + 1,
    unitId: Math.floor(Math.random() * 5) + 1,
    schoolWeekId: Math.floor(Math.random() * 20) + 1,
    lessonName: `Bài học ${index + 1}: ${[
      "Toán học cơ bản",
      "Tiếng Việt",
      "Khoa học tự nhiên",
      "Lịch sử",
      "Địa lý",
      "Âm nhạc",
      "Mỹ thuật",
      "Thể dục"
    ][Math.floor(Math.random() * 8)]}`,
    className: `Lớp ${Math.floor(Math.random() * 5) + 1}A`,
    unitName: `Chương ${Math.floor(Math.random() * 10) + 1}`,
    imageUrl: `https://picsum.photos/300/200?random=${index}`,
    schoolWeek: Math.floor(Math.random() * 20) + 1,
    progress: Math.floor(Math.random() * 101),
    numLiked: Math.floor(Math.random() * 50),
    isLocked: Math.random() > 0.8, // 20% chance of being locked
  }));
};

export function CarouselDemo() {
  const [itemCount, setItemCount] = useState(20);
  const [removingLessons, setRemovingLessons] = useState<Set<number>>(new Set());
  
  const mockData = generateMockData(itemCount);

  const handleLikeUpdate = (lessonId: number, newLikeCount: number) => {
    console.log(`Lesson ${lessonId} liked, new count: ${newLikeCount}`);
  };

  const handleLessonClick = (lessonId: number) => {
    console.log(`Clicked lesson ${lessonId}`);
  };

  const simulateRemoval = () => {
    const randomIds = new Set<number>();
    const count = Math.floor(Math.random() * 5) + 1;
    
    while (randomIds.size < count && randomIds.size < mockData.length) {
      randomIds.add(Math.floor(Math.random() * mockData.length) + 1);
    }
    
    setRemovingLessons(randomIds);
    
    // Simulate async removal
    setTimeout(() => {
      setRemovingLessons(new Set());
    }, 3000);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Course Carousel Demo</h1>
        <p className="text-gray-600 mb-6">
          Demo với Lazy Loading và Virtual Scrolling
        </p>
        
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="itemCount" className="text-sm font-medium">
              Số lượng items:
            </label>
            <select
              id="itemCount"
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="border rounded px-3 py-1"
            >
              <option value={10}>10 items</option>
              <option value={20}>20 items</option>
              <option value={50}>50 items</option>
              <option value={100}>100 items (Virtual Scrolling)</option>
              <option value={200}>200 items (Virtual Scrolling)</option>
              <option value={500}>500 items (Virtual Scrolling)</option>
            </select>
          </div>
          
          <button
            onClick={simulateRemoval}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
            disabled={removingLessons.size > 0}
          >
            {removingLessons.size > 0 ? "Đang xử lý..." : "Simulate Removal"}
          </button>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          {itemCount > 50 ? (
            <div className="bg-green-100 text-green-800 px-3 py-2 rounded">
              ✅ Virtual Scrolling được kích hoạt (>50 items)
            </div>
          ) : (
            <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded">
              📋 Chế độ thường (≤50 items)
            </div>
          )}
        </div>
      </div>

      <CourseCarousel
        courseData={mockData}
        className="max-w-7xl mx-auto"
        onLikeUpdate={handleLikeUpdate}
        onLessonClick={handleLessonClick}
        removingLessons={removingLessons}
      />

      <div className="text-center text-sm text-gray-500 space-y-2">
        <p><strong>Tính năng được implement:</strong></p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
          <div className="bg-gray-50 p-3 rounded">
            🚀 <strong>Lazy Loading:</strong> Components chỉ load khi cần
          </div>
          <div className="bg-gray-50 p-3 rounded">
            📱 <strong>Virtual Scrolling:</strong> Hiệu năng cao với >50 items
          </div>
          <div className="bg-gray-50 p-3 rounded">
            👁️ <strong>Intersection Observer:</strong> Detect visibility
          </div>
          <div className="bg-gray-50 p-3 rounded">
            ⚡ <strong>Optimized Rendering:</strong> Chỉ render items cần thiết
          </div>
        </div>
      </div>

      <div className="text-center">
        <details className="max-w-2xl mx-auto text-left">
          <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
            📊 Performance Metrics
          </summary>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p><strong>Current Items:</strong> {itemCount}</p>
            <p><strong>Virtual Scrolling:</strong> {itemCount > 50 ? "Enabled" : "Disabled"}</p>
            <p><strong>Buffer Size:</strong> 5 items</p>
            <p><strong>Lazy Loading:</strong> Enabled</p>
            <p><strong>Intersection Observer:</strong> Active</p>
            <p><strong>Removing Items:</strong> {removingLessons.size}</p>
          </div>
        </details>
      </div>
    </div>
  );
}

export default CarouselDemo;
