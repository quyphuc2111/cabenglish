import { useEffect, useRef } from 'react';

interface UseImagePreloaderOptions {
  enabled?: boolean;
  priority?: boolean;
  quality?: number;
}

/**
 * Hook để preload images cho carousel để giảm lag khi scroll
 */
export function useImagePreloader(
  imageUrls: string[],
  options: UseImagePreloaderOptions = {}
) {
  const { enabled = true, priority = false, quality = 75 } = options;
  const preloadedRef = useRef(new Set<string>());

  useEffect(() => {
    if (!enabled || imageUrls.length === 0) return;

    const preloadImages = async () => {
      // Preload first 3 images immediately
      const immediateUrls = imageUrls.slice(0, 3);
      const deferredUrls = imageUrls.slice(3);

      // Preload immediate images
      immediateUrls.forEach(url => {
        if (!preloadedRef.current.has(url)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = url;
          if (priority) {
            link.fetchPriority = 'high';
          }
          document.head.appendChild(link);
          preloadedRef.current.add(url);
        }
      });

      // Preload remaining images with delay
      if (deferredUrls.length > 0) {
        setTimeout(() => {
          deferredUrls.forEach(url => {
            if (!preloadedRef.current.has(url)) {
              const img = new Image();
              img.src = url;
              preloadedRef.current.add(url);
            }
          });
        }, 100);
      }
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadImages);
    } else {
      setTimeout(preloadImages, 0);
    }
  }, [imageUrls, enabled, priority, quality]);

  return {
    isPreloaded: (url: string) => preloadedRef.current.has(url)
  };
}

/**
 * Hook để preload images trong viewport với Intersection Observer
 */
export function useViewportImagePreloader(
  containerRef: React.RefObject<HTMLElement>,
  options: UseImagePreloaderOptions = {}
) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const images = entry.target.querySelectorAll('img[data-src]');
            images.forEach(img => {
              const imgElement = img as HTMLImageElement;
              if (imgElement.dataset.src) {
                imgElement.src = imgElement.dataset.src;
                imgElement.removeAttribute('data-src');
              }
            });
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    const items = containerRef.current.querySelectorAll('[data-carousel-item]');
    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [containerRef, enabled]);
}
