"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseWrapper from "@/components/common/course-wrapper";
import SectionTitle from "@/components/common/section-title";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const chuyenGiaData = [
  {
    id: 1,
    name: "Mr. Anthony Lee Olivera",
    image: "/assets/image/doinguchuyengia/chuyengia1.png",
    title: "CHUYÊN GIA CỐ VẤN CHƯƠNG TRÌNH TIẾNG ANH CHO STEAM SUMMER CAMP 2018",
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
  return (
    <ContentLayout title="DoiNguChuyenGia">
      <CourseWrapper>
        <div className="flex items-center gap-10">
          <SectionTitle
            title="Đội ngũ chuyên gia"
            image={{
              src: "/menu-icon/tailieuthamkhao.png",
              width: 40,
              height: 40,
              alt: "expert_icon"
            }}
            wrapperClassName="border-[#63a079]/50 w-full sm:w-[15vw] md:w-[20vw]"
          />
        </div>

        <div className="flex justify-center">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 8,
              stretch: 60,
              depth: 150,
              modifier: 1.5,
              slideShadows: false
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="expert-swiper w-full max-w-7xl"
            spaceBetween={50}
          >
            {chuyenGiaData.map((expert) => (
              <SwiperSlide key={expert.id} className="w-[400px]">
                <div className="w-full h-[600px] flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group cursor-pointer border border-gray-200/50">
                  {/* Image Section */}
                  <div className="relative w-full h-[280px] overflow-hidden">
                    <Image
                      src={expert.image}
                      alt={expert.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110 "
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold text-gray-700">Chuyên gia</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {expert.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium leading-relaxed line-clamp-3">
                        {expert.title}
                      </p>
                    </div>

                    {/* Description Section - Scrollable */}
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Thông tin chi tiết
                      </h4>
                      
                      <div className="h-[200px] overflow-y-auto custom-scrollbar group-hover:h-[220px] transition-all duration-300">
                        <div className="flex flex-col gap-3 pr-2">
                          {expert.description.map((desc, index) => (
                            <div 
                              key={index} 
                              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-200"
                            >
                              <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                                <Image
                                  src={desc.icon}
                                  alt="icon"
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 opacity-80"
                                />
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed flex-1">
                                {desc.title.trim()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {expert.description.length} thành tích
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Styles */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 2px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 2px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          .expert-swiper .swiper-pagination-bullet {
            background: #e2e8f0;
            opacity: 1;
            width: 12px;
            height: 12px;
          }

          .expert-swiper .swiper-pagination-bullet-active {
            background: #3b82f6;
            transform: scale(1.2);
          }

          .expert-swiper .swiper-slide-shadow-left,
          .expert-swiper .swiper-slide-shadow-right {
            display: none;
          }

          .expert-swiper .swiper-slide {
            filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
          }

          .expert-swiper .swiper-slide-active {
            filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15));
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </CourseWrapper>
    </ContentLayout>
  );
};

export default DoiNguChuyenGiaPage;
