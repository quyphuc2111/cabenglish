"use client";

import Image from "next/image";
import React from "react";
import { useOrientation } from "@/hooks/useOrientation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ExpertDetailProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    image: string;
    title: string;
    specialty: string;
    experience: string;
    location: string;
    description: {
      icon: string;
      title: string;
    }[];
  } | null;
}

const ExpertDetailModal = ({ isOpen, onClose, expert }: ExpertDetailProps) => {
  const orientation = useOrientation();
  const isMobileLandscape = useMediaQuery("(max-width: 1023px)");
  
  // Check if we're in mobile landscape mode
  const isLandscapeMode = orientation === "landscape" && isMobileLandscape;

  if (!expert) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`p-0 gap-0 border-gray-100 overflow-hidden ${
          isLandscapeMode 
            ? '!w-[calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)-2rem)] max-w-5xl !h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-3rem)] !max-h-none' 
            : ' w-[90vw] max-w-[900px] h-[85vh] max-h-[700px]'
        }`}
        style={isLandscapeMode ? {
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        } : {}}
      >
        <VisuallyHidden>
          <DialogTitle>{expert.name}</DialogTitle>
        </VisuallyHidden>

        {/* Modal Layout */}
        <div className={`flex h-full overflow-hidden ${
          isLandscapeMode ? 'flex-row' : 'flex-col lg:flex-row'
        }`}>
          {/* Image Section */}
          <div className={`relative flex-shrink-0 ${
            isLandscapeMode 
              ? 'w-2/5 h-auto' 
              : 'w-full lg:w-2/5 h-40 xs:h-48 sm:h-56 md:h-72 lg:h-auto lg:min-h-[600px]'
          }`}>
            <div className={`absolute inset-0 overflow-hidden ${
              isLandscapeMode 
                ? 'rounded-l-2xl' 
                : 'rounded-t-2xl xs:rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none'
            }`}>
              <Image
                src={expert.image}
                alt={expert.name}
                fill
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                priority
              />
              {/* Enhanced Overlay with improved gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            </div>

            {/* Floating Info */}
            <div className={`absolute text-white z-10 ${
              isLandscapeMode 
                ? 'bottom-2 left-2 right-2' 
                : 'bottom-3 xs:bottom-4 sm:bottom-6 left-3 xs:left-4 sm:left-6 right-3 xs:right-4 sm:right-6'
            }`}>
              <div className={`flex items-center mb-2 ${
                isLandscapeMode ? 'gap-1' : 'gap-2 xs:gap-3 mb-2 xs:mb-3'
              }`}>
                <div className={`bg-green-400 rounded-full animate-pulse shadow-lg ${
                  isLandscapeMode ? 'w-2 h-2' : 'w-2 h-2 xs:w-3 xs:h-3'
                }`}></div>
                <span className={`font-medium bg-black/40 rounded-full backdrop-blur-sm border border-white/20 ${
                  isLandscapeMode ? 'text-[10px] px-2 py-0.5' : 'text-xs xs:text-sm px-2 py-1 xs:px-3 xs:py-2'
                }`}>
                  {expert.experience} kinh nghiệm
                </span>
              </div>
              <div className={`opacity-90 font-medium flex items-center bg-black/30 rounded-full backdrop-blur-sm w-fit ${
                isLandscapeMode ? 'text-[10px] gap-1 px-2 py-0.5' : 'text-xs xs:text-sm gap-1 xs:gap-2 px-2 py-1 xs:px-3 xs:py-2'
              }`}>
                <span>📍</span>
                <span>{expert.location}</span>
              </div>
            </div>

            {/* Specialty Badge */}
            <div className={`absolute bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/50 ${
              isLandscapeMode 
                ? 'top-2 left-2 px-2 py-0.5' 
                : 'top-3 xs:top-4 sm:top-6 left-3 xs:left-4 sm:left-6 px-2 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2'
            }`}>
              <span className={`font-semibold text-blue-600 ${
                isLandscapeMode ? 'text-[10px]' : 'text-xs xs:text-sm'
              }`}>
                {expert.specialty}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Fixed Header */}
            <div className={`border-b border-gray-100 bg-white flex-shrink-0 ${
              isLandscapeMode 
                ? 'p-2' 
                : 'p-3 xs:p-4 sm:p-5 lg:p-6'
            }`}>
              <h2 className={`font-bold text-gray-800 ${
                isLandscapeMode 
                  ? 'text-sm mb-0.5' 
                  : 'text-lg xs:text-xl sm:text-2xl mb-1 xs:mb-2'
              }`}>
                {expert.name}
              </h2>
              <p className={`text-blue-600 font-medium ${
                isLandscapeMode 
                  ? 'text-[10px] leading-tight' 
                  : 'text-xs xs:text-sm sm:text-base leading-relaxed'
              }`}>
                {expert.title}
              </p>
            </div>

            {/* Scrollable Content */}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden ${
              isLandscapeMode 
                ? 'px-2 py-2' 
                : 'px-3 xs:px-4 sm:px-5 lg:px-6 py-3 xs:py-4 sm:py-5'
            }`}>
              {/* Enhanced Stats */}
              <div className={`grid grid-cols-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 ${
                isLandscapeMode 
                  ? 'gap-1 mb-2 p-1.5' 
                  : 'gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-6 p-2 xs:p-3 sm:p-4'
              }`}>
                <div className="text-center">
                  <div className={isLandscapeMode ? 'text-sm mb-0' : 'text-lg xs:text-xl sm:text-2xl mb-1'}>
                    ⭐
                  </div>
                  <div className={`font-bold text-gray-800 ${
                    isLandscapeMode ? 'text-[10px]' : 'text-sm xs:text-base sm:text-lg md:text-xl'
                  }`}>
                    4.9
                  </div>
                  <div className={`text-gray-600 font-medium ${
                    isLandscapeMode ? 'text-[8px]' : 'text-[9px] xs:text-[10px] md:text-xs'
                  }`}>
                    Đánh giá
                  </div>
                </div>
                <div className="text-center">
                  <div className={isLandscapeMode ? 'text-sm mb-0' : 'text-lg xs:text-xl sm:text-2xl mb-1'}>
                    📚
                  </div>
                  <div className={`font-bold text-gray-800 ${
                    isLandscapeMode ? 'text-[10px]' : 'text-sm xs:text-base sm:text-lg md:text-xl'
                  }`}>
                    {expert.description.length}
                  </div>
                  <div className={`text-gray-600 font-medium ${
                    isLandscapeMode ? 'text-[8px]' : 'text-[9px] xs:text-[10px] md:text-xs'
                  }`}>
                    Chứng chỉ
                  </div>
                </div>
                <div className="text-center">
                  <div className={isLandscapeMode ? 'text-sm mb-0' : 'text-lg xs:text-xl sm:text-2xl mb-1'}>
                    ✅
                  </div>
                  <div className={`font-bold text-green-600 ${
                    isLandscapeMode ? 'text-[10px]' : 'text-sm xs:text-base sm:text-lg md:text-xl'
                  }`}>
                    Verified
                  </div>
                  <div className={`text-gray-600 font-medium ${
                    isLandscapeMode ? 'text-[8px]' : 'text-[9px] xs:text-[10px] md:text-xs'
                  }`}>
                    Xác minh
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className={isLandscapeMode ? 'space-y-1 pb-2' : 'space-y-3 pb-6'}>
                <h3 className={`font-semibold text-gray-800 flex items-center bg-white z-10 ${
                  isLandscapeMode 
                    ? 'text-xs mb-1 gap-1 py-1' 
                    : 'text-base xs:text-lg md:text-xl lg:text-xl mb-3 xs:mb-4 sm:mb-5 gap-2 xs:gap-3 py-2'
                }`}>
                  <div className={`bg-blue-500 rounded-full ${
                    isLandscapeMode ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5 xs:w-3 xs:h-3 md:w-4 md:h-4'
                  }`}></div>
                  Thông tin chi tiết
                </h3>

                <div className={isLandscapeMode ? 'space-y-1' : 'space-y-3'}>
                {expert.description.map((desc, index) => (
                  <div
                    key={index}
                    className={`group flex items-start bg-white border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 ${
                      isLandscapeMode 
                        ? 'gap-1.5 p-1.5 rounded-md' 
                        : 'gap-2 xs:gap-3 md:gap-4 p-2 xs:p-3 sm:p-4 md:p-5 rounded-lg xs:rounded-xl'
                    }`}
                  >
                    <div className={`flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 ${
                      isLandscapeMode 
                        ? 'w-4 h-4 mt-0' 
                        : 'w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 mt-0.5'
                    }`}>
                      <Image
                        src={desc.icon}
                        alt="icon"
                        width={20}
                        height={20}
                        className={`opacity-90 filter brightness-0 invert ${
                          isLandscapeMode ? 'w-2 h-2' : 'w-3 h-3 xs:w-4 xs:h-4 md:w-5 md:h-5'
                        }`}
                      />
                    </div>
                    <p className={`text-gray-700 flex-1 group-hover:text-gray-800 transition-colors duration-300 ${
                      isLandscapeMode 
                        ? 'text-[9px] leading-tight' 
                        : 'text-[10px] sm:text-sm md:text-base lg:text-base leading-relaxed'
                    }`}>
                      {desc.title.trim()}
                    </p>
                  </div>
                ))}
                </div>
              </div>
            </div>

            {/* Fixed Action Buttons */}
            <div className={`bg-gray-50 border-t border-gray-100 flex-shrink-0 ${
              isLandscapeMode ? 'p-2' : 'p-3 xs:p-4 sm:p-5 lg:p-6'
            }`}>
              <div className={isLandscapeMode ? 'flex gap-1' : 'flex flex-col sm:flex-row gap-2'}>
                <button
                  onClick={onClose}
                  className={`bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 ${
                    isLandscapeMode 
                      ? 'px-3 py-1 text-[10px]' 
                      : 'sm:w-auto px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm'
                  }`}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Custom Styles */}
      <style jsx global>{`
        /* Custom scrollbar for modal content */
        [data-radix-dialog-content] ::-webkit-scrollbar {
          width: 6px;
        }

        [data-radix-dialog-content] ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        [data-radix-dialog-content] ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        [data-radix-dialog-content] ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Define xs breakpoint for Tailwind classes */
        @media (min-width: 480px) {
          .xs\:p-3 {
            padding: 0.75rem;
          }
          .xs\:p-4 {
            padding: 1rem;
          }
          .xs\:p-5 {
            padding: 1.25rem;
          }
          .xs\:px-3 {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          .xs\:px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .xs\:px-5 {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
          .xs\:py-1 {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
          }
          .xs\:py-1\.5 {
            padding-top: 0.375rem;
            padding-bottom: 0.375rem;
          }
          .xs\:py-2 {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
          }
          .xs\:py-2\.5 {
            padding-top: 0.625rem;
            padding-bottom: 0.625rem;
          }
          .xs\:py-3 {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
          .xs\:py-4 {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
          .xs\:py-5 {
            padding-top: 1.25rem;
            padding-bottom: 1.25rem;
          }
          .xs\:mb-2 {
            margin-bottom: 0.5rem;
          }
          .xs\:mb-3 {
            margin-bottom: 0.75rem;
          }
          .xs\:mb-4 {
            margin-bottom: 1rem;
          }
          .xs\:mb-5 {
            margin-bottom: 1.25rem;
          }
          .xs\:gap-2 {
            gap: 0.5rem;
          }
          .xs\:gap-3 {
            gap: 0.75rem;
          }
          .xs\:gap-4 {
            gap: 1rem;
          }
          .xs\:rounded-t-3xl {
            border-top-left-radius: 1.5rem;
            border-top-right-radius: 1.5rem;
          }
          .xs\:rounded-xl {
            border-radius: 0.75rem;
          }
          .xs\:text-base {
            font-size: 1rem;
            line-height: 1.5rem;
          }
          .xs\:text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
          .xs\:text-sm {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
          .xs\:text-xl {
            font-size: 1.25rem;
            line-height: 1.75rem;
          }
          .xs\:text-2xl {
            font-size: 1.5rem;
            line-height: 2rem;
          }
          .xs\:h-3 {
            height: 0.75rem;
          }
          .xs\:h-4 {
            height: 1rem;
          }
          .xs\:h-7 {
            height: 1.75rem;
          }
          .xs\:h-10 {
            height: 2.5rem;
          }
          .xs\:h-48 {
            height: 12rem;
          }
          .xs\:w-3 {
            width: 0.75rem;
          }
          .xs\:w-4 {
            width: 1rem;
          }
          .xs\:w-7 {
            width: 1.75rem;
          }
          .xs\:w-10 {
            width: 2.5rem;
          }
          .xs\:top-4 {
            top: 1rem;
          }
          .xs\:right-4 {
            right: 1rem;
          }
          .xs\:bottom-4 {
            bottom: 1rem;
          }
          .xs\:left-4 {
            left: 1rem;
          }
        }
      `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertDetailModal;
