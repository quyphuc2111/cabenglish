import { useEffect } from "react";
import { useNavigationStore } from "@/store/navigationStore";

/**
 * Hook để xử lý việc khôi phục state khi quay lại từ trang khác
 * Sử dụng trong các trang có thể được quay lại từ lesson page
 */
export const useNavigationRestore = () => {
  const { previousPage, clearPreviousPage } = useNavigationStore();

  useEffect(() => {
    // Kiểm tra xem có đang quay lại từ lesson page không
    const isReturningFromLesson =
      typeof window !== "undefined" && document.referrer.includes("/lesson/");

    if (isReturningFromLesson && previousPage) {
      console.log("🔄 Restoring navigation state:", previousPage);

      // Có thể thêm logic khôi phục state ở đây nếu cần
      // Ví dụ: scroll position, active tab, etc.

      // Clear previous page info after restore
      setTimeout(() => {
        clearPreviousPage();
      }, 1000);
    }
  }, [previousPage, clearPreviousPage]);

  return {
    isReturningFromLesson: previousPage !== null,
    previousPageInfo: previousPage
  };
};
