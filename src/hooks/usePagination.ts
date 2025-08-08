import { useState, useEffect, useRef } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export const usePagination = ({
  totalItems,
  itemsPerPage,
  initialPage = 1
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const prevInitialPageRef = useRef(initialPage);
  const isFirstRender = useRef(true);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle external initialPage changes (e.g., from navigation restore)
  useEffect(() => {
    // On first render, always use initialPage
    if (isFirstRender.current) {
      console.log("📄 usePagination: First render, setting page to:", initialPage);
      setCurrentPage(initialPage);
      prevInitialPageRef.current = initialPage;
      isFirstRender.current = false;
      return;
    }

    // For subsequent changes, only update if initialPage actually changed
    if (initialPage !== prevInitialPageRef.current) {
      console.log("📄 usePagination: External page change:", {
        from: prevInitialPageRef.current,
        to: initialPage
      });
      setCurrentPage(initialPage);
      prevInitialPageRef.current = initialPage;
    }
  }, [initialPage]);

  useEffect(() => {
    // Clamp current page when totalItems or itemsPerPage change, but do not reset unnecessarily
    setCurrentPage((prev) => {
      const maxPage = Math.max(1, Math.ceil(totalItems / itemsPerPage));
      return Math.max(1, Math.min(prev, maxPage));
    });
  }, [totalItems, itemsPerPage]);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex
  };
};