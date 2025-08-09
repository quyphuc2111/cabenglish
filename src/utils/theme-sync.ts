/**
 * Theme Synchronization Utility
 * Enables theme sync across browser tabs for better UX
 */

// Enable BroadcastSync for theme changes
export const enableThemeSync = () => {
  if (typeof window !== 'undefined') {
    // Enable BroadcastSync in localStorage
    localStorage.setItem('enableBroadcastSync', 'true');
    console.log('✅ Theme sync enabled across tabs');
  }
};

// Disable BroadcastSync
export const disableThemeSync = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('enableBroadcastSync', 'false');
    console.log('❌ Theme sync disabled');
  }
};

// Check if theme sync is enabled
export const isThemeSyncEnabled = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('enableBroadcastSync') === 'true';
  }
  return false;
};

// Auto-enable theme sync on app start (optional)
export const initThemeSync = () => {
  if (typeof window !== 'undefined') {
    // Auto-enable if not set
    if (!localStorage.getItem('enableBroadcastSync')) {
      enableThemeSync();
    }
  }
};
