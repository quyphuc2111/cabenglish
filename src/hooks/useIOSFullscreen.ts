import { useEffect, useCallback, RefObject } from 'react';

interface UseIOSFullscreenProps {
  containerRef: RefObject<HTMLDivElement>;
  iframeRef: RefObject<HTMLIFrameElement>;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

export const useIOSFullscreen = ({
  containerRef,
  iframeRef,
  isFullscreen,
  setIsFullscreen
}: UseIOSFullscreenProps) => {
  // Phát hiện iOS
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  };

  const isSafari = () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  };

  // Xử lý vào fullscreen
  const enterFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    
    if (isIOS() || isSafari()) {
      // Lưu trạng thái hiện tại
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Lưu attributes
      element.setAttribute('data-prev-position', element.style.position || '');
      element.setAttribute('data-prev-top', element.style.top || '');
      element.setAttribute('data-prev-left', element.style.left || '');
      element.setAttribute('data-prev-width', element.style.width || '');
      element.setAttribute('data-prev-height', element.style.height || '');
      element.setAttribute('data-prev-zindex', element.style.zIndex || '');
      element.setAttribute('data-scroll-y', scrollY.toString());
      element.setAttribute('data-scroll-x', scrollX.toString());
      
      // Apply fullscreen styles
      Object.assign(element.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '99999',
        backgroundColor: 'white',
        margin: '0',
        padding: '0',
        border: 'none',
        borderRadius: '0',
        transform: 'none',
        webkitTransform: 'none'
      });
      
      // Lock body scroll
      document.body.style.cssText = `
        overflow: hidden !important;
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
        top: 0 !important;
        left: 0 !important;
      `;
      
      document.documentElement.style.overflow = 'hidden';
      
      // Update viewport meta
      let viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('data-prev-content', viewport.getAttribute('content') || '');
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      } else {
        // Create viewport meta if doesn't exist
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        document.head.appendChild(viewport);
      }
      
      // Add classes
      element.classList.add('ios-fullscreen-wrapper');
      document.body.classList.add('ios-fullscreen-active');
      
      // Force minimal UI (ẩn thanh địa chỉ)
      requestAnimationFrame(() => {
        // Scroll down 1px để trigger minimal UI
        window.scrollTo(0, 1);
        
        // Sau đó reset về 0
        setTimeout(() => {
          window.scrollTo(0, 0);
          
      // Update iframe nếu có
      if (iframeRef.current) {
        // Phát hiện iPhone 16 Pro Max
        const isIPhone16ProMax = window.screen.width === 430 && window.screen.height === 932;
        const isLandscape = window.orientation === 90 || window.orientation === -90;
        
        if (isIPhone16ProMax) {
          // iPhone 16 Pro Max có Dynamic Island
          const topInset = isLandscape ? '0' : '59px'; // 59px cho Dynamic Island + status bar
          const bottomInset = isLandscape ? '0' : '34px'; // 34px cho home indicator
          const sideInset = isLandscape ? '59px' : '0'; // 59px cho Dynamic Island ở cạnh khi landscape
          
          Object.assign(iframeRef.current.style, {
            position: 'absolute',
            top: topInset,
            left: isLandscape ? sideInset : '0',
            right: isLandscape ? sideInset : '0',
            bottom: bottomInset,
            width: isLandscape ? `calc(100vw - ${parseInt(sideInset) * 2}px)` : '100vw',
            height: isLandscape ? '100vh' : `calc(100vh - ${parseInt(topInset) + parseInt(bottomInset)}px)`,
            zIndex: '1',
            boxSizing: 'border-box'
          });
        } else {
          // Các iPhone khác
          Object.assign(iframeRef.current.style, {
            position: 'absolute',
            top: 'env(safe-area-inset-top, 0)',
            left: 'env(safe-area-inset-left, 0)',
            right: 'env(safe-area-inset-right, 0)',
            bottom: 'env(safe-area-inset-bottom, 0)',
            width: 'calc(100vw - env(safe-area-inset-left, 0) - env(safe-area-inset-right, 0))',
            height: 'calc(100vh - env(safe-area-inset-top, 0) - env(safe-area-inset-bottom, 0))',
            zIndex: '1',
            boxSizing: 'border-box'
          });
        }
        
        // Trigger resize trong iframe
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.dispatchEvent(new Event('resize'));
        }
      }
        }, 100);
      });
      
    } else {
      // Fallback cho các trình duyệt khác
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    }
    
    setIsFullscreen(true);
  }, [containerRef, iframeRef, setIsFullscreen]);

  // Xử lý thoát fullscreen
  const exitFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    
    if (isIOS() || isSafari()) {
      // Khôi phục styles
      element.style.position = element.getAttribute('data-prev-position') || '';
      element.style.top = element.getAttribute('data-prev-top') || '';
      element.style.left = element.getAttribute('data-prev-left') || '';
      element.style.width = element.getAttribute('data-prev-width') || '';
      element.style.height = element.getAttribute('data-prev-height') || '';
      element.style.zIndex = element.getAttribute('data-prev-zindex') || '';
      element.style.backgroundColor = '';
      element.style.margin = '';
      element.style.padding = '';
      element.style.border = '';
      element.style.borderRadius = '';
      element.style.transform = '';
      
      // Khôi phục scroll position
      const scrollY = element.getAttribute('data-scroll-y');
      const scrollX = element.getAttribute('data-scroll-x');
      
      // Xóa attributes
      ['data-prev-position', 'data-prev-top', 'data-prev-left', 
       'data-prev-width', 'data-prev-height', 'data-prev-zindex',
       'data-scroll-y', 'data-scroll-x'].forEach(attr => {
        element.removeAttribute(attr);
      });
      
      // Unlock body scroll
      document.body.style.cssText = '';
      document.documentElement.style.overflow = '';
      
      // Khôi phục viewport
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        const prevContent = viewport.getAttribute('data-prev-content');
        if (prevContent) {
          viewport.setAttribute('content', prevContent);
          viewport.removeAttribute('data-prev-content');
        }
      }
      
      // Remove classes
      element.classList.remove('ios-fullscreen-wrapper');
      document.body.classList.remove('ios-fullscreen-active');
      
      // Reset iframe styles
      if (iframeRef.current) {
        iframeRef.current.style.cssText = '';
        
        // Trigger resize
        if (iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.dispatchEvent(new Event('resize'));
        }
      }
      
      // Khôi phục scroll position
      if (scrollY && scrollX) {
        requestAnimationFrame(() => {
          window.scrollTo(parseInt(scrollX), parseInt(scrollY));
        });
      }
      
    } else {
      // Standard fullscreen API
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if ((document as any).webkitFullscreenElement) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozFullScreenElement) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msFullscreenElement) {
        (document as any).msExitFullscreen();
      }
    }
    
    setIsFullscreen(false);
  }, [containerRef, iframeRef, setIsFullscreen]);

  // Handle orientation change
  useEffect(() => {
    if (!isFullscreen || !isIOS()) return;

    const handleOrientationChange = () => {
      if (containerRef.current && isFullscreen) {
        // Re-apply fullscreen dimensions
        Object.assign(containerRef.current.style, {
          width: '100vw',
          height: '100vh'
        });

        // Re-trigger minimal UI
        requestAnimationFrame(() => {
          window.scrollTo(0, 1);
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
        });

        // Update iframe
        if (iframeRef.current) {
          // Phát hiện iPhone 16 Pro Max và orientation
          const isIPhone16ProMax = window.screen.width === 430 && window.screen.height === 932;
          const isLandscape = window.orientation === 90 || window.orientation === -90;
          
          if (isIPhone16ProMax) {
            const topInset = isLandscape ? '0' : '59px';
            const bottomInset = isLandscape ? '0' : '34px';
            const sideInset = isLandscape ? '59px' : '0';
            
            Object.assign(iframeRef.current.style, {
              position: 'absolute',
              top: topInset,
              left: isLandscape ? sideInset : '0',
              right: isLandscape ? sideInset : '0',
              bottom: bottomInset,
              width: isLandscape ? `calc(100vw - ${parseInt(sideInset) * 2}px)` : '100vw',
              height: isLandscape ? '100vh' : `calc(100vh - ${parseInt(topInset) + parseInt(bottomInset)}px)`,
              boxSizing: 'border-box'
            });
          } else {
            Object.assign(iframeRef.current.style, {
              width: 'calc(100vw - env(safe-area-inset-left, 0) - env(safe-area-inset-right, 0))',
              height: 'calc(100vh - env(safe-area-inset-top, 0) - env(safe-area-inset-bottom, 0))'
            });
          }
          
          if (iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.dispatchEvent(new Event('resize'));
          }
        }
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [isFullscreen, containerRef, iframeRef]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isFullscreen, exitFullscreen]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (!isCurrentlyFullscreen && isFullscreen && !isIOS()) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isFullscreen, setIsFullscreen]);

  return {
    enterFullscreen,
    exitFullscreen,
    isIOS: isIOS(),
    isSafari: isSafari()
  };
};