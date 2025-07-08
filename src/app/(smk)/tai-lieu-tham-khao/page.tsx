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

const tailieuData = [
  {
    id: 1,
    name: "Sách 1",
    image: "/assets/image/course/sach.png"
  },
  {
    id: 2,
    name: "Sách 2",
    image: "/assets/image/course/sach.png"
  },
  {
    id: 3,
    name: "Sách 3",
    image: "/assets/image/course/sach.png"
  },
  {
    id: 4,
    name: "Sách 4",
    image: "/assets/image/course/sach.png"
  },
  {
    id: 5,
    name: "Sách 1",
    image: "/assets/image/course/sach.png"
  },
  {
    id: 6,
    name: "Sách 2",
    image: "/assets/image/course/sach.png"
  },
  {
    id: 7,
    name: "Sách 3",
    image: "/assets/image/course/sach.png"
  },
  {
    id: 8,
    name: "Sách 4",
    image: "/assets/image/course/sach.png"
  }
];

function TaiLieuThamKhaoPage() {
  return (
    <ContentLayout title="TaiLieuThamKhao">
      <CourseWrapper>
        <div className="flex items-center gap-10">
          <SectionTitle
            title="Tài liệu tham khảo"
            image={{
              src: "/menu-icon/tailieuthamkhao.png",
              width: 40,
              height: 40,
              alt: "replay_icon"
            }}
            wrapperClassName="border-[#63a079]/50 w-full sm:w-[20vw]"
          />
          <Select defaultValue="1">
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Sách" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">Five Step of English</SelectItem>
                <SelectItem value="2">Eduplay Friend</SelectItem>
                <SelectItem value="3">My litter fun</SelectItem>
                <SelectItem value="4">Làm quen tiếng anh</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
            className="book-swiper"
          >
            {tailieuData.map((item, index) => (
              <SwiperSlide key={item.id}>
                <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-300">
                  <div className="relative w-full h-[75%] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={1037}
                      height={779}
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-500"
                      priority={index < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 text-center w-full bg-white">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-[#63a079] transition-colors duration-300">
                      {item.name}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </CourseWrapper>
    </ContentLayout>
  );
}

export default TaiLieuThamKhaoPage;
