"use client";

import { useState, useMemo, useCallback } from "react";
import { useReactTable, getCoreRowModel, ColumnDef } from "@tanstack/react-table";
import React from "react";
import { SortableDataTable } from "./sortable-data-table";

interface TableState {
  searchQuery: string;
  page: number;
  pageSize: number;
}

interface SortableGenericTableProps<T> {
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
  // Server-side pagination props
  serverPagination?: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
}

const SearchAndActions = ({ searchComponent, actionButtons }: { searchComponent: React.ReactNode, actionButtons: React.ReactNode }) => (
  <div className="flex flex-col justify-end gap-4 2xl:flex-row 2xl:justify-between 2xl:items-center">
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

export function SortableGenericTable<T>({
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
  serverPagination,
}: SortableGenericTableProps<T>) {
  const [tableState, setTableState] = useState<TableState>({
    searchQuery: "",
    page: 1,
    pageSize: 10
  });

  const [isChangingPage, setIsChangingPage] = useState(false);
  const isLoading = initialLoading || isChangingPage;

  // Use server-side pagination if provided, otherwise client-side
  const useServerPagination = !!serverPagination;

  // Calculate paginated data, total pages, and total items (client-side)
  const { paginatedData, totalPages, totalItems } = useMemo(() => {
    if (useServerPagination) {
      // Server-side: use data as-is (already paginated)
      return {
        paginatedData: data,
        totalPages: serverPagination.totalPages,
        totalItems: serverPagination.totalItems
      };
    }

    // Client-side: filter and paginate
    const filtered = !tableState.searchQuery 
      ? data 
      : data.filter(item => filterFunction?.(item, tableState.searchQuery));

    // Reset to page 1 if current page exceeds total pages
    const calculatedTotalPages = Math.ceil(filtered.length / tableState.pageSize);
    if (calculatedTotalPages > 0 && tableState.page > calculatedTotalPages) {
      setTableState(prev => ({ ...prev, page: 1 }));
    }

    // Calculate start and end indices for pagination
    const startIndex = (tableState.page - 1) * tableState.pageSize;
    const endIndex = Math.min(startIndex + tableState.pageSize, filtered.length);
    
    return {
      paginatedData: filtered.slice(startIndex, endIndex),
      totalPages: calculatedTotalPages,
      totalItems: filtered.length
    };
  }, [data, tableState, filterFunction, useServerPagination, serverPagination]);

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setTableState(prev => ({ 
      ...prev, 
      searchQuery: value,
      page: 1 
    }));
    onSearch?.(value);
  }, [onSearch]);

  // Handle page change
  const handlePageChange = useCallback(async (page: number) => {
    if (useServerPagination) {
      serverPagination.onPageChange(page);
    } else {
      setIsChangingPage(true);
      setTableState(prev => ({ ...prev, page }));
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsChangingPage(false);
    }
  }, [useServerPagination, serverPagination]);

  // Handle page size change
  const handlePageSizeChange = useCallback((pageSize: number) => {
    if (useServerPagination) {
      serverPagination.onPageSizeChange(pageSize);
    } else {
      setTableState(prev => ({ 
        ...prev, 
        pageSize, 
        page: 1 
      }));
    }
  }, [useServerPagination, serverPagination]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageIndex: (useServerPagination ? serverPagination.currentPage : tableState.page) - 1,
        pageSize: useServerPagination ? serverPagination.pageSize : tableState.pageSize,
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
      <SortableDataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        pageCount={totalPages}
        currentPage={useServerPagination ? serverPagination.currentPage : tableState.page}
        pageSize={useServerPagination ? serverPagination.pageSize : tableState.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        totalItems={totalItems}
      />
    </div>
  );
}

