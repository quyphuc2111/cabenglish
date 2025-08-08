"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  memoryUsage?: number;
  componentName: string;
}

interface PerformanceMonitorProps {
  componentName: string;
  children: React.ReactNode;
  enabled?: boolean;
}

export function PerformanceMonitor({ 
  componentName, 
  children, 
  enabled = process.env.NODE_ENV === 'development' 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    componentName
  });
  
  const [showMetrics, setShowMetrics] = useState(false);
  const renderTimes = useRef<number[]>([]);
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;
    
    startTime.current = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;
      
      renderTimes.current.push(renderTime);
      if (renderTimes.current.length > 10) {
        renderTimes.current.shift(); // Keep only last 10 renders
      }
      
      const averageTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
      
      setMetrics(prev => ({
        ...prev,
        renderCount: prev.renderCount + 1,
        lastRenderTime: renderTime,
        averageRenderTime: averageTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
      }));
    };
  });

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      
      {/* Performance Toggle Button */}
      <button
        onClick={() => setShowMetrics(!showMetrics)}
        className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        title="Toggle Performance Metrics"
      >
        📊
      </button>

      {/* Performance Metrics Panel */}
      <AnimatePresence>
        {showMetrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 right-4 z-50 bg-black/90 text-white p-4 rounded-lg shadow-xl max-w-sm"
          >
            <h3 className="font-bold mb-2 text-yellow-400">
              Performance: {componentName}
            </h3>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Renders:</span>
                <span className="font-mono">{metrics.renderCount}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Last Render:</span>
                <span className={`font-mono ${metrics.lastRenderTime > 16 ? 'text-red-400' : 'text-green-400'}`}>
                  {metrics.lastRenderTime.toFixed(2)}ms
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Avg Render:</span>
                <span className={`font-mono ${metrics.averageRenderTime > 16 ? 'text-red-400' : 'text-green-400'}`}>
                  {metrics.averageRenderTime.toFixed(2)}ms
                </span>
              </div>
              
              {metrics.memoryUsage && (
                <div className="flex justify-between">
                  <span>Memory:</span>
                  <span className="font-mono">
                    {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>
              )}
              
              <div className="mt-2 pt-2 border-t border-gray-600">
                <div className="flex justify-between text-xs">
                  <span>Status:</span>
                  <span className={metrics.averageRenderTime > 16 ? 'text-red-400' : 'text-green-400'}>
                    {metrics.averageRenderTime > 16 ? 'SLOW' : 'GOOD'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook để monitor performance của custom hooks
export function usePerformanceMonitor(hookName: string, enabled = process.env.NODE_ENV === 'development') {
  const renderCount = useRef(0);
  const startTime = useRef(0);
  
  useEffect(() => {
    if (!enabled) return;
    
    renderCount.current++;
    startTime.current = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime.current;
      
      if (duration > 5) { // Log if hook takes more than 5ms
        console.log(`🐌 Hook ${hookName} took ${duration.toFixed(2)}ms (render #${renderCount.current})`);
      }
    };
  });
  
  return {
    renderCount: renderCount.current,
    logPerformance: (operation: string, fn: () => any) => {
      if (!enabled) return fn();
      
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      
      console.log(`⚡ ${hookName}.${operation} took ${(end - start).toFixed(2)}ms`);
      return result;
    }
  };
}

// Component để hiển thị global performance stats
export function GlobalPerformanceStats() {
  const [stats, setStats] = useState({
    fps: 0,
    memoryUsage: 0,
    renderCount: 0
  });
  
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    
    const updateStats = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setStats(prev => ({
          fps: Math.round((frameCount * 1000) / (currentTime - lastTime)),
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
          renderCount: prev.renderCount + frameCount
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(updateStats);
    };
    
    requestAnimationFrame(updateStats);
  }, []);
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-2 rounded text-xs font-mono">
      <div>FPS: {stats.fps}</div>
      <div>Memory: {(stats.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
      <div>Renders: {stats.renderCount}</div>
    </div>
  );
}
