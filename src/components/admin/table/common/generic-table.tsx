"use client";

import { useState, useMemo, useCallback } from "react";
import { DataTable } from "@/components/admin/table/common/data-table";
import { useReactTable } from "@tanstack/react-table";

interface TableState {
  searchQuery: string;
  page: number;
  pageSize: number;
}

interface GenericTableProps<T> {
  data: T[];
  columns: any[];
  isLoading?: boolean;
  searchComponent?: React.ReactNode;
  actionButtons?: React.ReactNode;
  onSearch?: (value: string) => void;
  filterFunction?: (item: T, searchQuery: string) => boolean;
  meta?: any;
}

export function GenericTable<T>({
  data,
  columns,
  isLoading = false,
  searchComponent,
  actionButtons,
  onSearch,
  filterFunction,
  meta
}: GenericTableProps<T>) {
  const [tableState, setTableState] = useState<TableState>({
    searchQuery: "",
    page: 1,
    pageSize: 10
  });

  const { 
    paginatedData, 
    totalPages, 
    totalItems 
  } = useMemo(() => {
    // Lọc dữ liệu
    const filtered = !tableState.searchQuery 
      ? data 
      : data.filter(item => filterFunction?.(item, tableState.searchQuery));

    // Phân trang
    const startIndex = (tableState.page - 1) * tableState.pageSize;
    const endIndex = startIndex + tableState.pageSize;
    
    return {
      paginatedData: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / tableState.pageSize),
      totalItems: filtered.length
    };
  }, [data, tableState, filterFunction]);

  const handleSearch = useCallback((value: string) => {
    setTableState(prev => ({ ...prev, searchQuery: value, page: 1 }));
    onSearch?.(value);
  }, [onSearch]);

  const handlePageChange = useCallback((newPage: number) => {
    setTableState(prev => ({ ...prev, page: newPage }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setTableState(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  }, []);

  // const table = useReactTable({
  //   data,
  //   columns,
  //   state: {
  //     sorting: [],
  //     columnVisibility: {},
  //     rowSelection: {},
  //     pagination: {
  //       pageIndex: tableState.page - 1,
  //       pageSize: tableState.pageSize
  //     },
  //     globalFilter: tableState.searchQuery
  //   },
  //   meta,
  // });

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        {searchComponent && (
          <div onClick={(e) => e.stopPropagation()}>
            {searchComponent}
          </div>
        )}
        {actionButtons && (
          <div className="flex gap-5">
            {actionButtons}
          </div>
        )}
      </div>
      <DataTable
        data={paginatedData}
        columns={columns}
        pageCount={totalPages}
        currentPage={tableState.page}
        pageSize={tableState.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
        totalItems={totalItems}
        meta={meta}
      />
    </div>
  );
} 