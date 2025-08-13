import React from "react";
import { cn } from "@/lib/utils";

interface DashboardLoadingProps {
  className?: string;
  showProgress?: boolean;
  message?: string;
}

// Skeleton component for reusability
const Skeleton = ({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
        className
      )}
      style={{
        animation: "shimmer 2s infinite linear"
      }}
      {...props}
    />
  );
};

// Current and Next Lecture Skeleton
const CurrentLecturesSkeleton = () => (
  <div className="w-full overflow-hidden py-2 min-w-0">
    <div className="relative z-10 p-3 sm:p-4 md:p-6 bg-white rounded-tr-xl">
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8 xl:gap-12 min-w-0">
        {/* Current Lectures */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <Skeleton className="h-20 w-full rounded-lg mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden xl:block border-r-2 border-gray-200"></div>

        {/* Next Lectures */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Lecture Favourite List Skeleton
const LectureFavouriteListSkeleton = () => (
  <div className="w-full bg-white rounded-3xl overflow-hidden">
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-6 w-40" />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4">
            <Skeleton className="h-32 w-full rounded-lg mb-3" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2 mb-3" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Teaching Progress Skeleton
const TeachingProgressSkeleton = () => (
  <div className="w-full bg-white rounded-3xl overflow-hidden">
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>

      {/* Progress Chart */}
      <div className="bg-gray-50 rounded-xl p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

// Main Dashboard Loading Component
export const DashboardLoading: React.FC<DashboardLoadingProps> = ({
  className,
  showProgress = true,
  message = "Đang tải dữ liệu dashboard..."
}) => {
  return (
    <>
      {/* Add shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
      
      <div className={cn("w-full space-y-6", className)}>
        {/* Progress indicator */}
        {showProgress && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">{message}</p>
          </div>
        )}

        {/* Dashboard skeleton layout */}
        <div className="w-full flex flex-wrap gap-4">
          {/* Current and Next Lectures */}
          <CurrentLecturesSkeleton />
          
          {/* Lecture Favourite List */}
          <LectureFavouriteListSkeleton />
          
          {/* Teaching Progress */}
          <TeachingProgressSkeleton />
        </div>
      </div>
    </>
  );
};

// Simple loading component for backward compatibility
export const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
};

export default DashboardLoading;
