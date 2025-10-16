/**
 * Toast Animation Utilities
 * 
 * Helper functions để điều chỉnh toast animation speeds dynamically
 */

export type ToastAnimationSpeed = 'fast' | 'normal' | 'slow' | 'very-slow' | 'custom';

export interface ToastAnimationConfig {
  animation?: number;
  transition?: number;
  enter?: number;
  exit?: number;
}

/**
 * Animation speed presets (in milliseconds)
 */
export const ANIMATION_SPEEDS = {
  fast: 300,
  normal: 500,
  slow: 800,
  'very-slow': 1200
} as const;

/**
 * Set toast animation speed globally
 * 
 * @example
 * ```typescript
 * // Use preset
 * setToastAnimationSpeed('slow'); // 800ms
 * 
 * // Use custom duration
 * setToastAnimationSpeed('custom', {
 *   animation: 600,
 *   enter: 400,
 *   exit: 800
 * });
 * ```
 */
export function setToastAnimationSpeed(
  speed: ToastAnimationSpeed,
  customConfig?: ToastAnimationConfig
): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (speed === 'custom' && customConfig) {
    const { animation, transition, enter, exit } = customConfig;
    
    if (animation) root.style.setProperty('--toast-animation-duration', `${animation}ms`);
    if (transition) root.style.setProperty('--toast-transition-duration', `${transition}ms`);
    if (enter) root.style.setProperty('--toast-enter-duration', `${enter}ms`);
    if (exit) root.style.setProperty('--toast-exit-duration', `${exit}ms`);
  } else if (speed in ANIMATION_SPEEDS) {
    const duration = ANIMATION_SPEEDS[speed as keyof typeof ANIMATION_SPEEDS];
    root.style.setProperty('--toast-animation-duration', `${duration}ms`);
    root.style.setProperty('--toast-transition-duration', `${duration}ms`);
    root.style.setProperty('--toast-enter-duration', `${duration}ms`);
    root.style.setProperty('--toast-exit-duration', `${duration}ms`);
  }
}

/**
 * Apply animation speed class to body
 * 
 * @example
 * ```typescript
 * applyToastAnimationClass('slow');
 * ```
 */
export function applyToastAnimationClass(speed: Exclude<ToastAnimationSpeed, 'custom'>): void {
  if (typeof document === 'undefined') return;

  // Remove all animation classes
  document.body.classList.remove(
    'animation-fast',
    'animation-normal',
    'animation-slow',
    'animation-very-slow'
  );

  // Add new class
  document.body.classList.add(`animation-${speed}`);
}

/**
 * Get current toast animation duration
 * 
 * @returns Current animation duration in milliseconds
 */
export function getToastAnimationDuration(): number {
  if (typeof window === 'undefined') return ANIMATION_SPEEDS.slow;

  const root = document.documentElement;
  const duration = getComputedStyle(root).getPropertyValue('--toast-animation-duration');
  
  // Parse ms value (e.g., "800ms" -> 800)
  const match = duration.match(/(\d+)ms/);
  return match ? parseInt(match[1], 10) : ANIMATION_SPEEDS.slow;
}

/**
 * Save animation speed preference to localStorage
 * 
 * @example
 * ```typescript
 * saveToastSpeedPreference('slow');
 * ```
 */
export function saveToastSpeedPreference(speed: Exclude<ToastAnimationSpeed, 'custom'>): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('toast-animation-speed', speed);
  applyToastAnimationClass(speed);
}

/**
 * Load animation speed preference from localStorage
 * 
 * @returns Saved speed or 'slow' as default
 */
export function loadToastSpeedPreference(): Exclude<ToastAnimationSpeed, 'custom'> {
  if (typeof localStorage === 'undefined') return 'slow';
  
  const saved = localStorage.getItem('toast-animation-speed') as Exclude<ToastAnimationSpeed, 'custom'>;
  return saved && saved in ANIMATION_SPEEDS ? saved : 'slow';
}

/**
 * Initialize toast animations from user preference
 * Call this in your app initialization (e.g., _app.tsx, layout.tsx)
 * 
 * @example
 * ```typescript
 * useEffect(() => {
 *   initializeToastAnimations();
 * }, []);
 * ```
 */
export function initializeToastAnimations(): void {
  const preference = loadToastSpeedPreference();
  applyToastAnimationClass(preference);
}

/**
 * Temporarily change animation speed for specific action
 * Returns a cleanup function to restore previous speed
 * 
 * @example
 * ```typescript
 * const restore = temporaryToastSpeed('fast');
 * toast.success('Quick notification');
 * setTimeout(restore, 1000); // Restore after 1s
 * ```
 */
export function temporaryToastSpeed(speed: ToastAnimationSpeed, config?: ToastAnimationConfig): () => void {
  const current = {
    animation: getToastAnimationDuration(),
    transition: getToastAnimationDuration(),
    enter: getToastAnimationDuration(),
    exit: getToastAnimationDuration()
  };

  setToastAnimationSpeed(speed, config);

  return () => {
    setToastAnimationSpeed('custom', current);
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Apply animation speed based on user's motion preference
 * 
 * @example
 * ```typescript
 * useEffect(() => {
 *   applyMotionPreference();
 * }, []);
 * ```
 */
export function applyMotionPreference(): void {
  if (prefersReducedMotion()) {
    setToastAnimationSpeed('fast'); // Use fast animations for reduced motion
  } else {
    const preference = loadToastSpeedPreference();
    applyToastAnimationClass(preference);
  }
}

/**
 * Hook for React components
 */
export function useToastAnimationSpeed(speed?: ToastAnimationSpeed, config?: ToastAnimationConfig) {
  if (typeof window === 'undefined') return;

  const effectiveSpeed = speed || loadToastSpeedPreference();

  if (speed === 'custom' && config) {
    setToastAnimationSpeed('custom', config);
  } else if (effectiveSpeed !== 'custom') {
    applyToastAnimationClass(effectiveSpeed);
  }
}

