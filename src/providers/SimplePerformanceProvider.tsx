"use client";

import React, { useEffect, createContext, useContext } from "react";
import {
  PerformanceConfig,
  injectReducedMotionCSS,
  logPerformanceConfig
} from "@/config/performance";

interface PerformanceContextType {
  config: typeof PerformanceConfig;
}

const PerformanceContext = createContext<PerformanceContextType>({
  config: PerformanceConfig
});

export const usePerformance = () => useContext(PerformanceContext);

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export function SimplePerformanceProvider({
  children
}: PerformanceProviderProps) {
  useEffect(() => {
    // Inject reduced motion CSS
    injectReducedMotionCSS();

    // Add performance class to body
    if (
      !PerformanceConfig.enableAnimations ||
      PerformanceConfig.reducedMotion ||
      PerformanceConfig.staticMode
    ) {
      document.body.classList.add("performance-mode");
    }

    // Add static mode class if enabled
    if (PerformanceConfig.staticMode) {
      document.body.classList.add("static-mode");
    }

    // Always enable essential UI animations
    if (PerformanceConfig.enableToastAnimations) {
      document.body.classList.add("toast-enabled");
    }

    if (PerformanceConfig.enableModalAnimations) {
      document.body.classList.add("modal-enabled");
    }

    // Log performance config
    logPerformanceConfig();
  }, []);

  return (
    <PerformanceContext.Provider value={{ config: PerformanceConfig }}>
      {children}
    </PerformanceContext.Provider>
  );
}
