"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, ChevronRight } from "lucide-react";

interface PaginatedContentV2Props<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemsPerPage?: number;
  loadingText?: string;
  endText?: string;
  className?: string;
  gridCols?: number; // số cột trên desktop (chỉ dùng khi layout="grid")
  gap?: number; // khoảng cách giữa các items
  threshold?: number; // khoảng cách trigger load more (pixels)
  layout?: "grid" | "horizontal"; // layout type: grid hoặc horizontal scroll
  itemWidth?: string; // width của mỗi item khi horizontal (vd: "280px", "300px")
  loadMode?: "auto" | "manual"; // auto: infinite scroll, manual: click button to load
  t?: (key: string) => string;
}

export function PaginatedContentV2<T extends { lessonId?: number; id?: number | string }>({
  items,
  renderItem,
  itemsPerPage = 10,
  loadingText = "Đang tải thêm...",
  endText = "Đã hiển thị tất cả",
  className = "",
  gridCols = 2,
  gap = 4,
  threshold = 200,
  layout = "grid",
  itemWidth = "280px",
  loadMode = "auto",
  t,
}: PaginatedContentV2Props<T>) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Load initial items
  useEffect(() => {
    const initialItems = items.slice(0, itemsPerPage);
    setDisplayedItems(initialItems);
    setHasMore(items.length > itemsPerPage);
    setCurrentPage(1);
  }, [items, itemsPerPage]);

  // Load more function
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate network delay for smooth UX
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * itemsPerPage;
      const newItems = items.slice(startIndex, endIndex);

      setDisplayedItems(newItems);
      setCurrentPage(nextPage);
      setHasMore(endIndex < items.length);
      setIsLoading(false);
    }, 300);
  }, [currentPage, items, itemsPerPage, isLoading, hasMore]);

  // Intersection Observer for infinite scroll (chỉ khi loadMode = "auto")
  useEffect(() => {
    if (loadMode !== "auto") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, loadMore, threshold, loadMode]);

  // Grid columns class mapping
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[gridCols] || "grid-cols-1 sm:grid-cols-2";

  // Gap class mapping
  const gapClass = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
  }[gap] || "gap-4";

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 text-sm">Không có dữ liệu</p>
      </div>
    );
  }

  // Render Grid Layout
  if (layout === "grid") {
    return (
      <div className={`w-full ${className}`}>
        <div className={`grid ${gridColsClass} ${gapClass}`}>
          {displayedItems.map((item, index) => (
            <div key={item.lessonId || item.id || index}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>

        {/* Observer Target */}
        <div ref={observerTarget} className="w-full py-4">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">{loadingText}</span>
            </div>
          )}
          {!hasMore && displayedItems.length > 0 && (
            <div className="text-center text-gray-400 text-sm py-2">
              {endText}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Horizontal Scroll Layout
  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <div 
          className={`flex overflow-x-auto p-4 gap-4 snap-x snap-mandatory ${gapClass} scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100 hover:scrollbar-thumb-blue-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full`}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
          }}
        >
          {displayedItems.map((item, index) => (
            <div 
              key={item.lessonId || item.id || index}
              className="flex-none snap-start"
              style={{ width: itemWidth }}
            >
              {renderItem(item, index)}
            </div>
          ))}
          
          {/* Manual Load Button - khi loadMode = "manual" */}
          {loadMode === "manual" && hasMore && !isLoading && (
            <div 
              className="flex-none snap-start"
              style={{ width: itemWidth }}
            >
              <button
                onClick={loadMore}
                className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-xl transition-all duration-300 hover:shadow-lg group"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-8 h-8 text-blue-500 group-hover:text-blue-600" />
                </div>
                <div className="text-center px-4">
                  <p className="font-semibold text-gray-700 text-sm">{t("seeMore")}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {items.length - displayedItems.length} {t("lesson")}
                  </p>
                </div>
              </button>
            </div>
          )}
          
          {/* Inline Loading Indicator - khi loadMode = "auto" */}
          {loadMode === "auto" && isLoading && (
            <div 
              className="flex-none snap-start"
              style={{ width: itemWidth, minHeight: '280px' }}
            >
              <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                <span className="text-sm font-medium text-gray-600">{loadingText}</span>
              </div>
            </div>
          )}

          {/* Loading indicator khi loadMode = "manual" */}
          {loadMode === "manual" && isLoading && (
            <div 
              className="flex-none snap-start"
              style={{ width: itemWidth, minHeight: '280px' }}
            >
              <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                <span className="text-sm font-medium text-gray-600">{loadingText}</span>
              </div>
            </div>
          )}
        </div>

        {/* Fade gradient ở cuối - chỉ khi có thêm items */}
        {displayedItems.length > 3 && hasMore && loadMode === "auto" && (
          <div className="absolute right-0 top-0 bottom-4 w-24 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Observer Target - chỉ cho auto mode */}
      {loadMode === "auto" && (
        <div ref={observerTarget} className="w-full py-2">
          {!hasMore && displayedItems.length > 0 && (
            <div className="text-center text-gray-400 text-sm py-2">
              {endText}
            </div>
          )}
        </div>
      )}

      {/* End message cho manual mode */}
      {loadMode === "manual" && !hasMore && displayedItems.length > 0 && (
        <div className="text-center text-gray-400 text-sm py-4">
          {endText}
        </div>
      )}
    </div>
  );
}

