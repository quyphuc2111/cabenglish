/**
 * Performance Configuration
 * Centralized config để control performance optimizations
 */

// Check localStorage hoặc environment để enable/disable features
export const PerformanceConfig = {
  // Animation controls
  enableFramerMotion: typeof window !== 'undefined' 
    ? localStorage.getItem('disableFramerMotion') !== 'true'
    : true,
    
  enableAnimations: typeof window !== 'undefined'
    ? localStorage.getItem('disableAnimations') !== 'true' 
    : true,
    
  enableSwiper: typeof window !== 'undefined'
    ? localStorage.getItem('disableSwiper') !== 'true'
    : true,
    
  // Observer controls  
  enableIntersectionObserver: typeof window !== 'undefined'
    ? localStorage.getItem('disableObservers') !== 'true'
    : true,
    
  enableLazyLoading: typeof window !== 'undefined'
    ? localStorage.getItem('disableLazyLoading') !== 'true'
    : true,
    
  // Query controls
  enableBroadcastSync: typeof window !== 'undefined'
    ? localStorage.getItem('enableBroadcastSync') === 'true'
    : false, // Default disabled
    
  enablePerformanceStats: typeof window !== 'undefined'
    ? localStorage.getItem('enablePerformanceStats') === 'true'
    : false, // Default disabled
    
  // Static mode - disable all dynamic features
  staticMode: typeof window !== 'undefined'
    ? localStorage.getItem('staticMode') === 'true'
    : false,
    
  // Reduced motion
  reducedMotion: typeof window !== 'undefined'
    ? localStorage.getItem('reducedMotion') === 'true' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,

  // Essential UI animations (always enabled for UX)
  enableToastAnimations: true,
  enableModalAnimations: true,
  enableDialogAnimations: true,
};

// Animation variants based on performance config
export const getAnimationVariants = (variants: any) => {
  if (!PerformanceConfig.enableFramerMotion || 
      !PerformanceConfig.enableAnimations || 
      PerformanceConfig.reducedMotion ||
      PerformanceConfig.staticMode) {
    // Return static variants (no animation)
    return {
      initial: {},
      animate: {},
      exit: {},
      transition: { duration: 0 }
    };
  }
  return variants;
};

// Helper function to check if animations should be disabled
export const shouldDisableAnimations = () => {
  return !PerformanceConfig.enableFramerMotion ||
         !PerformanceConfig.enableAnimations ||
         PerformanceConfig.reducedMotion ||
         PerformanceConfig.staticMode;
};

// Swiper config based on performance
export const getSwiperConfig = (config: any) => {
  if (!PerformanceConfig.enableSwiper || PerformanceConfig.staticMode) {
    return {
      ...config,
      autoplay: false,
      observer: false,
      observeParents: false,
      watchSlidesProgress: false,
      watchSlidesVisibility: false,
      lazy: false,
      preloadImages: true,
      updateOnWindowResize: false,
      updateOnImagesReady: false,
    };
  }
  return config;
};

// Intersection Observer config
export const getIntersectionObserverConfig = (config: any) => {
  if (!PerformanceConfig.enableIntersectionObserver || PerformanceConfig.staticMode) {
    return null; // Disable intersection observer
  }
  return config;
};

// Performance monitoring
export const shouldEnablePerformanceMonitoring = () => {
  return PerformanceConfig.enablePerformanceStats && 
         process.env.NODE_ENV === 'development';
};

// CSS injection for reduced motion with essential UI exceptions
export const injectReducedMotionCSS = () => {
  if (typeof window === 'undefined') return;

  if (PerformanceConfig.reducedMotion || PerformanceConfig.staticMode) {
    const existingStyle = document.getElementById('reduced-motion-style');
    if (existingStyle) return;

    const style = document.createElement('style');
    style.id = 'reduced-motion-style';
    style.textContent = `
      /* Disable non-essential animations */
      .lesson-card, .lesson-card *,
      .course-swiper .swiper-slide,
      .book-swiper .swiper-slide {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }

      /* Keep essential UI animations */
      .Toastify__toast-container,
      .Toastify__toast,
      [role="dialog"],
      [data-state="open"],
      .notification-modal {
        animation-duration: 0.3s !important;
        transition-duration: 0.3s !important;
      }

      .motion-reduce {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Log performance config
export const logPerformanceConfig = () => {
  if (typeof window === 'undefined') return;

  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 Performance Config:', PerformanceConfig);
  }
};

export default PerformanceConfig;
