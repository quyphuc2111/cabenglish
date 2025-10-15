"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn, validateImageUrl } from "@/lib/utils";
import { toast } from "react-toastify";
import { useLessonLike } from "@/hooks/client/useLesson";
import { Heart, Lock } from "lucide-react";

interface LessonCardV2Props {
  classId: number | string;
  unitId: number | string;
  lessonId: number | string;
  schoolWeekId: number | string;
  lessonName: string;
  classRoomName?: string;
  unitName?: string;
  imageUrl: string;
  schoolWeek?: number | string;
  progress: number;
  numLiked: number;
  isLocked: boolean;
  onClick?: () => void;
  onLikeUpdate?: (lessonId: number, newLikeCount: number) => void;
  className?: string;
}

export function LessonCardV2({
  unitName,
  imageUrl,
  schoolWeek,
  classRoomName,
  lessonName,
  progress,
  numLiked,
  isLocked,
  lessonId,
  onClick,
  onLikeUpdate,
  className,
}: LessonCardV2Props) {
  const { mutate: likeAction } = useLessonLike();
  const [isLiking, setIsLiking] = useState(false);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(numLiked);
  const lastActionTimeRef = useRef(0);

  useEffect(() => {
    setOptimisticLikeCount(numLiked);
  }, [numLiked]);

  const handleClick = useCallback(() => {
    if (isLocked) {
      toast.warning("Hãy hoàn thành bài học trước!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (onClick) onClick();
  }, [isLocked, onClick]);

  const handleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const now = Date.now();
      if (now - lastActionTimeRef.current < 1000 || isLiking) return;
      lastActionTimeRef.current = now;

      setIsLiking(true);
      const willLike = optimisticLikeCount === 0;
      const newLikeCount = willLike ? optimisticLikeCount + 1 : Math.max(0, optimisticLikeCount - 1);
      setOptimisticLikeCount(newLikeCount);

      likeAction(
        {
          lessonId: String(lessonId),
          action: willLike ? "like" : "unlike",
        },
        {
          onSuccess: () => {
            setIsLiking(false);
            if (onLikeUpdate) {
              onLikeUpdate(lessonId as number, newLikeCount);
            }
            toast.success(
              willLike ? `Đã thích "${lessonName}"! 💖` : `Đã bỏ thích "${lessonName}"`,
              {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
              }
            );
          },
          onError: () => {
            setIsLiking(false);
            setOptimisticLikeCount(numLiked);
            toast.error("Có lỗi xảy ra!");
          },
        }
      );
    },
    [isLiking, optimisticLikeCount, likeAction, lessonId, lessonName, numLiked, onLikeUpdate]
  );

  const progressPercent = Math.round((progress || 0) * 100);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative bg-white rounded-lg border-2 overflow-hidden transition-all duration-200",
        isLocked
          ? "opacity-60 cursor-not-allowed border-gray-200 bg-gray-50"
          : "cursor-pointer hover:shadow-lg hover:border-blue-300 border-gray-200",
        className
      )}
    >
      {/* Image Section - Compact */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={validateImageUrl(imageUrl)}
          alt={lessonName}
          fill
          className={cn(
            "object-cover transition-opacity duration-300",
            isLocked && "opacity-50"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
          loading="lazy"
          unoptimized
        />

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="bg-white/90 rounded-full p-2">
              <Lock className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        )}

        {/* Progress Badge - Top Right */}
        {progress > 0 && (
          <div className="absolute top-2 right-2">
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm",
              progress === 1
                ? "bg-green-500/90 text-white"
                : "bg-orange-500/90 text-white"
            )}>
              {progressPercent}%
            </div>
          </div>
        )}

        {/* Like Button - Top Left */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={cn(
            "absolute top-2 left-2 p-1.5 rounded-full backdrop-blur-sm transition-all",
            isLiking
              ? "cursor-not-allowed opacity-50"
              : "",
            optimisticLikeCount > 0
              ? "bg-red-500/90"
              : "bg-white/80 hover:bg-red-50"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-all",
              optimisticLikeCount > 0
                ? "fill-white text-white"
                : "text-gray-600"
            )}
          />
        </button>
      </div>

      {/* Content Section - Very Compact */}
      <div className="p-3 space-y-2">
        {/* Unit Name - Small */}
        {unitName && (
          <p className="text-xs text-gray-500 font-medium truncate">
            {unitName}
          </p>
        )}

        {/* Lesson Name - 2 Lines */}
        <h3 className="font-bold text-sm leading-tight line-clamp-2 min-h-[2.5em] text-gray-800">
          {lessonName}
        </h3>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          {schoolWeek && (
            <span className="text-xs text-gray-500">
              Tuần {schoolWeek}
            </span>
          )}
          {classRoomName && (
            <span className="text-xs text-gray-500 truncate max-w-[120px]">
              {classRoomName}
            </span>
          )}
          {optimisticLikeCount > 0 && (
            <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
              <Heart className="w-3 h-3 fill-current" />
              {optimisticLikeCount}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar - Bottom */}
      {progress > 0 && progress < 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Completed Indicator */}
      {progress === 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-500" />
      )}
    </div>
  );
}

