import { useEffect, useState, useRef } from "react";

interface OptimizedIframeProps {
  src: string;
  title: string;
  isFullscreen: boolean;
  onLoad?: () => void;
  className?: string;
}

export function OptimizedIframe({
  src,
  title,
  isFullscreen,
  onLoad,
  className = ""
}: OptimizedIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Reset loading state when src changes
    setIsLoading(true);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  return (
    <div className="w-full h-full relative">
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="flex flex-col items-center gap-1">
            <div className="animate-spin rounded-full h-4 w-4 landscape:h-5 landscape:w-5 sm:h-6 sm:w-6 border-b-2 border-[#56B165]"></div>
            <p className="text-gray-500 text-[10px] landscape:text-xs sm:text-sm">
              Đang tải bài học...
            </p>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className={`w-full h-full border-none ${
          isFullscreen ? "rounded-none" : "rounded-t-md"
        } ${className}`}
        allowFullScreen
        allow="geolocation *; microphone *; camera *; midi *; encrypted-media *; autoplay *; clipboard-write *"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals allow-popups-to-escape-sandbox"
        loading="lazy"
        onLoad={handleLoad}
        style={{
          // Optimize for different orientations
          width: "100%",
          height: "100%",
          minHeight: isFullscreen ? "100vh" : "200px",
          maxHeight: "100%",
          display: "block"
        }}
      />
    </div>
  );
}
