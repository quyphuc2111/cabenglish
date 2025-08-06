import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PerformanceWrapperProps {
  children: ReactNode;
  variant?: "lesson-grid" | "lesson-card" | "filter" | "pagination" | "swiper";
  className?: string;
  enableTouch?: boolean;
  enableContentVisibility?: boolean;
  containLevel?: "layout" | "style" | "paint" | "all" | "none";
}

/**
 * PerformanceWrapper - Tối ưu hóa performance cho mobile với Tailwind CSS
 *
 * @param variant - Loại component cần tối ưu
 * @param enableTouch - Bật tối ưu touch cho mobile
 * @param enableContentVisibility - Bật content-visibility cho lazy loading
 * @param containLevel - Mức độ CSS containment
 */
export function PerformanceWrapper({
  children,
  variant = "lesson-card",
  className,
  enableTouch = true,
  enableContentVisibility = false,
  containLevel = "layout"
}: PerformanceWrapperProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "lesson-grid":
        return cn(
          "performance-contain-all",
          "performance-will-change-auto",
          enableContentVisibility && "performance-content-visibility"
        );

      case "lesson-card":
        return cn(
          "performance-no-layout-shift",
          enableTouch && "performance-touch-optimized",
          "md:hover:scale-105 md:transition-transform md:duration-200",
          "mobile:performance-no-motion"
        );

      case "filter":
        return cn(
          "performance-contain-layout",
          enableTouch && "performance-touch-optimized"
        );

      case "pagination":
        return cn(
          "performance-contain-style",
          enableTouch && "performance-touch-optimized"
        );

      case "swiper":
        return cn(
          "performance-contain-all",
          "performance-will-change-transform",
          "md:performance-will-change-auto"
        );

      default:
        return "";
    }
  };

  const getContainmentClasses = () => {
    switch (containLevel) {
      case "layout":
        return "performance-contain-layout";
      case "style":
        return "performance-contain-style";
      case "paint":
        return "performance-contain-paint";
      case "all":
        return "performance-contain-all";
      case "none":
        return "";
      default:
        return "performance-contain-layout";
    }
  };

  const wrapperClasses = cn(
    getVariantClasses(),
    getContainmentClasses(),
    // Mobile-specific optimizations
    "mobile:performance-text-fast",
    "mobile:performance-memory-light",
    className
  );

  return <div className={wrapperClasses}>{children}</div>;
}

// Hook để detect mobile device
export function useIsMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

// Performance utilities
export const performanceUtils = {
  // Debounce function cho mobile
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // RequestIdleCallback wrapper
  requestIdleCallback: (callback: () => void) => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(callback);
    } else {
      setTimeout(callback, 0);
    }
  },

  // Performance observer cho mobile
  observePerformance: () => {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "measure") {
            console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ["measure"] });
      return observer;
    }
    return null;
  }
};

export default PerformanceWrapper;
