"use client";

import React, { useState, useEffect } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useLessonData } from '@/hooks/useLessonData';
import { useDashboardData } from '@/hooks/useDashboardData';
import { PerformanceMonitor, usePerformanceMonitor } from './PerformanceMonitor';

interface OptimizationTestProps {
  userId: string;
}

export function OptimizationTest({ userId }: OptimizationTestProps) {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const { logPerformance } = usePerformanceMonitor('OptimizationTest');

  // Test hooks với performance monitoring
  const userInfoResult = useUserInfo(userId);
  const lessonDataResult = useLessonData(userId);
  const dashboardDataResult = useDashboardData(userId);

  const runPerformanceTest = async () => {
    setIsRunning(true);
    const results: any[] = [];
    
    // Test 1: Hook call frequency
    console.log('🧪 Testing hook call frequency...');
    const startTime = Date.now();
    
    // Simulate multiple component mounts/unmounts
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Log current state
      results.push({
        test: `Hook Call ${i + 1}`,
        userInfoLoading: userInfoResult.isLoading,
        lessonDataLoading: lessonDataResult.isLoading,
        dashboardLoading: dashboardDataResult.isLoading,
        timestamp: Date.now() - startTime
      });
    }
    
    // Test 2: Memory usage
    const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Simulate heavy operations
    logPerformance('HeavyOperation', () => {
      const largeArray = new Array(10000).fill(0).map((_, i) => ({ id: i, data: Math.random() }));
      return largeArray.length;
    });
    
    const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
    
    results.push({
      test: 'Memory Usage',
      memoryBefore: (memoryBefore / 1024 / 1024).toFixed(2) + 'MB',
      memoryAfter: (memoryAfter / 1024 / 1024).toFixed(2) + 'MB',
      memoryDiff: ((memoryAfter - memoryBefore) / 1024 / 1024).toFixed(2) + 'MB'
    });
    
    setTestResults(results);
    setIsRunning(false);
    
    console.log('✅ Performance test completed:', results);
  };

  const checkOptimizations = () => {
    const optimizations = [
      {
        name: 'useUserInfo Cache',
        status: userInfoResult.data ? 'CACHED' : 'LOADING',
        description: 'Should cache for 5 minutes'
      },
      {
        name: 'Lesson Data Cache', 
        status: lessonDataResult.allLessons?.length > 0 ? 'CACHED' : 'LOADING',
        description: 'Should cache for 3 minutes'
      },
      {
        name: 'Dashboard Data',
        status: dashboardDataResult.dashboardData ? 'LOADED' : 'LOADING',
        description: 'Should prevent duplicate calls'
      }
    ];
    
    return optimizations;
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <PerformanceMonitor componentName="OptimizationTest">
      <div className="fixed top-4 left-4 z-50 bg-white border border-gray-300 rounded-lg p-4 max-w-md shadow-lg">
        <h3 className="font-bold text-lg mb-3 text-blue-600">
          🚀 Performance Optimization Test
        </h3>
        
        {/* Optimization Status */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Optimization Status:</h4>
          {checkOptimizations().map((opt, index) => (
            <div key={index} className="flex justify-between text-sm mb-1">
              <span>{opt.name}:</span>
              <span className={`font-mono ${
                opt.status === 'CACHED' || opt.status === 'LOADED' 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`}>
                {opt.status}
              </span>
            </div>
          ))}
        </div>
        
        {/* Test Controls */}
        <div className="mb-4">
          <button
            onClick={runPerformanceTest}
            disabled={isRunning}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {isRunning ? 'Running Test...' : 'Run Performance Test'}
          </button>
        </div>
        
        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="max-h-40 overflow-y-auto">
            <h4 className="font-semibold mb-2">Test Results:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="text-xs mb-2 p-2 bg-gray-50 rounded">
                <div className="font-semibold">{result.test}</div>
                {Object.entries(result).map(([key, value]) => {
                  if (key === 'test') return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span className="font-mono">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
        
        {/* Performance Tips */}
        <div className="mt-4 text-xs text-gray-600">
          <div className="font-semibold mb-1">💡 Tips:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Check Network tab for reduced API calls</li>
            <li>Use React DevTools Profiler</li>
            <li>Monitor CPU in Task Manager</li>
            <li>Watch for cache hits in console</li>
          </ul>
        </div>
      </div>
    </PerformanceMonitor>
  );
}

// Hook để test performance của individual hooks
export function useOptimizationMetrics(hookName: string) {
  const [metrics, setMetrics] = useState({
    callCount: 0,
    lastCallTime: 0,
    averageCallTime: 0
  });
  
  const callTimes = React.useRef<number[]>([]);
  
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const callTime = endTime - startTime;
      
      callTimes.current.push(callTime);
      if (callTimes.current.length > 10) {
        callTimes.current.shift();
      }
      
      const averageTime = callTimes.current.reduce((a, b) => a + b, 0) / callTimes.current.length;
      
      setMetrics(prev => ({
        callCount: prev.callCount + 1,
        lastCallTime: callTime,
        averageCallTime: averageTime
      }));
      
      // Log slow hooks
      if (callTime > 10) {
        console.warn(`🐌 Slow hook detected: ${hookName} took ${callTime.toFixed(2)}ms`);
      }
    };
  });
  
  return metrics;
}
