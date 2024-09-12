import { useState, useEffect } from 'react';

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({
    alpha: null,
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const handleOrientation = (event: any) => {
        setOrientation({
          alpha: event.alpha,  
          beta: event.beta,    
          gamma: event.gamma, 
        });
      };
      window.addEventListener('deviceorientation', handleOrientation, true);

      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  return orientation;
}
