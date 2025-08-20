"use client";

import Image from "next/image";
import React from "react";

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
  if (!isOpen || !expert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 md:p-6">
      {/* Backdrop with enhanced blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-500 opacity-100"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl xs:rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col modal-enter border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 xs:top-4 xs:right-4 sm:top-6 sm:right-6 z-20 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white transition-all duration-200 shadow-lg border border-gray-200 hover:scale-105 active:scale-95"
        >
          <svg
            className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Layout */}
        <div className="flex flex-col lg:flex-row h-full overflow-hidden landscape:flex-row">
          {/* Image Section */}
          <div className="relative w-full lg:w-2/5 h-40 xs:h-48 sm:h-56 md:h-72 lg:h-auto lg:min-h-[600px] flex-shrink-0 landscape:w-2/5 landscape:h-auto">
            <div className="absolute inset-0 rounded-t-2xl xs:rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none overflow-hidden landscape:rounded-l-2xl landscape:rounded-tr-none landscape:xs:rounded-l-3xl">
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
            <div className="absolute bottom-3 xs:bottom-4 sm:bottom-6 left-3 xs:left-4 sm:left-6 right-3 xs:right-4 sm:right-6 text-white z-10">
              <div className="flex items-center gap-2 xs:gap-3 mb-2 xs:mb-3">
                <div className="w-2 h-2 xs:w-3 xs:h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-xs xs:text-sm font-medium bg-black/40 px-2 py-1 xs:px-3 xs:py-2 rounded-full backdrop-blur-sm border border-white/20">
                  {expert.experience} kinh nghiệm
                </span>
              </div>
              <div className="text-xs xs:text-sm opacity-90 font-medium flex items-center gap-1 xs:gap-2 bg-black/30 px-2 py-1 xs:px-3 xs:py-2 rounded-full backdrop-blur-sm w-fit">
                <span>📍</span>
                <span>{expert.location}</span>
              </div>
            </div>

            {/* Specialty Badge */}
            <div className="absolute top-3 xs:top-4 sm:top-6 left-3 xs:left-4 sm:left-6 bg-white/95 backdrop-blur-sm px-2 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border border-white/50">
              <span className="text-xs xs:text-sm font-semibold text-blue-600">
                {expert.specialty}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Fixed Header */}
            <div className="p-3 xs:p-4 sm:p-5 lg:p-6 border-b border-gray-100 bg-white flex-shrink-0 landscape:p-2 landscape:xs:p-3 landscape:sm:p-4">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 mb-1 xs:mb-2 landscape:text-base landscape:xs:text-lg landscape:mb-1">
                {expert.name}
              </h2>
              <p className="text-xs xs:text-sm sm:text-base text-blue-600 font-medium leading-relaxed landscape:text-xs landscape:leading-tight">
                {expert.title}
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-3 xs:px-4 sm:px-5 lg:px-6 py-3 xs:py-4 sm:py-5 landscape:px-2 landscape:xs:px-3 landscape:py-2 landscape:xs:py-3">
              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-6 p-2 xs:p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg xs:rounded-xl border border-blue-100 landscape:mb-2 landscape:p-2 landscape:gap-1">
                <div className="text-center">
                  <div className="text-lg xs:text-xl sm:text-2xl mb-1 landscape:text-base landscape:mb-0.5">
                    ⭐
                  </div>
                  <div className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-gray-800 landscape:text-xs">
                    4.9
                  </div>
                  <div className="text-[9px] xs:text-[10px] md:text-xs text-gray-600 font-medium">
                    Đánh giá
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg xs:text-xl sm:text-2xl mb-1 landscape:text-base landscape:mb-0.5">
                    📚
                  </div>
                  <div className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-gray-800 landscape:text-xs">
                    {expert.description.length}
                  </div>
                  <div className="text-[9px] xs:text-[10px] md:text-xs text-gray-600 font-medium landscape:text-[8px]">
                    Chứng chỉ
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg xs:text-xl sm:text-2xl mb-1 landscape:text-base landscape:mb-0.5">
                    ✅
                  </div>
                  <div className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-green-600 landscape:text-xs">
                    Verified
                  </div>
                  <div className="text-[9px] xs:text-[10px] md:text-xs text-gray-600 font-medium landscape:text-[8px]">
                    Xác minh
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-3 mb-6 landscape:space-y-2 landscape:mb-4">
                <h3 className="text-base xs:text-lg md:text-xl lg:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-5 flex items-center gap-2 xs:gap-3 landscape:text-sm landscape:mb-2">
                  <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 md:w-4 md:h-4 bg-blue-500 rounded-full landscape:w-2 landscape:h-2"></div>
                  Thông tin chi tiết
                </h3>

                {expert.description.map((desc, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-2 xs:gap-3 md:gap-4 p-2 xs:p-3 sm:p-4 md:p-5 rounded-lg xs:rounded-xl bg-white border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 landscape:gap-2 landscape:p-2"
                  >
                    <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0 mt-0.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 landscape:w-5 landscape:h-5 landscape:mt-0">
                      <Image
                        src={desc.icon}
                        alt="icon"
                        width={20}
                        height={20}
                        className="w-3 h-3 xs:w-4 xs:h-4 md:w-5 md:h-5 opacity-90 filter brightness-0 invert landscape:w-2.5 landscape:h-2.5"
                      />
                    </div>
                    <p className="text-[10px] sm:text-sm md:text-base lg:text-base text-gray-700 leading-relaxed flex-1 group-hover:text-gray-800 transition-colors duration-300">
                      {desc.title.trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Action Buttons */}
            <div className="p-3 xs:p-4 sm:p-5 lg:p-6 bg-gray-50 border-t border-gray-100 flex-shrink-0 landscape:p-2 landscape:xs:p-3">
              <div className="flex flex-col sm:flex-row gap-2 landscape:gap-1">
                <button
                  onClick={onClose}
                  className="sm:w-auto px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 bg-white text-gray-700 rounded-lg font-medium text-xs xs:text-sm hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 landscape:py-1.5 landscape:text-xs"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .modal-enter {
          animation: modalSlideIn 0.4s ease-out forwards;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Custom scrollbar for modal */
        .modal-enter ::-webkit-scrollbar {
          width: 6px;
        }

        .modal-enter ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .modal-enter ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .modal-enter ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .modal-enter {
            margin: 0.5rem;
            max-height: calc(100vh - 1rem);
          }
        }

        /* Extra small devices */
        @media (max-width: 480px) {
          .modal-enter {
            margin: 0.25rem;
            max-height: calc(100vh - 5.5rem);
          }
        }

        /* Landscape mode optimizations - mobile only */
        @media (orientation: landscape) and (max-height: 500px) and (max-width: 768px) {
          .modal-enter {
            margin: 0.25rem;
            max-height: calc(100vh - 2.5rem);
          }
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
          .xs\:py-3 {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
          .xs\:py-3\.5 {
            padding-top: 0.875rem;
            padding-bottom: 0.875rem;
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
          .xs\:mb-5 {
            margin-bottom: 1.25rem;
          }
          .xs\:mb-6 {
            margin-bottom: 1.5rem;
          }
          .xs\:mt-1 {
            margin-top: 0.25rem;
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
          .xs\:rounded-2xl {
            border-radius: 1rem;
          }
          .xs\:rounded-3xl {
            border-radius: 1.5rem;
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
            height: 0.75rem;
          }
          .xs\:h-5 {
            height: 1.25rem;
          }
          .xs\:h-8 {
            height: 2rem;
          }
          .xs\:h-9 {
            height: 2.25rem;
          }
          .xs\:h-10 {
            height: 2.5rem;
          }
          .xs\:h-56 {
            height: 14rem;
          }
          .xs\:h-64 {
            height: 16rem;
          }
          .xs\:w-3 {
            width: 0.75rem;
          }
          .xs\:w-4 {
            width: 0.75rem;
          }
          .xs\:w-5 {
            width: 1.25rem;
          }
          .xs\:w-8 {
            width: 2rem;
          }
          .xs\:w-9 {
            width: 2.25rem;
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

        /* Backdrop blur support */
        @supports (backdrop-filter: blur(10px)) {
          .modal-backdrop {
            backdrop-filter: blur(10px);
          }
        }
      `}</style>
    </div>
  );
};

export default ExpertDetailModal;
