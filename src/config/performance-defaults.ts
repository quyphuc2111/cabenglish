/**
 * Default Performance Configuration
 * Auto-generated optimized settings for low CPU usage
 */

export const DefaultPerformanceConfig = {
  "enableFramerMotion": false,
  "enableAnimations": false,
  "enableSwiper": true,
  "enableIntersectionObserver": true,
  "enableLazyLoading": true,
  "enableBroadcastSync": false,
  "enablePerformanceStats": false,
  "staticMode": false,
  "reducedMotion": true
};

// Apply config to localStorage on app start
export const applyDefaultPerformanceConfig = () => {
  if (typeof window === 'undefined') return;
  
  // Only set if not already configured by user
  Object.entries(DefaultPerformanceConfig).forEach(([key, value]) => {
    const storageKey = key.replace('enable', 'enable').replace('Enable', 'enable');
    
    if (localStorage.getItem(storageKey) === null) {
      localStorage.setItem(storageKey, String(value));
    }
  });
  
  console.log('🎯 Default performance config applied');
};
