/**
 * Theme Performance Testing Utilities
 * Helps measure and optimize theme switching performance
 */

interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  operation: string;
}

class ThemePerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private currentOperation: PerformanceMetrics | null = null;

  startMeasure(operation: string) {
    this.currentOperation = {
      startTime: performance.now(),
      operation
    };
  }

  endMeasure() {
    if (!this.currentOperation) return;

    const endTime = performance.now();
    const duration = endTime - this.currentOperation.startTime;

    const metric: PerformanceMetrics = {
      ...this.currentOperation,
      endTime,
      duration
    };

    this.metrics.push(metric);
    this.currentOperation = null;

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 Theme Performance: ${metric.operation} took ${duration.toFixed(2)}ms`);
    }

    return metric;
  }

  getMetrics() {
    return this.metrics;
  }

  getAverageTime(operation: string) {
    const operationMetrics = this.metrics.filter(m => m.operation === operation);
    if (operationMetrics.length === 0) return 0;

    const totalTime = operationMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    return totalTime / operationMetrics.length;
  }

  clearMetrics() {
    this.metrics = [];
  }

  logSummary() {
    if (process.env.NODE_ENV !== 'development') return;

    console.group('🎨 Theme Performance Summary');
    
    const operations = [...new Set(this.metrics.map(m => m.operation))];
    
    operations.forEach(operation => {
      const avg = this.getAverageTime(operation);
      const count = this.metrics.filter(m => m.operation === operation).length;
      console.log(`${operation}: ${avg.toFixed(2)}ms average (${count} samples)`);
    });

    console.groupEnd();
  }
}

// Global instance
export const themePerformanceMonitor = new ThemePerformanceMonitor();

// Helper functions
export const measureThemeSwitch = () => {
  themePerformanceMonitor.startMeasure('Theme Switch');
};

export const measureThemeSwitchEnd = () => {
  return themePerformanceMonitor.endMeasure();
};

export const measureCacheUpdate = () => {
  themePerformanceMonitor.startMeasure('Cache Update');
};

export const measureCacheUpdateEnd = () => {
  return themePerformanceMonitor.endMeasure();
};

export const measureUIUpdate = () => {
  themePerformanceMonitor.startMeasure('UI Update');
};

export const measureUIUpdateEnd = () => {
  return themePerformanceMonitor.endMeasure();
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  THEME_SWITCH: 500, // ms - theme switch should be under 500ms
  CACHE_UPDATE: 100, // ms - cache update should be under 100ms
  UI_UPDATE: 200     // ms - UI update should be under 200ms
};

// Check if performance is acceptable
export const isPerformanceAcceptable = (operation: string, duration: number) => {
  const threshold = PERFORMANCE_THRESHOLDS[operation as keyof typeof PERFORMANCE_THRESHOLDS];
  return threshold ? duration <= threshold : true;
};

// Auto-log performance issues
export const checkPerformanceIssues = () => {
  const metrics = themePerformanceMonitor.getMetrics();
  const issues = metrics.filter(metric => {
    if (!metric.duration) return false;
    return !isPerformanceAcceptable(metric.operation, metric.duration);
  });

  if (issues.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Performance Issues Detected:');
    issues.forEach(issue => {
      console.warn(`${issue.operation}: ${issue.duration?.toFixed(2)}ms (threshold exceeded)`);
    });
  }

  return issues;
};
