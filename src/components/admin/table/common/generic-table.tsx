"use client";

import { useState, useMemo, useCallback } from "react";
import { DataTable } from "@/components/admin/table/common/data-table";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";

interface TableState {
  searchQuery: string;
  page: number;
  pageSize: number;
}

interface GenericTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  searchComponent?: React.ReactNode;
  actionButtons?: React.ReactNode;
  onSearch?: (value: string) => void;
  filterFunction?: (item: T, searchQuery: string) => boolean;
  meta?: any;
  enableRowSelection?: boolean;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (updaterOrValue: ((old: Record<string, boolean>) => Record<string, boolean>) | Record<string, boolean>) => void;
  getRowId?: (row: T) => string;
}

// Tách SearchAndActions thành component riêng với responsive design
const SearchAndActions = ({ searchComponent, actionButtons }: { searchComponent: React.ReactNode, actionButtons: React.ReactNode }) => (
  <div className="flex flex-col justify-end  gap-4 2xl:flex-row 2xl:justify-between 2xl:items-center">
    {searchComponent && (
      <div className="flex-1 sm:flex-none sm:min-w-0 sm:max-w-3xl" onClick={(e) => e.stopPropagation()}>
        {searchComponent}
      </div>
    )}
    {actionButtons && (
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-start sm:justify-center">
        {actionButtons}
      </div>
    )}
  </div>
);

export function GenericTable<T>({
  data,
  columns,
  isLoading: initialLoading = false,
  searchComponent,
  actionButtons,
  onSearch,
  filterFunction,
  meta,
  enableRowSelection = false,
  rowSelection = {},
  onRowSelectionChange,
  getRowId = (row: any) => row.id?.toString(),
}: GenericTableProps<T>) {
  const [tableState, setTableState] = useState<TableState>({
    searchQuery: "",
    page: 1,
    pageSize: 10
  });

  // Thêm state để theo dõi loading khi chuyển trang
  const [isChangingPage, setIsChangingPage] = useState(false);

  // Kết hợp loading states
  const isLoading = initialLoading || isChangingPage;

  const { paginatedData, totalPages, totalItems } = useMemo(() => {
    // Lọc dữ liệu trước
    const filtered = !tableState.searchQuery 
      ? data 
      : data.filter(item => filterFunction?.(item, tableState.searchQuery));

    // Reset về trang 1 nếu tổng số trang mới nhỏ hơn trang hiện tại
    const calculatedTotalPages = Math.ceil(filtered.length / tableState.pageSize);
    if (calculatedTotalPages > 0 && tableState.page > calculatedTotalPages) {
      setTableState(prev => ({ ...prev, page: 1 }));
    }

    // Tính toán vị trí bắt đầu và kết thúc cho phân trang
    const startIndex = (tableState.page - 1) * tableState.pageSize;
    const endIndex = Math.min(startIndex + tableState.pageSize, filtered.length);
    
    const result = {
      paginatedData: filtered.slice(startIndex, endIndex),
      totalPages: calculatedTotalPages,
      totalItems: filtered.length
    };
    
    return result;
  }, [data, tableState, filterFunction]);

  // Thêm hàm xử lý search riêng
  const handleSearch = useCallback((value: string) => {
    setTableState(prev => ({ 
      ...prev, 
      searchQuery: value,
      page: 1 
    }));
    onSearch?.(value);
  }, [onSearch]);

  // Cập nhật hàm xử lý chuyển trang
  const handlePageChange = useCallback(async (page: number) => {
    setIsChangingPage(true);
    setTableState(prev => ({ ...prev, page }));
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsChangingPage(false);
  }, []);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageIndex: tableState.page - 1,
        pageSize: tableState.pageSize,
      },
      rowSelection,
    },
    enableRowSelection,
    onRowSelectionChange,
    getRowId,
    meta
  });

  return (
    <div className="space-y-4">
      <SearchAndActions 
        searchComponent={searchComponent}
        actionButtons={actionButtons}
      />
      <DataTable
        table={table}
        columns={columns}
        data={paginatedData}
        isLoading={isLoading}
        pageCount={totalPages}
        currentPage={tableState.page}
        pageSize={tableState.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={(pageSize) => setTableState(prev => ({ 
          ...prev, 
          pageSize, 
          page: 1 
        }))}
        totalItems={totalItems}
      />
    </div>
  );
}