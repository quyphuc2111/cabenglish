"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GamePaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function GamePagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange
}: GamePaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 space-y-4">
      {/* Info Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-600">Hiển thị</span>
          <span className="font-bold text-blue-600 bg-white px-3 py-1 rounded-lg shadow-sm">
            {startItem} - {endItem}
          </span>
          <span className="text-gray-600">trong tổng số</span>
          <span className="font-bold text-purple-600 bg-white px-3 py-1 rounded-lg shadow-sm">
            {totalCount}
          </span>
          <span className="text-gray-600">trò chơi 🎮</span>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2">
        {/* First Page Button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            "p-2 rounded-lg transition-all",
            currentPage === 1
              ? "opacity-40 cursor-not-allowed bg-gray-100"
              : "bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:scale-105 shadow-sm"
          )}
          title="Trang đầu"
        >
          <ChevronsLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
            currentPage === 1
              ? "opacity-40 cursor-not-allowed bg-gray-100"
              : "bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:scale-105 shadow-sm"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Trước</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 sm:gap-2">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
              className={cn(
                "min-w-[2.5rem] sm:min-w-[3rem] h-10 sm:h-12 px-3 text-sm font-bold rounded-xl transition-all",
                page === currentPage
                  ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-110 border-2 border-blue-300"
                  : page === "..."
                  ? "text-gray-400 cursor-default bg-transparent"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:scale-105 shadow-sm"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed bg-gray-100"
              : "bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:scale-105 shadow-sm"
          )}
        >
          <span className="hidden sm:inline text-sm">Sau</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            "p-2 rounded-lg transition-all",
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed bg-gray-100"
              : "bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:scale-105 shadow-sm"
          )}
          title="Trang cuối"
        >
          <ChevronsRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

