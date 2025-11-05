"use client";

import { useState, useEffect } from "react";

type Orientation = "portrait" | "landscape";

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    if (typeof window === "undefined") return "portrait";
    // Xoay ngang: width > height, Xoay dọc: height > width
    return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      // Xoay ngang: width > height, Xoay dọc: height > width
      setOrientation(
        window.innerWidth > window.innerHeight ? "landscape" : "portrait"
      );
    };

    // Listen to both resize and orientationchange events
    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Initial check
    handleOrientationChange();

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return orientation;
}

