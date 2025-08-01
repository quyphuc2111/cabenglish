// hooks/use-media-query.ts
import { useState, useEffect } from 'react';

/**
 * Custom hook to check if the current viewport matches the provided media query
 * @param query The media query to check, e.g. '(max-width: 640px)'
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with null and update after mount to prevent hydration mismatch
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Create a MediaQueryList object
    const mediaQuery = window.matchMedia(query);
    
    // Update the state with the current match
    setMatches(mediaQuery.matches);
    
    // Define a callback function to handle changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add the callback as a listener for changes to the media query
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);
  
  // Return false during SSR to prevent hydration mismatch
  return mounted ? matches : false;
}