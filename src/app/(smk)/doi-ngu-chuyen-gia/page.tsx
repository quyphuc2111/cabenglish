"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseWrapper from "@/components/common/course-wrapper";
import SectionTitle from "@/components/common/section-title";
import Image from "next/image";
import React, { useState } from "react";

const chuyenGiaData = [
  {
    id: 1,
    name: "Mr. Anthony Lee Olivera",
    image: "/assets/image/doinguchuyengia/chuyengia1.png",
    title: "CHUYÊN GIA CỐ VẤN CHƯƠNG TRÌNH TIẾNG ANH CHO STEAM SUMMER CAMP 2018",
    specialty: "Giáo dục Bang Florida",
    experience: "10+ năm",
    location: "Florida, USA",
    description: [
      {
        icon: "/favourite.png",
        title: "Chuyên gia giáo dục bang Florida, USA.",
      },
      {
        icon: "/favourite.png",
        title: "10 năm giảng dạy tại các trường đại học, Trường Tiểu học, Trung học và Doanh nghiệp Việt Nam.",
      },
    ]
  },
  {
    id: 2,
    name: "Ms.Vũ Thái Linh",
    image: "/assets/image/doinguchuyengia/chuyengia2.png",
    title: "CHUYÊN GIA CỐ VẤN CHƯƠNG TRÌNH TIẾNG ANH",
    specialty: "Thạc sĩ TESOL",
    experience: "15+ năm",
    location: "Australia - Việt Nam",
    description: [
        {
            icon: "/favourite.png",
            title: "Cử nhân Địa chất Kỹ thuật (2001 - 2006) - Đại học Mỏ địa Chất Hà Nội(HUMG).",
        },
        {
            icon: "/favourite.png",
            title: "Quản lý, điều hành, biên soạn chương trình giáo dục, giảng dạy Tiếng...",
        },
        {
            icon: "/favourite.png",
            title: "Dạy tiếng anh giao tiếp cho cán bộ quản lý làm việc tại Vinfast(VINGROUP)...",
        },
        {
          icon: "/favourite.png",
          title: "Thạc sĩ giảng dạy Tiếng anh (M.TESOL) - Đại học VICTORIA-MELBOURNE AUSTRALIA."
        },
        {
          icon: "/favourite.png",
          title: "Thạc sĩ địa chất Kỹ thuật - Đại học LEEDS(Anh)."
        },
      {
        icon: "/favourite.png",
        title: "Cử nhân Sư phạm Tiếng anh(TESOL) - Đại học Ngoại ngữ và Quốc tế Hà Nội(ULIS)."
      }
    ]
  },
  {
    id: 3,
    name: "Ms. Thanh Thanh",
    image: "/assets/image/doinguchuyengia/chuyengia3.png",
    title: "CHUYÊN GIA CỐ VẤN CHƯƠNG TRÌNH TIẾNG ANH",
    specialty: "Tâm lý học Phát triển",
    experience: "8+ năm",
    location: "Anh - Úc - Việt Nam",
    description: [
      {
        icon: "/favourite.png",
        title: "Giảng viên ĐHQG từ năm 2016, Trưởng Bộ môn Tiếng Anh Trường quốc tế Nhật Bản."
      },
      {
        icon: "/favourite.png",
        title: "Cử nhân Đại học Ngoại Ngữ, Đại học quốc gia."
      },
      {
  icon: "/favourite.png",
        title: "Thạc sĩ Phương pháp giảng dạy - Đại học Victoria, Melborne, Úc."
      },
        {
            icon: "/favourite.png",
            title: "Thạc sĩ Khoa học Tâm lý học phát triển, Đại học Sheffield, Vương Quốc Anh.",
        },
        {
            icon: "/favourite.png",
            title: "Chứng nhận Đào tạo chuyên sâu của Hội đồng Khảo thí Cambridge. Một số thành tích đạt được: Báo cáo xuất sắc hội thảo Nghiên cứu Tâm lý học hành vi Châu Á năm 2024",
        },
        {
          icon: "/favourite.png",
          title: `
Tham luận hội thảo tại Đại học Curtin, Úc các chủ đề: Giảng dạy Tiếng Anh trong thời đại mới, Trao quyền cho giáo viên và học sinh

Sáng kiến kinh nghiệm đạt giải B cấp Thành phố 2015

Có nhiều học sinh đạt giải cao trong kì thi HSG thành phố HN, Olympic Tiếng Anh cấp Quốc Gia, Ielts 6.5+`
        },
      {
        icon: "/favourite.png",
        title: `
Hướng dẫn học sinh xin học bổng du học thành công và xin việc ở nước ngoài

Là tác giả có nhiều đầu sách bổ trợ Tiếng Anh đã xuất bản`
      }
    ]
  },
];

