"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameProgressProps {
  playedCount: number;
  totalCount: number;
  isFiltered?: boolean;
  filterLabel?: string;
  showAchievement?: boolean;
}

export function GameProgress({
  playedCount,
  totalCount,
  isFiltered = false,
  filterLabel,
  showAchievement = true
}: GameProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const progressPercent = totalCount > 0 ? Math.round((playedCount / totalCount) * 100) : 0;
  const isComplete = playedCount === totalCount && totalCount > 0;
  const hasNoGames = totalCount === 0;
  const hasNotStarted = playedCount === 0 && totalCount > 0;

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  // Show celebration when complete
  useEffect(() => {
    if (isComplete && showAchievement) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, showAchievement]);

  // Handle no games case
  if (hasNoGames) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <Sparkles className="w-6 h-6" />
          <p className="text-sm font-medium">Chưa có trò chơi nào để theo dõi</p>
        </div>
      </div>
    );
  }

  // Get message based on state
  const getMessage = () => {
    if (isComplete) {
      return "Chúc mừng! Bạn đã hoàn thành tất cả trò chơi";
    }
    if (hasNotStarted) {
      return "Hãy bắt đầu chơi game nhé!";
    }
    if (isFiltered && filterLabel) {
      return `trong chủ đề ${filterLabel}`;
    }
    return "trò chơi";
  };

  return (
    <div className="relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          <div className="animate-bounce">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  transform: `rotate(${i * 45}deg) translateY(-50px)`
                }}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={cn(
          "bg-gradient-to-br rounded-2xl p-5 shadow-course-inset border-2 relative overflow-hidden",
          isComplete
            ? "from-yellow-50 via-amber-50 to-orange-50 border-yellow-300"
            : hasNotStarted
            ? "from-blue-50 to-purple-50 border-blue-200"
            : "from-white to-blue-50/30 border-blue-100"
        )}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-2 rounded-lg shadow-md",
                isComplete
                  ? "bg-gradient-to-br from-yellow-500 to-amber-500"
                  : "bg-gradient-to-br from-blue-500 to-purple-500"
              )}
            >
              {isComplete ? (
                <Trophy className="w-5 h-5 text-white" />
              ) : (
                <Sparkles className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                {isFiltered ? "Tiến độ lọc" : "Tiến độ chơi game"}
              </h3>
              <p className="text-xs text-gray-600">
                {playedCount}/{totalCount} {getMessage()}
              </p>
            </div>
          </div>

          {/* Percentage Badge */}
          <div
            className={cn(
              "px-4 py-2 rounded-xl font-black text-lg shadow-md",
              isComplete
                ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
                : "bg-white text-gray-800 border-2 border-gray-200"
            )}
          >
            {progressPercent}%
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="relative">
          {/* Background Track */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            {/* Animated Fill */}
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                isComplete
                  ? "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500"
                  : hasNotStarted
                  ? "bg-gradient-to-r from-blue-300 to-purple-300"
                  : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              )}
              style={{ width: `${animatedProgress}%` }}
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-10">
              Đã chơi {playedCount}/{totalCount} games
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
            </div>
          )}
        </div>

        {/* Achievement Badge */}
        {isComplete && showAchievement && (
          <div className="mt-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-3 border-2 border-yellow-300">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-xs font-bold text-yellow-800">Thành tựu mở khóa!</p>
                <p className="text-xs text-yellow-700">Bậc thầy trò chơi 🎮</p>
              </div>
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

