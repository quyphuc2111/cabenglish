"use client"

import { Fragment, useState, useEffect } from 'react';
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
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

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
  const [maxVisiblePages, setMaxVisiblePages] = useState(5);
  
  // Check for extra small screens
  const isExtraSmall = useMediaQuery('(max-width: 375px)');
  const isSmall = useMediaQuery('(max-width: 640px)');
  
  // Update max visible pages based on screen size
  useEffect(() => {
    if (isExtraSmall) {
      setMaxVisiblePages(1);
    } else if (isSmall) {
      setMaxVisiblePages(3);
    } else {
      setMaxVisiblePages(5);
    }
  }, [isExtraSmall, isSmall]);

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
              className={cn(
                "flex items-center justify-center transition-all duration-200 rounded-md",
                isExtraSmall ? "min-w-[26px] h-7 text-[10px]" : isSmall ? "min-w-[28px] h-7 text-xs" : "min-w-[32px] h-8 text-sm",
                currentPage === i 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                  : 'hover:bg-blue-50 hover:text-blue-600'
              )}
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
          <PaginationItem key={i} className={isExtraSmall ? "px-0" : ""}>
            <PaginationEllipsis className={isExtraSmall ? "h-4 w-4" : ""}/>
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
      default: 
        return `${baseClasses} grid-cols-2 md:grid-cols-3 xl:grid-cols-4`;
    }
  };

  return (
    <div className={className}>
      
      {/* Content grid - responsive */}
      <ScrollArea className="pr-0 sm:pr-6 md:pr-10 mt-2">
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
        <div className="mt-4 sm:mt-6 md:mt-8 space-y-4 sm:space-y-6">
          
          {/* Main pagination - căn giữa với thiết kế đẹp hơn */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-sm border p-1 sm:p-2 w-full">
              <Pagination>
                <PaginationContent className={cn(
                  "gap-0 xs:gap-1 sm:gap-2", 
                  isExtraSmall ? "flex-wrap justify-center" : ""
                )}>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={prevPage} 
                      className={cn(
                        "hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md",
                        isExtraSmall ? "px-1 py-1 text-[10px]" : isSmall ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
                      )}
                    />
                  </PaginationItem>
                  {renderPageNumbers()}
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={nextPage} 
                      className={cn(
                        "hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md",
                        isExtraSmall ? "px-1 py-1 text-[10px]" : isSmall ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>

          {/* Bottom controls - stack vertically on small screens */}
          <div className="flex flex-col gap-3 bg-gray-50 rounded-lg p-2 sm:p-4">
            
            {/* Top row on mobile: Items per page + Items count */}
            <div className="flex flex-col xs:flex-row justify-between items-center gap-2 xs:gap-3">
              {/* Items per page selector */}
              <div className="flex items-center gap-1 xs:gap-2">
                {itemInPage.length > 0 && (
                  <>
                    <span className={cn("font-medium text-gray-700", isExtraSmall ? "text-xs" : "text-sm")}>Hiển thị:</span>
                    <Select 
                      value={selectedItemPerPage.toString()} 
                      onValueChange={(value) => setSelectedItemPerPage(Number(value))}
                    >
                      <SelectTrigger className={cn(
                        "border-gray-300 hover:border-blue-400 transition-colors bg-white",
                        isExtraSmall ? "w-[60px] h-7 text-xs" : "w-[80px] h-9 text-sm"
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          {itemInPage.map((number) => (
                            <SelectItem key={number} value={number.toString()} className="text-sm">
                              {number}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <span className={isExtraSmall ? "text-xs text-gray-600" : "text-sm text-gray-600"}>mục/trang</span>
                  </>
                )}
              </div>

              {/* Items count info for mobile */}
              <div className={cn(
                "text-gray-600 bg-white px-2 py-1 rounded-md border",
                isExtraSmall ? "text-xs" : "text-sm"
              )}>
                <span className="font-medium">Hiển thị:</span> {startIndex + 1}-{Math.min(endIndex, items.length)} / <span className="font-semibold text-blue-600">{items.length}</span> mục
              </div>
            </div>

            {/* Go to page - bottom row on mobile */}
            <div className="flex items-center justify-center gap-2 w-full">
              <span className={cn("font-medium text-gray-700", isExtraSmall ? "text-xs" : "text-sm")}>Đến trang:</span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  placeholder={isExtraSmall ? "Trang" : "Số trang"}
                  className={cn(
                    "border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors text-center bg-white",
                    isExtraSmall ? "w-[60px] h-7 text-xs" : "w-[90px] xs:w-[120px] sm:w-[140px] h-8 xs:h-9 text-sm" 
                  )}
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
                  className={cn(
                    "bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200",
                    isExtraSmall ? "h-7 px-2 text-xs" : "h-8 xs:h-9 px-3 sm:px-4"
                  )}
                >
                  Go
                </Button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}