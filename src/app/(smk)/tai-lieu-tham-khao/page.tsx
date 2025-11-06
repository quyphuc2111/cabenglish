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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

// Dữ liệu cho 4 cuốn sách theo thứ tự
const booksData = {
  "1": {
    id: "1",
    name: "Five Step of English",
    folder: "five_step_english",
    images: [
      "/tai_lieu_tham_khao/five_step_english/3_4_tuoi_tap_01.png",
      "/tai_lieu_tham_khao/five_step_english/3_4_tuoi_tap_02.png",
      "/tai_lieu_tham_khao/five_step_english/4_5_tuoi_tap_01.png",
      "/tai_lieu_tham_khao/five_step_english/4_5_tuoi_tap_02.png",
      "/tai_lieu_tham_khao/five_step_english/5_6_tuoi_tap_01.png",
      "/tai_lieu_tham_khao/five_step_english/5_6_tuoi_tap_02.png"
    ]
  },
  "2": {
    id: "2",
    name: "Eduplay Friend",
    folder: "eduplay_friends",
    images: [
      "/tai_lieu_tham_khao/eduplay_friends/1A.png",
      "/tai_lieu_tham_khao/eduplay_friends/1B.png",
      "/tai_lieu_tham_khao/eduplay_friends/2A.png",
      "/tai_lieu_tham_khao/eduplay_friends/2B.png",
      "/tai_lieu_tham_khao/eduplay_friends/3A.png",
      "/tai_lieu_tham_khao/eduplay_friends/3B.png"
    ]
  },
  "3": {
    id: "3",
    name: "My litter fun",
    folder: "my_little_fun",
    images: [
      "/tai_lieu_tham_khao/my_little_fun/my_little_fun_01.png",
      "/tai_lieu_tham_khao/my_little_fun/my_little_fun_02.png",
      "/tai_lieu_tham_khao/my_little_fun/my_little_fun_03.png"
    ]
  },
  "4": {
    id: "4",
    name: "Làm quen tiếng anh",
    folder: "lam_quen_tieng_anh",
    images: [
      "/tai_lieu_tham_khao/lam_quen_tieng_anh/lam_quen_tieng_anh_01.png",
      "/tai_lieu_tham_khao/lam_quen_tieng_anh/lam_quen_tieng_anh_02.png",
      "/tai_lieu_tham_khao/lam_quen_tieng_anh/lam_quen_tieng_anh_03.png"
    ]
  }
};

function TaiLieuThamKhaoPage() {
  const [selectedBook, setSelectedBook] = useState("1");
  const [api, setApi] = useState<CarouselApi>();
  const { t } = useTranslation("", "common");

  // Lấy dữ liệu sách được chọn
  const currentBookData = booksData[selectedBook as keyof typeof booksData];

  // Handle book change
  const handleBookChange = (newBookId: string) => {
    if (newBookId === selectedBook) return;
    setSelectedBook(newBookId);
    // Reset carousel to first slide
    if (api) {
      api.scrollTo(0, false);
    }
  };

  return (
    <ContentLayout title="TaiLieuThamKhao">
      <CourseWrapper>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-10">
          <SectionTitle
            title={t("referenceMaterial") as string}
            image={{
              src: "/menu-icon/tailieuthamkhao.png",
              width: 40,
              height: 40,
              alt: "replay_icon"
            }}
            wrapperClassName="border-[#63a079]/50 w-full sm:w-auto lg:w-[20vw]"
          />
          <Select value={selectedBook} onValueChange={handleBookChange}>
            <SelectTrigger className="w-full sm:w-[200px] md:w-[220px] lg:w-[250px]">
              <SelectValue placeholder="Sách" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">Five Steps of English</SelectItem>
                <SelectItem value="2">Eduplay Friends</SelectItem>
                <SelectItem value="3">My Little Fun</SelectItem>
                <SelectItem value="4">Làm quen tiếng anh</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Carousel Container với responsive padding và centering */}
        <div className="mt-6 sm:mt-8 lg:mt-10 w-full flex justify-center py-4 sm:py-6 md:py-8">
          <div className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-6xl xl:max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="tai-lieu-carousel perspective-1000">
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: false,
                  skipSnaps: false,
                  dragFree: false,
                  slidesToScroll: 1,
                  duration: 25
                }}
                className="w-full overflow-visible"
              >
                <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-3 lg:-ml-4">
                  {currentBookData.images.map((imagePath, index) => (
                    <CarouselItem
                      key={`${selectedBook}-${index}`}
                      className="pl-1 sm:pl-2 md:pl-3 lg:pl-4 basis-[90%] xs:basis-[85%] sm:basis-[48%] md:basis-[31%] lg:basis-[23%] xl:basis-[18%] 2xl:basis-[15%]"
                    >
                      <div className="book-card w-full h-[350px] xs:h-[380px] sm:h-[420px] md:h-[460px] lg:h-[500px] xl:h-[520px] flex flex-col items-center justify-center bg-gradient-to-br from-white via-white to-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(99,160,121,0.1)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12),0_4px_8px_rgba(99,160,121,0.2)] transition-all duration-500 group cursor-pointer overflow-hidden relative"
                      >
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#63a079]/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Book number badge */}
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#63a079] to-[#4a8060] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                          #{index + 1}
                        </div>

                        <div className="relative w-full h-[85%] rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl overflow-hidden">
                          <Image
                            src={imagePath}
                            alt={`${currentBookData.name} - Sách ${index + 1}`}
                            width={800}
                            height={600}
                            quality={85}
                            sizes="(max-width: 480px) 85vw, (max-width: 640px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                            className="object-contain w-full h-full"
                            priority={index < 4}
                          />
                          {/* Gradient overlay with animation */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Shine effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                          </div>
                        </div>

                        <div className="p-2 sm:p-3 md:p-4 text-center w-full bg-white relative z-10">
                          <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 line-clamp-1 group-hover:text-[#63a079] transition-colors duration-300">
                            {currentBookData.name} - Sách {index + 1}
                          </h3>
                          <div className="h-0.5 w-0 bg-gradient-to-r from-transparent via-[#63a079] to-transparent mx-auto mt-1 group-hover:w-full transition-all duration-500" />
                        </div>

                        {/* Bottom glow effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#63a079] via-[#4a8060] to-[#63a079] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Arrows với responsive positioning */}
                <CarouselPrevious
                  className="
                hidden md:flex
                -left-8 lg:-left-10 xl:-left-12
                w-10 h-10 lg:w-12 lg:h-12
                bg-white/95 hover:bg-white
                border-2 border-[#63a079]/20 hover:border-[#63a079]/40
                shadow-lg hover:shadow-xl
                transition-all duration-200
              "
                />
                <CarouselNext
                  className="
                hidden md:flex
                -right-8 lg:-right-10 xl:-right-12
                w-10 h-10 lg:w-12 lg:h-12
                bg-white/95 hover:bg-white
                border-2 border-[#63a079]/20 hover:border-[#63a079]/40
                shadow-lg hover:shadow-xl
                transition-all duration-200
              "
                />
              </Carousel>
            </div>
          </div>
        </div>
      </CourseWrapper>
    </ContentLayout>
  );
}

export default TaiLieuThamKhaoPage;
