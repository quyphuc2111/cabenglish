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
            title: "Thạc sĩ Khoa học Tâm lý học phát triển, Đại học Sheffield, Vương Quốc Anh.",
        },
        {
            icon: "/favourite.png",
            title: "Chứng nhận Đào tạo chuyên sâu của Hội đồng Khảo thí Cambridge. Một số thành tích đạt được: Báo cáo xuất sắc hội thảo Nghiên cứu Tâm lý học hành vi Châu Á năm 2024",
        },
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

        <div className="mt-10 flex justify-center">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="expert-swiper"
          >
            {chuyenGiaData.map((expert) => (
              <SwiperSlide key={expert.id}>
                <div className="w-full h-[450px] flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="relative w-full h-full">
                    <Image
                      src={expert.image}
                      alt={expert.name}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                      <h3 className="text-2xl font-bold mb-2">{expert.name}</h3>
                      <p className="text-sm opacity-90">{expert.title}</p>
                    </div>

                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="p-6 h-full flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4 text-white">{expert.name}</h3>
                        <p className="text-sm mb-6 text-white/90">{expert.title}</p>
                        <div className="flex flex-col gap-4">
                          {expert.description.map((desc, index) => (
                            <div key={index} className=" flex items-center gap-3">
                              <div className="w-[40px] h-[40px]">
                                <Image
                                  src={desc.icon}
                                  alt="icon"
                                //   fill
                                    width={40}
                                    height={40}
                                  className="mt-1 w-[40px] h-[40px]"
                              />
                              </div>
                              <p className="text-white/90 flex-1">{desc.title}</p>
                            </div>
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
      </CourseWrapper>
    </ContentLayout>
  );
};

export default DoiNguChuyenGiaPage;
