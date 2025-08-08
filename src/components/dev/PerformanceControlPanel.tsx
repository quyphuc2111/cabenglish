"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformanceSettings } from '@/utils/performance-mode';

export function PerformanceControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    settings, 
    updateSettings, 
    enablePerformanceMode, 
    enableNormalMode, 
    enableDeveloperMode 
  } = usePerformanceSettings();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
        title="Performance Control Panel"
      >
        ⚡
      </button>

      {/* Control Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed bottom-16 left-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-xl max-w-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-purple-600">
                ⚡ Performance Control
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Preset Modes */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Quick Modes:</h4>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={enablePerformanceMode}
                  className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                >
                  🚀 Performance Mode (Low CPU)
                </button>
                <button
                  onClick={enableNormalMode}
                  className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                >
                  🎯 Normal Mode
                </button>
                <button
                  onClick={enableDeveloperMode}
                  className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
                >
                  🔧 Developer Mode
                </button>
              </div>
            </div>

            {/* Individual Settings */}
            <div className="space-y-3">
              <h4 className="font-semibold">Individual Settings:</h4>
              
              <label className="flex items-center justify-between">
                <span className="text-sm">Animations</span>
                <input
                  type="checkbox"
                  checked={settings.enableAnimations}
                  onChange={(e) => updateSettings({ enableAnimations: e.target.checked })}
                  className="ml-2"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm">Countdown Timer</span>
                <input
                  type="checkbox"
                  checked={settings.enableCountdown}
                  onChange={(e) => updateSettings({ enableCountdown: e.target.checked })}
                  className="ml-2"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm">Performance Stats</span>
                <input
                  type="checkbox"
                  checked={settings.enablePerformanceStats}
                  onChange={(e) => updateSettings({ enablePerformanceStats: e.target.checked })}
                  className="ml-2"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm">Auto Refetch</span>
                <input
                  type="checkbox"
                  checked={settings.enableAutoRefetch}
                  onChange={(e) => updateSettings({ enableAutoRefetch: e.target.checked })}
                  className="ml-2"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm">Reduced Motion</span>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                  className="ml-2"
                />
              </label>
            </div>

            {/* Current Status */}
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-sm mb-2">Current Status:</h4>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>CPU Impact:</span>
                  <span className={`font-bold ${
                    settings.enableAnimations && settings.enableCountdown && settings.enablePerformanceStats
                      ? 'text-red-600' 
                      : settings.enableAnimations || settings.enableCountdown
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}>
                    {settings.enableAnimations && settings.enableCountdown && settings.enablePerformanceStats
                      ? 'HIGH' 
                      : settings.enableAnimations || settings.enableCountdown
                      ? 'MEDIUM'
                      : 'LOW'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="font-bold">
                    {!settings.enableAnimations && !settings.enableCountdown && settings.reducedMotion
                      ? 'Performance'
                      : settings.enablePerformanceStats
                      ? 'Developer'
                      : 'Normal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-4 text-xs text-gray-600">
              <div className="font-semibold mb-1">💡 Tips:</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Use Performance Mode for low CPU usage</li>
                <li>Disable animations on slow devices</li>
                <li>Turn off auto-refetch to reduce network calls</li>
                <li>Enable reduced motion for accessibility</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// CPU Monitor Component
export function CPUMonitor() {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  React.useEffect(() => {
    if (!isMonitoring || process.env.NODE_ENV !== 'development') return;

    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitor = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const cpuEstimate = Math.max(0, Math.min(100, (60 - fps) * 2)); // Rough estimate
        setCpuUsage(cpuEstimate);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (document.visibilityState === 'visible') {
        requestAnimationFrame(monitor);
      }
    };
    
    requestAnimationFrame(monitor);
  }, [isMonitoring]);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/80 text-white p-2 rounded text-xs">
      <div className="flex items-center gap-2">
        <span>CPU:</span>
        <span className={`font-bold ${
          cpuUsage > 30 ? 'text-red-400' : 
          cpuUsage > 15 ? 'text-yellow-400' : 
          'text-green-400'
        }`}>
          {cpuUsage}%
        </span>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className="ml-2 px-1 bg-white/20 rounded"
        >
          {isMonitoring ? '⏸️' : '▶️'}
        </button>
      </div>
    </div>
  );
}
