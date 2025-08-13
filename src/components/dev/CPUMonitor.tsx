"use client";

import React, { useState, useEffect } from 'react';

export function CPUMonitor() {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [frameTime, setFrameTime] = useState(0);

  useEffect(() => {
    if (!isMonitoring || process.env.NODE_ENV !== 'development') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let maxFrameTime = 0;
    
    const monitor = () => {
      const currentTime = performance.now();
      const frameTimeMs = currentTime - lastTime;
      
      frameCount++;
      maxFrameTime = Math.max(maxFrameTime, frameTimeMs);
      
      if (frameCount >= 60) { // Update every 60 frames (~1 second)
        const fps = Math.round((frameCount * 1000) / (currentTime - (lastTime - (frameCount - 1) * frameTimeMs)));
        
        // Estimate CPU usage based on frame time and FPS
        const cpuEstimate = Math.min(100, Math.max(0, 
          (maxFrameTime > 16 ? (maxFrameTime - 16) * 2 : 0) + 
          (fps < 60 ? (60 - fps) * 1.5 : 0)
        ));
        
        setCpuUsage(Math.round(cpuEstimate));
        setFrameTime(Math.round(maxFrameTime * 10) / 10);
        
        frameCount = 0;
        maxFrameTime = 0;
      }
      
      lastTime = currentTime;
      
      if (document.visibilityState === 'visible' && isMonitoring) {
        requestAnimationFrame(monitor);
      }
    };
    
    if (document.visibilityState === 'visible') {
      requestAnimationFrame(monitor);
    }
  }, [isMonitoring]);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/90 text-white p-3 rounded-lg shadow-xl">
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <span>CPU:</span>
            <span className={`font-bold text-lg ${
              cpuUsage > 25 ? 'text-red-400' : 
              cpuUsage > 15 ? 'text-yellow-400' : 
              'text-green-400'
            }`}>
              {cpuUsage}%
            </span>
          </div>
          <div className="text-xs text-gray-300">
            Frame: {frameTime}ms
          </div>
        </div>
        
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-2 py-1 rounded text-xs font-bold ${
            isMonitoring 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isMonitoring ? '⏸️ Stop' : '▶️ Start'}
        </button>
      </div>
      
      {isMonitoring && (
        <div className="mt-2 text-xs text-gray-300">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={
              cpuUsage > 25 ? 'text-red-400' : 
              cpuUsage > 15 ? 'text-yellow-400' : 
              'text-green-400'
            }>
              {cpuUsage > 25 ? 'HIGH' : cpuUsage > 15 ? 'MEDIUM' : 'LOW'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Target:</span>
            <span className="text-green-400">&lt;10%</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick toggle component
export function QuickCPUToggle() {
  const [showMonitor, setShowMonitor] = useState(false);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      <button
        onClick={() => setShowMonitor(!showMonitor)}
        className="fixed top-4 right-20 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        title="Toggle CPU Monitor"
      >
        📊
      </button>
      
      {showMonitor && <CPUMonitor />}
    </>
  );
}

// Background process detector
export function BackgroundProcessDetector() {
  const [processes, setProcesses] = useState<string[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const detected: string[] = [];
    
    // Check for common background processes
    if (localStorage.getItem('enablePerformanceStats') === 'true') {
      detected.push('Performance Stats');
    }
    
    if (localStorage.getItem('enableWebSocket') !== 'false') {
      detected.push('WebSocket');
    }
    
    if (localStorage.getItem('enableCountdown') !== 'false') {
      detected.push('Countdown Timer');
    }
    
    if (localStorage.getItem('enableAnimations') !== 'false') {
      detected.push('Animations');
    }
    
    // Check for intervals
    const originalSetInterval = window.setInterval;
    let intervalCount = 0;
    window.setInterval = function(...args) {
      intervalCount++;
      return originalSetInterval.apply(this, args);
    };
    
    setTimeout(() => {
      if (intervalCount > 0) {
        detected.push(`${intervalCount} Intervals`);
      }
      setProcesses(detected);
    }, 1000);
    
  }, []);

  if (process.env.NODE_ENV !== 'development' || processes.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-orange-500 text-white p-3 rounded-lg shadow-xl max-w-xs">
      <h4 className="font-bold text-sm mb-2">🔍 Background Processes:</h4>
      <ul className="text-xs space-y-1">
        {processes.map((process, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            {process}
          </li>
        ))}
      </ul>
      <div className="mt-2 text-xs">
        <button
          onClick={() => {
            localStorage.setItem('enablePerformanceStats', 'false');
            localStorage.setItem('enableWebSocket', 'false');
            localStorage.setItem('enableCountdown', 'false');
            localStorage.setItem('enableAnimations', 'false');
            location.reload();
          }}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
        >
          🚫 Disable All
        </button>
      </div>
    </div>
  );
}