const DoiNguChuyenGiaPage = () => {
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalExpert, setModalExpert] = useState<typeof chuyenGiaData[0] | null>(null);

  const openModal = (expert: typeof chuyenGiaData[0]) => {
    setModalExpert(expert);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalExpert(null);
  };

  return (
    <ContentLayout title="DoiNguChuyenGia">
      <CourseWrapper>
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <SectionTitle
            title="Đội ngũ chuyên gia"
            image={{
              src: "/menu-icon/tailieuthamkhao.png",
              width: 40,
              height: 40,
              alt: "expert_icon"
            }}
            wrapperClassName="border-[#63a079]/50 mx-auto w-fit"
          />
          <p className="text-gray-600 mt-4 text-sm sm:text-base max-w-2xl mx-auto">
            Gặp gỡ đội ngũ chuyên gia hàng đầu với nhiều năm kinh nghiệm trong lĩnh vực giáo dục và phát triển chương trình học
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto px-4">
          {chuyenGiaData.map((expert, index) => (
            <div
              key={expert.id}
              className={`expert-card group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-500 ease-out transform hover:scale-[1.02]
                ${hoveredCard === expert.id ? 'shadow-2xl -translate-y-2' : 'hover:shadow-xl hover:-translate-y-1'}
              `}
              style={{
                animationDelay: `${index * 200}ms`
              }}
              onMouseEnter={() => setHoveredCard(expert.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Main Content */}
              <div className="relative z-10 block">
                
                {/* Image Section */}
                <div className="relative overflow-hidden w-full h-64 sm:h-72">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    priority
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Floating Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                        {expert.experience} kinh nghiệm
                      </span>
                    </div>
                    <div className="text-xs opacity-90 font-medium">
                      📍 {expert.location}
                    </div>
                  </div>

                  {/* Specialty Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <span className="text-xs font-semibold text-blue-600">{expert.specialty}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {expert.name}
                    </h3>
                    <p className="h-11 text-sm text-blue-600 font-medium leading-relaxed line-clamp-2">
                      {expert.title}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium">4.9</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-500">📚</span>
                      <span className="font-medium">{expert.description.length} chứng chỉ</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-500">✅</span>
                      <span className="font-medium">Verified</span>
                    </div>
                  </div>

                  {/* Preview Description */}
                  <div className="max-h-20 overflow-hidden mb-4">
                    <div className="space-y-2">
                      {expert.description.slice(0, 2).map((desc, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-blue-500 mt-1">•</span>
                          <p className="line-clamp-1">{desc.title.trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(expert);
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg active:scale-95"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Corner Decoration */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" />
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { label: "Chuyên gia", value: "3+", icon: "👥" },
            { label: "Kinh nghiệm", value: "30+ năm", icon: "⏰" },
            { label: "Chứng chỉ", value: "15+", icon: "🏆" },
            { label: "Quốc gia", value: "5", icon: "🌍" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Modal for Expert Details */}
        {isModalOpen && modalExpert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
              onClick={closeModal}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col modal-enter">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white transition-all duration-200 shadow-lg border border-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Layout */}
              <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                {/* Image Section */}
                <div className="relative w-full lg:w-2/5 h-72 sm:h-80 lg:h-auto lg:min-h-[600px] flex-shrink-0">
                  <div className="absolute inset-0 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none overflow-hidden">
                    <Image
                      src={modalExpert.image}
                      alt={modalExpert.name}
                      fill
                      className="object-cover object-center"
                      priority
                    />
                    {/* Enhanced Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                  
                  {/* Floating Info */}
                  <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-sm font-medium bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm border border-white/20">
                        {modalExpert.experience} kinh nghiệm
                      </span>
                    </div>
                    <div className="text-sm opacity-90 font-medium flex items-center gap-2 bg-black/30 px-3 py-2 rounded-full backdrop-blur-sm w-fit">
                      <span>📍</span>
                      <span>{modalExpert.location}</span>
                    </div>
                  </div>

                  {/* Specialty Badge */}
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50">
                    <span className="text-sm font-semibold text-blue-600">{modalExpert.specialty}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Fixed Header */}
                  <div className="p-6 lg:p-8 border-b border-gray-100 bg-white flex-shrink-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                      {modalExpert.name}
                    </h2>
                    <p className="text-base sm:text-lg text-blue-600 font-medium leading-relaxed">
                      {modalExpert.title}
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
                        <div className="text-xl font-bold text-gray-800">{modalExpert.description.length}</div>
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
                      
                      {modalExpert.description.map((desc, index) => (
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
                        onClick={closeModal}
                        className="sm:w-auto px-6 py-4 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Styles */}
        <style jsx global>{`
          .expert-card {
            animation: slideInUp 0.8s ease-out forwards;
            opacity: 0;
            transform: translateY(30px);
          }

          @keyframes slideInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

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

          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
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

          /* Custom scrollbar for cards */
          .expert-card ::-webkit-scrollbar {
            width: 4px;
          }
          
          .expert-card ::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 2px;
          }
          
          .expert-card ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 2px;
          }
          
          .expert-card ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          /* Mobile optimizations */
          @media (max-width: 768px) {
            .expert-card {
              margin-bottom: 1rem;
            }
            
            .modal-enter {
              margin: 1rem;
              max-height: calc(100vh - 2rem);
            }
          }

          /* Hover effects */
          @media (hover: hover) {
            .expert-card:hover {
              background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 100%);
            }
          }

          /* Backdrop blur support */
          @supports (backdrop-filter: blur(10px)) {
            .modal-backdrop {
              backdrop-filter: blur(10px);
            }
          }
        `}</style>
      </CourseWrapper>
    </ContentLayout>
  );
};

export default DoiNguChuyenGiaPage;
