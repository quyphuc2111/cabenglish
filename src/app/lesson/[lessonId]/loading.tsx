import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-[url('/assets/bg_classroom.webp')] w-screen h-screen bg-no-repeat bg-cover bg-left relative overflow-hidden pb-10 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
        <p className="text-lg font-semibold text-gray-700">Đang tải bài học...</p>
      </div>
    </div>
  );
} 