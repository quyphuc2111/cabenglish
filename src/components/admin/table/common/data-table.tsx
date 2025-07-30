"use client";

import {
  ColumnDef,
  flexRender,
  Header,
  HeaderGroup,
  Row,
  Cell
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationButton } from "./pagination-button";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
  totalItems: number;
  meta?: any;
  table: any;
}

// Tạo một wrapper component cho animation
const AnimatedTableContent = motion.create(TableBody);

const tableContentAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

const tableRowAnimation = {
  initial: { opacity: 0, x: -10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.2
    }
  }
};

// Tạo component TableRowSkeleton
const TableRowSkeleton = ({ columns }: { columns: number }) => (
  <TableRow>
    {Array(columns).fill(0).map((_, index) => (
      <TableCell key={index}>
        <Skeleton className="h-8 w-full" />
      </TableCell>
    ))}
  </TableRow>
);

// Tạo component LoadingRows
const LoadingRows = ({ columns, pageSize }: { columns: number, pageSize: number }) => (
  <>
    {Array(pageSize).fill(0).map((_, index) => (
      <TableRowSkeleton key={index} columns={columns} />
    ))}
  </>
);

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading,
  totalItems,
  table
}: DataTableProps<TData, TValue>) {

  
  return (
    <div className="w-full overflow-auto">
      <div className="rounded-md border min-w-[640px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<TData, unknown>) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <AnimatePresence mode="wait">
            <AnimatedTableContent
              key={isLoading ? 'loading' : data.length}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={tableContentAnimation}
            >
              {isLoading ? (
                <LoadingRows 
                  columns={columns.length} 
                  pageSize={pageSize}
                />
              ) : data.length ? (
                table.getRowModel().rows.map((row: Row<TData>) => (
                  <motion.tr
                    key={row.id}
                    variants={tableRowAnimation}
                    className={`border-b transition-colors hover:bg-muted/50 ${
                      row.getIsSelected() ? "bg-muted" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </AnimatedTableContent>
          </AnimatePresence>
        </Table>
      </div>
      <div className="mt-4">
        <PaginationButton
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={pageCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}