"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useDebounce } from "./use-debounce";

interface FilterOptions {
  classId: string;
  unitId: string;
  userId: string;
  weekId?: string;
}

interface UseOptimizedFilterProps<T> {
  items: T[];
  initialFilters?: Partial<FilterOptions>;
  filterFn: (items: T[], filters: FilterOptions) => T[];
  debounceMs?: number;
}

export function useOptimizedFilter<T>({
  items,
  initialFilters = {},
  filterFn,
  debounceMs = 300
}: UseOptimizedFilterProps<T>) {
  const [filters, setFilters] = useState<FilterOptions>({
    classId: "",
    unitId: "",
    userId: "",
    weekId: "",
    ...initialFilters
  });

  const [isFiltering, setIsFiltering] = useState(false);

  // Debounce filter values để tránh quá nhiều filter operations
  const debouncedFilters = useDebounce(filters, debounceMs);

  // Memoized filtered results
  const filteredItems = useMemo(() => {
    if (!items?.length) return [];

    // Nếu không có filter nào được áp dụng, trả về toàn bộ items
    const hasActiveFilters = Object.values(debouncedFilters).some(
      (value) => value && String(value).trim() !== ""
    );

    if (!hasActiveFilters) {
      return items;
    }

    return filterFn(items, debouncedFilters);
  }, [items, debouncedFilters, filterFn]);

  // Update filter with optimistic UI updates
  const updateFilter = useCallback(
    (newFilters: Partial<FilterOptions>) => {
      setIsFiltering(true);
      setFilters((prev) => ({ ...prev, ...newFilters }));

      // Reset filtering state after debounce period
      setTimeout(() => setIsFiltering(false), debounceMs + 50);
    },
    [debounceMs]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      classId: "",
      unitId: "",
      userId: initialFilters.userId || "",
      weekId: ""
    });
  }, [initialFilters.userId]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(
      ([key, value]) => key !== "userId" && value && String(value).trim() !== ""
    ).length;
  }, [filters]);

  return {
    filters,
    filteredItems,
    isFiltering,
    activeFilterCount,
    updateFilter,
    resetFilters,
    setFilters
  };
}
