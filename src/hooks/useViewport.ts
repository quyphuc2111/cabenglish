import { useEffect, useState } from "react";

/**
 * Custom hook để xử lý viewport height trên mobile
 * Giải quyết vấn đề thanh địa chỉ của browser ảnh hưởng đến 100vh
 */
export function useViewportHeight() {
  useEffect(() => {
    const setVH = () => {
      // Tính toán chiều cao viewport thực tế
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      
      // Special handling for mobile landscape
      if (window.innerWidth > window.innerHeight && window.innerWidth <= 896) {
        // Mobile landscape mode
        document.documentElement.style.setProperty("--mobile-landscape", "true");
        document.documentElement.style.setProperty("--vh-landscape", `${vh}px`);
      } else {
        document.documentElement.style.setProperty("--mobile-landscape", "false");
      }
    };

    // Set initial value
    setVH();

    // Update on resize and orientation change
    const handleResize = () => {
      // Debounce để tránh quá nhiều update
      clearTimeout((window as any)._vhTimeout);
      (window as any)._vhTimeout = setTimeout(setVH, 100);
    };

    const handleOrientationChange = () => {
      // Delay để đảm bảo orientation đã thay đổi hoàn toàn
      // Increase delay for landscape change
      clearTimeout((window as any)._orientationTimeout);
      (window as any)._orientationTimeout = setTimeout(() => {
        setVH();
        // Force re-calculation after orientation change
        setTimeout(setVH, 100);
      }, 500);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    
    // Additional event for mobile browsers
    window.addEventListener("load", setVH);
    document.addEventListener("DOMContentLoaded", setVH);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("load", setVH);
      document.removeEventListener("DOMContentLoaded", setVH);
      clearTimeout((window as any)._vhTimeout);
      clearTimeout((window as any)._orientationTimeout);
    };
  }, []);
}

/**
 * Hook để detect device type và orientation
 */
export function useDeviceInfo() {
  const getDeviceInfo = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      isLandscape,
      isPortrait: !isLandscape,
      aspectRatio: width / height,
      width,
      height
    };
  };

  const [deviceInfo, setDeviceInfo] = useState(() => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLandscape: true,
        isPortrait: false,
        aspectRatio: 16/9,
        width: 1920,
        height: 1080
      };
    }
    return getDeviceInfo();
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return deviceInfo;
}
