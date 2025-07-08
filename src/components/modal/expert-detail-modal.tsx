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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with enhanced blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-500 opacity-100"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col modal-enter border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white transition-all duration-200 shadow-lg border border-gray-200 hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Layout */}
        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
          {/* Image Section */}
          <div className="relative w-full lg:w-2/5 h-72 sm:h-96 lg:h-auto lg:min-h-[600px] flex-shrink-0">
            <div className="absolute inset-0 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none overflow-hidden">
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
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-sm font-medium bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm border border-white/20">
                  {expert.experience} kinh nghiệm
                </span>
              </div>
              <div className="text-sm opacity-90 font-medium flex items-center gap-2 bg-black/30 px-3 py-2 rounded-full backdrop-blur-sm w-fit">
                <span>📍</span>
                <span>{expert.location}</span>
              </div>
            </div>

            {/* Specialty Badge */}
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50">
              <span className="text-sm font-semibold text-blue-600">{expert.specialty}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Fixed Header */}
            <div className="p-6 lg:p-8 border-b border-gray-100 bg-white flex-shrink-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                {expert.name}
              </h2>
              <p className="text-base sm:text-lg text-blue-600 font-medium leading-relaxed">
                {expert.title}
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6">
              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                <div className="text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-xl font-bold text-gray-800">4.9</div>
                  <div className="text-xs text-gray-600 font-medium">Đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <div className="text-xl font-bold text-gray-800">{expert.description.length}</div>
                  <div className="text-xs text-gray-600 font-medium">Chứng chỉ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-xl font-bold text-green-600">Verified</div>
                  <div className="text-xs text-gray-600 font-medium">Xác minh</div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  Thông tin chi tiết
                </h3>
                
                {expert.description.map((desc, index) => (
                  <div key={index} className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="w-10 h-10 flex-shrink-0 mt-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={desc.icon}
                        alt="icon"
                        width={20}
                        height={20}
                        className="w-5 h-5 opacity-90 filter brightness-0 invert"
                      />
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed flex-1 group-hover:text-gray-800 transition-colors duration-300">
                      {desc.title.trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Action Buttons */}
            <div className="p-6 lg:p-8 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                  Liên hệ chuyên gia
                </button>
                <button 
                  onClick={onClose}
                  className="sm:w-auto px-6 py-4 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300"
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
            margin: 1rem;
            max-height: calc(100vh - 2rem);
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