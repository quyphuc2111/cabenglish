"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-[url('/assets/bg_classroom.webp')] w-screen h-screen bg-no-repeat bg-cover bg-left relative overflow-hidden pb-10 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center gap-4 max-w-md mx-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold text-gray-800">Có lỗi xảy ra</h2>
        <p className="text-gray-600 text-center">
          Không thể tải bài học. Vui lòng thử lại hoặc liên hệ admin.
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Thử lại
          </button>
          <button
            onClick={() => router.push("/lop-hoc")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Quay lại lớp học
          </button>
        </div>
      </div>
    </div>
  );
} 