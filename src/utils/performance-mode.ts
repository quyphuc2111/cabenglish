/**
 * Performance Mode Utilities
 * Cho phép bật/tắt các tính năng gây CPU cao
 */

export interface PerformanceSettings {
  enableAnimations: boolean;
  enableCountdown: boolean;
  enablePerformanceStats: boolean;
  enableWebSocket: boolean;
  enableAutoRefetch: boolean;
  reducedMotion: boolean;
}

const DEFAULT_SETTINGS: PerformanceSettings = {
  enableAnimations: true,
  enableCountdown: true,
  enablePerformanceStats: false,
  enableWebSocket: true,
  enableAutoRefetch: false, // Mặc định tắt auto refetch
  reducedMotion: false
};

const STORAGE_KEY = 'smartkids-performance-settings';

export class PerformanceManager {
  private static instance: PerformanceManager;
  private settings: PerformanceSettings;
  private listeners: Array<(settings: PerformanceSettings) => void> = [];

  private constructor() {
    this.settings = this.loadSettings();
    this.applySettings();
  }

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  private loadSettings(): PerformanceSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load performance settings:', error);
    }
    
    return DEFAULT_SETTINGS;
  }

  private saveSettings(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save performance settings:', error);
    }
  }

  private applySettings(): void {
    if (typeof window === 'undefined') return;

    // Apply CSS for reduced motion
    if (this.settings.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
      document.documentElement.style.setProperty('--transition-duration', '0s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
      document.documentElement.style.removeProperty('--transition-duration');
    }

    // Set localStorage flags for components to check
    localStorage.setItem('enableAnimations', String(this.settings.enableAnimations));
    localStorage.setItem('enableCountdown', String(this.settings.enableCountdown));
    localStorage.setItem('enablePerformanceStats', String(this.settings.enablePerformanceStats));
    localStorage.setItem('enableWebSocket', String(this.settings.enableWebSocket));
    localStorage.setItem('enableAutoRefetch', String(this.settings.enableAutoRefetch));
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.settings));
  }

  // Public methods
  getSettings(): PerformanceSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<PerformanceSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.applySettings();
    this.notifyListeners();
  }

  subscribe(listener: (settings: PerformanceSettings) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Preset modes
  enablePerformanceMode(): void {
    this.updateSettings({
      enableAnimations: false,
      enableCountdown: false,
      enablePerformanceStats: false,
      enableAutoRefetch: false,
      reducedMotion: true
    });
  }

  enableNormalMode(): void {
    this.updateSettings({
      enableAnimations: true,
      enableCountdown: true,
      enablePerformanceStats: false,
      enableAutoRefetch: false,
      reducedMotion: false
    });
  }

  enableDeveloperMode(): void {
    this.updateSettings({
      enableAnimations: true,
      enableCountdown: true,
      enablePerformanceStats: true,
      enableAutoRefetch: true,
      reducedMotion: false
    });
  }
}

// React hook
import { useState, useEffect } from 'react';

export function usePerformanceSettings() {
  const [settings, setSettings] = useState<PerformanceSettings>(
    PerformanceManager.getInstance().getSettings()
  );

  useEffect(() => {
    const manager = PerformanceManager.getInstance();
    const unsubscribe = manager.subscribe(setSettings);
    return unsubscribe;
  }, []);

  const updateSettings = (newSettings: Partial<PerformanceSettings>) => {
    PerformanceManager.getInstance().updateSettings(newSettings);
  };

  return {
    settings,
    updateSettings,
    enablePerformanceMode: () => PerformanceManager.getInstance().enablePerformanceMode(),
    enableNormalMode: () => PerformanceManager.getInstance().enableNormalMode(),
    enableDeveloperMode: () => PerformanceManager.getInstance().enableDeveloperMode(),
  };
}

// Utility functions
export function shouldEnableFeature(feature: keyof PerformanceSettings): boolean {
  if (typeof window === 'undefined') return true;
  
  const manager = PerformanceManager.getInstance();
  return manager.getSettings()[feature];
}

export function isPerformanceMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  const settings = PerformanceManager.getInstance().getSettings();
  return !settings.enableAnimations && !settings.enableCountdown && settings.reducedMotion;
}

// Auto-detect performance issues
export function autoDetectPerformanceIssues(): void {
  if (typeof window === 'undefined') return;

  // Check if device is low-end
  const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                        (navigator as any).deviceMemory <= 2;

  // Check if battery is low
  const checkBattery = async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        if (battery.level < 0.2 && !battery.charging) {
          console.log('🔋 Low battery detected, enabling performance mode');
          PerformanceManager.getInstance().enablePerformanceMode();
        }
      } catch (error) {
        // Battery API not supported
      }
    }
  };

  if (isLowEndDevice) {
    console.log('📱 Low-end device detected, enabling performance mode');
    PerformanceManager.getInstance().enablePerformanceMode();
  }

  checkBattery();
}

// Initialize on import
if (typeof window !== 'undefined') {
  // Auto-detect performance issues on page load
  setTimeout(autoDetectPerformanceIssues, 1000);
}
