"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { PaginationButton } from "../common/pagination-button";

interface SortableDataTableProps<TData> {
  table: ReactTable<TData>;
  columns: any[];
  isLoading?: boolean;
  pageCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  totalItems: number;
}

function SortableRow({ row, children }: { row: any; children: React.ReactNode }) {
  const rowId = row.id;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: rowId,
  });

  // Debug log
  React.useEffect(() => {
    if (listeners) {
      console.log('Drag listeners attached for row:', rowId);
    }
  }, [listeners, rowId]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 0,
  };

  // Convert children array to array to work with
  const childrenArray = React.Children.toArray(children);

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
      className={`relative ${isDragging ? 'bg-gray-50' : ''}`}
    >
      {childrenArray.map((child, index) => {
        // First cell (drag handle) gets drag listeners
        if (index === 0 && React.isValidElement(child)) {
          const TableCellComponent = child.type;
          const originalContent = (child as any).props.children;
          
          console.log('Rendering drag handle cell for row:', rowId, 'with listeners:', !!listeners);
          
          return (
            <TableCellComponent key={`drag-${index}`} {...(child as any).props}>
              <div 
                {...listeners} 
                {...attributes} 
                className="flex items-center justify-center w-full h-full min-h-[40px]"
                style={{ 
                  touchAction: 'none', 
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none',
                }}
                title="Kéo để sắp xếp"
                onMouseDown={(e) => {
                  console.log('Mouse down on drag handle for row:', rowId);
                }}
              >
                {originalContent}
              </div>
            </TableCellComponent>
          );
        }
        return React.isValidElement(child) 
          ? React.cloneElement(child as React.ReactElement<any>, { key: index })
          : child;
      })}
    </TableRow>
  );
}

export function SortableDataTable<TData>({
  table,
  columns,
  isLoading = false,
  pageCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalItems,
}: SortableDataTableProps<TData>) {
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="rounded-md border min-w-[640px]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
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

  return (
    <div className="w-full overflow-x-auto">
      <div className="rounded-md border min-w-[640px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <SortableRow key={row.id} row={row}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </SortableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
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

