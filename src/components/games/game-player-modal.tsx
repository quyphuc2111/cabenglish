"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Game } from "@/types/game";

interface GamePlayerModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayTimeUpdate?: (gameId: number, playTime: number) => void;
}

export function GamePlayerModal({
  game,
  isOpen,
  onClose,
  onPlayTimeUpdate
}: GamePlayerModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start tracking play time when modal opens
  useEffect(() => {
    if (isOpen && game) {
      startTimeRef.current = Date.now();
      setPlayTime(0);

      // Update play time every second
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setPlayTime(elapsed);
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isOpen, game]);

  // Handle back button / escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    const handlePopState = () => {
      if (isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("popstate", handlePopState);
      
      // Prevent body scroll
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("popstate", handlePopState);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  // Auto fullscreen on mobile
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setIsFullscreen(true);
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    // Save play time before closing
    if (game && playTime > 0 && onPlayTimeUpdate) {
      onPlayTimeUpdate(game.gameId, playTime);
    }

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsLoading(true);
    setIsFullscreen(false);
    setPlayTime(0);
    onClose();
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // Format play time (MM:SS)
  const formatPlayTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen || !game) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        ref={containerRef}
        className={cn(
          "fixed z-50 bg-white",
          isFullscreen
            ? "inset-0"
            : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[90vh] md:w-[90vw] md:h-[85vh] rounded-2xl shadow-2xl"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <span className="text-2xl">🎮</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg line-clamp-1">{game.gameNameVi}</h3>
              <p className="text-xs text-blue-100">
                Thời gian chơi: {formatPlayTime(playTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              title="Đóng"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Game Content */}
        <div className="relative w-full h-[calc(100%-4rem)] bg-gray-900">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 z-10">
              <div className="relative mb-4">
                <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-blue-200 rounded-full animate-ping" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-800 mb-2">
                Đang tải trò chơi...
              </p>
              <p className="text-sm text-gray-600">
                Vui lòng đợi trong giây lát 🎮
              </p>
              
              {/* Loading Progress Bar */}
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" 
                     style={{ width: "100%" }} />
              </div>
            </div>
          )}

          {/* Game Iframe */}
          <iframe
            ref={iframeRef}
            src={game.urlGame}
            title={game.gameNameVi}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        </div>

        {/* Mobile Instructions (only show on mobile when not fullscreen) */}
        {!isFullscreen && (
          <div className="md:hidden absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm text-white p-3 rounded-xl text-xs">
            <p className="text-center">
              💡 Nhấn nút <strong>Toàn màn hình</strong> để có trải nghiệm tốt nhất
            </p>
          </div>
        )}
      </div>
    </>
  );
}

