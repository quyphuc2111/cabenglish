import { useState, useEffect } from 'react';

export function useImageValidation(imageUrl: string) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl || imageUrl.trim() === '') {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

    // Reset states when URL changes
    setIsLoading(true);
    setIsValid(null);

    const img = new Image();
    
    img.onload = () => {
      setIsValid(true);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setIsValid(false);
      setIsLoading(false);
    };
    
    img.src = imageUrl;

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  return { isValid, isLoading };
} 