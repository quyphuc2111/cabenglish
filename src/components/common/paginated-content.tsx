"use client"

import { Fragment, useState } from 'react';
import { usePagination } from '@/hooks/usePagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Image from 'next/image';

interface PaginatedContentProps<T> {
  items: T[];
  itemsPerPage: number;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  rowPerPage?: number;
  itemInPage?: number[];
}

export function PaginatedContent<T>({
  items,
  itemsPerPage,
  renderItem,
  className,
  rowPerPage = 4,
  itemInPage = []
}: PaginatedContentProps<T>) {
  const [selectedItemPerPage, setSelectedItemPerPage] = useState(itemsPerPage);
  const [pageInput, setPageInput] = useState('');

  const {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex
  } = usePagination({
    totalItems: items.length,
    itemsPerPage: selectedItemPerPage
  });

  const currentItems = items.slice(startIndex, endIndex);

  const renderPageNumbers = () => {
    const pages = [];
    // Safe check for window object (SSR compatibility)
    const maxVisiblePages = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 5;
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - Math.floor(maxVisiblePages/2) && i <= currentPage + Math.floor(maxVisiblePages/2))
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => goToPage(i)}
              isActive={currentPage === i}
              className={`text-xs sm:text-sm min-w-[32px] h-8 flex items-center justify-center transition-all duration-200 ${
                currentPage === i 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                  : 'hover:bg-blue-50 hover:text-blue-600'
              } rounded-md`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (i === currentPage - Math.floor(maxVisiblePages/2) - 1 && currentPage > Math.floor(maxVisiblePages/2) + 1) ||
        (i === currentPage + Math.floor(maxVisiblePages/2) + 1 && currentPage < totalPages - Math.floor(maxVisiblePages/2))
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    return pages;
  };

  // Responsive grid columns function
  const getResponsiveGridColumns = () => {
    const baseClasses = "grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 my-4 sm:my-6 md:my-8 mx-1 sm:mx-2";
    
    switch(rowPerPage) {
      case 2:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`;
      case 3:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3`;
      case 5:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`;
      case 6:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6`;
      default: // 4 columns
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
    }
  };

  return (
    <div className={className}>
      
      {/* Content grid - responsive */}
      <ScrollArea className="pr-2 sm:pr-6 md:pr-10 mt-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-10 h-full justify-center py-16">
            <h3 className="text-2xl md:text-3xl text-[#736E6E] font-medium text-center">
              Hiện tại chưa có bài giảng nào!
            </h3>
            <div className="w-32 h-32 md:w-36 md:h-36 opacity-60">
              <Image
                src="/assets/image/no_course.png"
                width={512}
                height={512}
                alt="Không có bài giảng"
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          <div className={getResponsiveGridColumns()}>
            {currentItems.map((item, index) => (
              <Fragment key={index}>{renderItem(item)}</Fragment>
            ))}
          </div>
        )}
      </ScrollArea>
    
      {items.length > 0 && (
        <div className="mt-8 space-y-6">
          
          {/* Main pagination - căn giữa với thiết kế đẹp hơn */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-sm border p-2">
              <Pagination>
                <PaginationContent className="gap-1 sm:gap-2">
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={prevPage} 
                      className="text-xs sm:text-sm px-3 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md"
                    />
                  </PaginationItem>
                  {renderPageNumbers()}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={nextPage} 
                      className="text-xs sm:text-sm px-3 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>

          {/* Bottom controls - layout cải tiến với 3 phần */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50 rounded-lg p-4">
            
            {/* Left: Items per page selector */}
            <div className="flex items-center gap-3">
              {itemInPage.length > 0 && (
                <>
                  <span className="text-sm font-medium text-gray-700">Hiển thị:</span>
                  <Select 
                    value={selectedItemPerPage.toString()} 
                    onValueChange={(value) => setSelectedItemPerPage(Number(value))}
                  >
                    <SelectTrigger className="w-[80px] h-9 text-sm border-gray-300 hover:border-blue-400 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {itemInPage.map((number) => (
                          <SelectItem key={number} value={number.toString()} className="text-sm">
                            {number}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">mục/trang</span>
                </>
              )}
            </div>

            {/* Center: Go to page */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Đến trang:</span>
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                placeholder="Số trang"
                className="w-40 h-9 text-sm text-center border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
              />
              <Button
                onClick={() => {
                  const page = parseInt(pageInput);
                  if (page >= 1 && page <= totalPages) {
                    goToPage(page);
                    setPageInput('');
                  }
                }}
                disabled={!pageInput || parseInt(pageInput) < 1 || parseInt(pageInput) > totalPages}
                size="sm"
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              >
                Go
              </Button>
            </div>

            {/* Right: Items count info */}
            <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-md border">
              <span className="font-medium">Hiển thị:</span> {startIndex + 1}-{Math.min(endIndex, items.length)} / <span className="font-semibold text-blue-600">{items.length}</span> mục
            </div>
          </div>
        </div>
      )}
    </div>
  );
}