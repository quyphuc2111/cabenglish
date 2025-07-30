import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  showInfo?: boolean;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
  isLoading = false,
  showInfo = true,
  className = ''
}: PaginationControlsProps) {
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}>
      {/* Info */}
      {showInfo && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
          <span>
            Hiển thị {startRow} - {endRow} của {totalRows} dòng
          </span>
          <span className={`font-medium ${totalRows > 100 ? 'text-red-600' : 'text-green-600'}`}>
            {totalRows > 100 ? 'Vượt quá giới hạn import!' : 'Trong giới hạn import'}
          </span>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 justify-center sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Trang trước</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {totalPages <= 7 ? (
            // Show all pages if total pages <= 7
            Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  disabled={isLoading}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })
          ) : (
            // Show condensed pagination for > 7 pages
            <>
              {/* Always show first page */}
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={isLoading}
                className="w-8 h-8 p-0"
              >
                1
              </Button>

              {/* Show ellipsis if current page > 3 */}
              {currentPage > 3 && (
                <span className="px-2 text-gray-400">...</span>
              )}

              {/* Show pages around current page */}
              {Array.from({ length: 3 }, (_, i) => {
                const offset = i - 1; // -1, 0, 1
                const pageNum = currentPage + offset;
                
                // Skip if it's first or last page (already shown)
                if (pageNum <= 1 || pageNum >= totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    disabled={isLoading}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {/* Show ellipsis if current page < totalPages - 2 */}
              {currentPage < totalPages - 2 && (
                <span className="px-2 text-gray-400">...</span>
              )}

              {/* Always show last page */}
              {totalPages > 1 && (
                <Button
                  variant={currentPage === totalPages ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  disabled={isLoading}
                  className="w-8 h-8 p-0"
                >
                  {totalPages}
                </Button>
              )}
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">Trang sau</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 