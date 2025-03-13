import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PaginationButtonProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const pageSizeOptions = [10, 20, 30, 40, 50];

export function PaginationButton({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange
}: PaginationButtonProps) {
  const [pageInput, setPageInput] = useState("");

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNumber = parseInt(pageInput);
      if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
        onPageChange(pageNumber);
        setPageInput("");
      } else {
        setPageInput("");
      }
    }
  };

  const handlePageSizeChange = (newSize: string) => {
    const size = parseInt(newSize);
    onPageSizeChange(size);
    // Reset về trang 1 khi thay đổi pageSize
    onPageChange(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 w-1/3">
        <p className="text-sm text-gray-600">Hiển thị</p>
        <Select
          value={pageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-600">mục mỗi trang</p>
      </div>

      <div className="w-1/3 flex flex-col justify-center items-center gap-2">
        <Pagination>
          <PaginationContent className="flex items-center gap-1">
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </PaginationItem>

            {getPageNumbers().map((page, index) => {
              if (page === "ellipsis") {
                const isFirst = index < getPageNumbers().length / 2;
                const start = isFirst
                  ? 2
                  : Math.min(currentPage + 2, totalPages - 1);
                const end = isFirst
                  ? Math.max(currentPage - 2, 2)
                  : totalPages - 1;
                const hiddenPages = Array.from(
                  { length: Math.abs(end - start) + 1 },
                  (_, i) => start + i * (start < end ? 1 : -1)
                );

                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-9 w-9 min-w-[2.25rem]"
                        >
                          <PaginationEllipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="max-h-[200px] overflow-y-auto">
                        {hiddenPages.map((p) => (
                          <DropdownMenuItem
                            key={p}
                            onClick={() => onPageChange(p)}
                            className="flex justify-center"
                          >
                            Trang {p}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={page}>
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9 min-w-[2.25rem]"
                    onClick={() => onPageChange(page as number)}
                  >
                    <span className="select-none">{page}</span>
                  </Button>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="w-1/3 flex flex-col items-end justify-center gap-2">
        <div className="flex items-center gap-2 ml-2">
          <Input
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputKeyDown}
            placeholder="Nhập trang..."
            className="w-[100px] h-9 text-center"
            type="text"
            maxLength={String(totalPages).length}
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            / {totalPages}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {totalItems > 0 
            ? `Hiển thị ${startItem}-${endItem} trong tổng số ${totalItems} mục`
            : 'Không có dữ liệu'
          }
        </p>
      </div>
    </div>
  );
}
