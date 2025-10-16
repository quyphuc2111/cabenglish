"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  applyToastAnimationClass,
  loadToastSpeedPreference,
  saveToastSpeedPreference,
  getToastAnimationDuration,
  setToastAnimationSpeed,
  type ToastAnimationSpeed,
  ANIMATION_SPEEDS
} from "@/utils/toast-animations";

/**
 * Toast Animation Settings Component
 * 
 * Component để test và configure toast animation speeds
 * Có thể dùng trong Settings page hoặc Admin Panel
 * 
 * @example
 * ```tsx
 * import ToastAnimationSettings from '@/components/toast-animation-settings';
 * 
 * function SettingsPage() {
 *   return (
 *     <div>
 *       <h1>Settings</h1>
 *       <ToastAnimationSettings />
 *     </div>
 *   );
 * }
 * ```
 */
export default function ToastAnimationSettings() {
  const [currentSpeed, setCurrentSpeed] = useState<Exclude<ToastAnimationSpeed, 'custom'>>('slow');
  const [customDuration, setCustomDuration] = useState(800);

  useEffect(() => {
    // Load saved preference
    const saved = loadToastSpeedPreference();
    setCurrentSpeed(saved);
    applyToastAnimationClass(saved);
  }, []);

  const handleSpeedChange = (speed: Exclude<ToastAnimationSpeed, 'custom'>) => {
    setCurrentSpeed(speed);
    saveToastSpeedPreference(speed);
    toast.info(`Animation speed: ${speed} (${ANIMATION_SPEEDS[speed]}ms)`, {
      autoClose: 3000
    });
  };

  const handleCustomDuration = (duration: number) => {
    setCustomDuration(duration);
    setToastAnimationSpeed('custom', {
      animation: duration,
      transition: duration,
      enter: duration,
      exit: duration
    });
  };

  const testToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: '✅ Thành công! Kiểm tra animation speed.',
      error: '❌ Lỗi! Đây là error message.',
      warning: '⚠️ Cảnh báo! Hãy chú ý.',
      info: 'ℹ️ Thông tin. Animation đang chạy với tốc độ hiện tại.'
    };

    toast[type](messages[type]);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="text-2xl font-bold mb-2">Toast Animation Settings</h2>
        <p className="text-gray-600">
          Configure toast animation speeds. Current duration: {getToastAnimationDuration()}ms
        </p>
      </div>

      {/* Preset Speeds */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Preset Speeds</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(ANIMATION_SPEEDS) as Array<keyof typeof ANIMATION_SPEEDS>).map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              className={`
                px-4 py-3 rounded-lg font-medium transition-all
                ${currentSpeed === speed
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <div className="text-sm capitalize">{speed.replace('-', ' ')}</div>
              <div className="text-xs opacity-75">{ANIMATION_SPEEDS[speed]}ms</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Duration */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Custom Duration</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={customDuration}
              onChange={(e) => handleCustomDuration(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-lg font-mono font-bold min-w-[80px]">
              {customDuration}ms
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Faster</span>
            <span>Slower</span>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Test Toasts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => testToast('success')}
            className="px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Success
          </button>
          <button
            onClick={() => testToast('error')}
            className="px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Error
          </button>
          <button
            onClick={() => testToast('warning')}
            className="px-4 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            Warning
          </button>
          <button
            onClick={() => testToast('info')}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Info
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Fast (300ms)</strong>: Quick notifications, counters</li>
          <li>• <strong>Normal (500ms)</strong>: Standard notifications</li>
          <li>• <strong>Slow (800ms)</strong>: Default - Error messages, confirmations</li>
          <li>• <strong>Very Slow (1200ms)</strong>: Accessibility, critical alerts</li>
        </ul>
      </div>
    </div>
  );
}

