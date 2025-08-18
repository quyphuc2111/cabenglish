"use client";

import React from "react";
import { PaginatedContent } from "@/components/common/paginated-content";

// Mock data với nhiều items để test pagination
const mockItems = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  title: `Item ${index + 1}`,
  description: `Description for item ${index + 1}`,
  category: `Category ${Math.floor(index / 10) + 1}`
}));

export default function TestPaginationPage() {
  const renderItem = (item: any) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
        {item.category}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Test Pagination Component
          </h1>
          <p className="text-gray-600 mb-6">
            Test pagination trên mobile với nhiều trang (100 items, 8 items/page
            = 13 trang)
          </p>
        </div>

        {/* Test với 8 items per page */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            8 Items per Page (13 trang total)
          </h2>
          <PaginatedContent
            items={mockItems}
            itemsPerPage={8}
            renderItem={renderItem}
            rowPerPage={4}
            itemInPage={[8, 12, 16, 20]}
            className="w-full"
          />
        </div>

        {/* Test với 6 items per page */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            6 Items per Page (17 trang total)
          </h2>
          <PaginatedContent
            items={mockItems}
            itemsPerPage={6}
            renderItem={renderItem}
            rowPerPage={3}
            itemInPage={[6, 9, 12, 15]}
            className="w-full"
          />
        </div>

        {/* Test layout chia đôi như Current/Next Lecture */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Test Layout Chia Đôi (Current/Next Lecture Style)
          </h2>
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8 xl:gap-12 min-w-0 justify-start">
            {/* Current Lectures */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium mb-3 text-blue-600">
                Current Lectures
              </h3>
              <PaginatedContent
                items={mockItems.slice(0, 50)}
                itemsPerPage={4}
                renderItem={renderItem}
                rowPerPage={2}
                itemInPage={[4, 8, 12]}
                className="h-full"
              />
            </div>

            {/* Divider */}
            <div className="hidden xl:block border-r-2 border-gray-200"></div>
            <div className="xl:hidden w-full h-px border-b border-gray-200"></div>

            {/* Next Lectures */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium mb-3 text-green-600">
                Next Lectures
              </h3>
              <PaginatedContent
                items={mockItems.slice(50)}
                itemsPerPage={4}
                renderItem={renderItem}
                rowPerPage={2}
                itemInPage={[4, 8, 12]}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Test Instructions
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>
              <strong>Desktop ({">"}1024px):</strong> Pagination hiển thị bình
              thường với Previous/Next và số trang
            </p>
            <p>
              <strong>Tablet (641-1024px):</strong> Pagination có thể scroll
              ngang, maxVisiblePages = 3
            </p>
            <p>
              <strong>Mobile (≤640px):</strong> Pagination có thể scroll ngang,
              không bị tràn width
            </p>
            <p>
              <strong>Extra Small (≤375px):</strong> Pagination tối ưu cho màn
              hình rất nhỏ
            </p>
            <p>
              <strong>Test Layout Chia Đôi:</strong> Kiểm tra pagination trong
              container hẹp như Current/Next Lecture
            </p>
            <p>
              <strong>Test:</strong> Thử chuyển đến trang giữa (ví dụ trang 7)
              và kiểm tra xem có bị tràn không
            </p>
          </div>
        </div>

        {/* Breakpoint Indicator */}
        <div className="fixed top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm z-50">
          <span className="block xs:hidden">Extra Small (≤375px)</span>
          <span className="hidden xs:block sm:hidden">Small (376-640px)</span>
          <span className="hidden sm:block md:hidden">Medium (641-768px)</span>
          <span className="hidden md:block">Large ({">"}768px)</span>
        </div>
      </div>
    </div>
  );
}
