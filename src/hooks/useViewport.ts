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
    };

    // Set initial value
    setVH();

    // Update on resize and orientation change
    const handleResize = () => {
      // Debounce để tránh quá nhiều update
      setTimeout(setVH, 100);
    };

    const handleOrientationChange = () => {
      // Delay để đảm bảo orientation đã thay đổi hoàn toàn
      setTimeout(setVH, 300);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
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
