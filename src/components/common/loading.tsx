import React from "react";

export const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-2">
        <div className="w-6 h-6 border-2 border-t-[#3EC474] border-r-[#3EC474] rounded-full animate-spin" />
        <span className="text-gray-700">Đang tải...</span>
      </div>
    </div>
  );
}; 