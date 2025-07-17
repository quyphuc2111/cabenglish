import React from 'react';
import OptimizeImage from "@/components/common/optimize-image";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useImageValidation } from "@/hooks/useImageValidation";

interface ImageUrlCellProps {
  imageUrl: string;
}

export function ImageUrlCell({ imageUrl }: ImageUrlCellProps) {
  const { isValid, isLoading } = useImageValidation(imageUrl);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
        <div className="text-sm text-gray-500">Đang kiểm tra...</div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-900 transition-colors duration-200 cursor-default">
          Đang tải
        </Badge>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
        <div className="text-sm text-gray-500">Đường dẫn ảnh không hợp lệ</div>
        <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:text-red-900 transition-colors duration-200 cursor-default">
          Lỗi
        </Badge>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
            <a 
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[400px] w-full transition-colors duration-200"
            >
              {imageUrl}
            </a>
            <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900 transition-colors duration-200 cursor-pointer">
              Hợp lệ
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="start"
          className="p-0 border-0 -translate-y-2"
        >
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <OptimizeImage
              src={imageUrl}
              width={300}
              height={200}
              alt="Preview"
              className="w-full h-auto"
              unoptimized={true}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 