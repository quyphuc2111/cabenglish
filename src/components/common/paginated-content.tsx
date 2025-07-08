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
              className="text-xs sm:text-sm"
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
        <div className={getResponsiveGridColumns()}>
          {currentItems.map((item, index) => (
            <Fragment key={index}>{renderItem(item)}</Fragment>
          ))}
        </div>
      </ScrollArea>
    
      <div className="mt-6 space-y-4">
        
        {/* Main pagination - căn giữa */}
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent className="gap-1 sm:gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={prevPage} 
                  className="text-xs sm:text-sm px-2 sm:px-3"
                />
              </PaginationItem>
              {renderPageNumbers()}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={nextPage} 
                  className="text-xs sm:text-sm px-2 sm:px-3"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Bottom controls - flex layout cân đối */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          
          {/* Left: Items per page selector */}
          <div className="flex items-center gap-3">
            {itemInPage.length > 0 && (
              <>
                <span className="text-xs sm:text-sm">Hiển thị:</span>
                <Select 
                  value={selectedItemPerPage.toString()} 
                  onValueChange={(value) => setSelectedItemPerPage(Number(value))}
                >
                  <SelectTrigger className="w-[70px] sm:w-[80px] h-8 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {itemInPage.map((number) => (
                        <SelectItem key={number} value={number.toString()} className="text-xs sm:text-sm">
                          {number}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>

          {/* Right: Items count info */}
          <div className="text-xs sm:text-sm text-gray-500">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, items.length)} / {items.length} mục
          </div>
        </div>
      </div>
    </div>
  );
} 