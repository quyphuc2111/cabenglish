import React from "react";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full space-y-4">
      {/* Animated loading dots */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-bounce"></div>
      </div>
      
      {/* Spinning circle with gradient */}
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
      </div>
      
      {/* Loading text with fade animation */}
      <div className="text-center">
        <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
          Đang tải...
        </p>
        <p className="text-sm text-gray-500 mt-1 animate-pulse">
          Vui lòng chờ trong giây lát
        </p>
      </div>
      
      {/* Progress bar animation */}
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};