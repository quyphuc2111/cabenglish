"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Component để quản lý performance mode cho trang games
 * Tự động remove performance-mode class khi ở trang danh-sách-trò-chơi
 */
export function GamePerformanceManager() {
  const pathname = usePathname();

  useEffect(() => {
    const isGamesPage = pathname?.includes("/danh-sach-tro-choi");
    
    if (isGamesPage) {
      // Remove performance-mode class khi ở trang games
      document.body.classList.remove("performance-mode");
      
      // Cleanup: thêm lại khi rời khỏi trang
      return () => {
        document.body.classList.add("performance-mode");
      };
    }
  }, [pathname]);

  return null;
}

