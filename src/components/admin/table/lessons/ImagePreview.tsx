import React, { useCallback, memo } from "react";
import OptimizeImage from "@/components/common/optimize-image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ImagePreviewProps {
  imageUrl: string;
}

// Hàm kiểm tra URL hợp lệ
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const FALLBACK_IMAGE = "/assets/image/no_image.png";

const PreviewImage = memo(({ src }: { src: string }) => {
  const imageSource = isValidUrl(src) ? src : FALLBACK_IMAGE;

  return (
    <OptimizeImage
      src={imageSource}
      width={120}
      height={120}
      alt="Preview"
      className="rounded-md object-cover"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      unoptimized={true}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = FALLBACK_IMAGE;
        target.onerror = null;
      }}
    />
  );
});

PreviewImage.displayName = "PreviewImage";

const FullImage = memo(({ src }: { src: string }) => {
  const imageSource = isValidUrl(src) ? src : FALLBACK_IMAGE;

  return (
    <OptimizeImage
      src={imageSource}
      width={300}
      height={300}
      alt="Hình ảnh lớp học"
      className="rounded-md"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      unoptimized={true}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = FALLBACK_IMAGE;
        target.onerror = null;
      }}
    />
  );
});

FullImage.displayName = "FullImage";

const ImagePreview: React.FC<ImagePreviewProps> = memo(({ imageUrl }) => {
  if (!imageUrl || !isValidUrl(imageUrl)) {
    return (
      <div className="px-4">
        <span className="text-gray-500 italic">Hình ảnh không hợp lệ</span>
      </div>
    );
  }

  return (
    <div className="px-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative group">
              <a 
                href={imageUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className=""
              >
                <p className="line-clamp-1 max-w-[250px] 3xl:max-w-[350px] cursor-pointer text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  {imageUrl}
                </p>
              </a>

              <div className="absolute hidden group-hover:block top-0 left-full ml-2 p-1 bg-white rounded-lg shadow-lg z-50">
                <PreviewImage src={imageUrl} />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="w-[320px] p-2">
            <FullImage src={imageUrl} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

ImagePreview.displayName = "ImagePreview";

export default ImagePreview;
