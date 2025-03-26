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
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => goToPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    return pages;
  };

  const getGridColumns = () => {
    switch(rowPerPage) {
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 5:
        return "grid-cols-5";
      case 6:
        return "grid-cols-6";
      default:
        return "grid-cols-4";
    }
  };

  return (
    <div className={className}>
      
      <ScrollArea className=" pr-10 mt-2">
      <div className={`grid ${getGridColumns()} gap-8 my-8 mx-2`}>
        {currentItems.map((item, index) => (
          <Fragment key={index}>{renderItem(item)}</Fragment>
        ))}
      </div>
      </ScrollArea>
    
     <div className="grid grid-cols-3 gap-4 mt-5">
     <div className="flex mb-4">
      {
        itemInPage.length > 0 ? (
          <Select value={selectedItemPerPage.toString()} onValueChange={(value) => setSelectedItemPerPage(Number(value))}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Số lượng" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {itemInPage.map((number) => (
                <SelectItem key={number} value={number.toString()}>
                  {number}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        ) : (<></>) 
      }
       
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={prevPage} />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext href="#" onClick={nextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
     </div>
    </div>
  );
} 