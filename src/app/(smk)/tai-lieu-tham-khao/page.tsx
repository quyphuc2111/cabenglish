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
import React, { useState, useEffect } from "react";

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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Lấy dữ liệu sách được chọn
  const currentBookData = booksData[selectedBook as keyof typeof booksData];

  // Handle smooth transition when changing books
  const handleBookChange = (newBookId: string) => {
    if (newBookId === selectedBook) return;

    setIsTransitioning(true);

    // Smooth fade transition
    setTimeout(() => {
      setSelectedBook(newBookId);
      // Reset carousel to first slide
      if (api) {
        api.scrollTo(0, false); // false = no animation for instant reset
      }
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 150);
  };

  // Setup carousel API
  useEffect(() => {
    if (!api) return;

    // Optional: Add any carousel event listeners here
    api.on("select", () => {
      // Handle slide change if needed
    });
  }, [api]);

  return (
    <ContentLayout title="TaiLieuThamKhao">
      <CourseWrapper>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-10">
          <SectionTitle
            title="Tài liệu tham khảo"
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
                <SelectItem value="1">Five Step of English</SelectItem>
                <SelectItem value="2">Eduplay Friend</SelectItem>
                <SelectItem value="3">My litter fun</SelectItem>
                <SelectItem value="4">Làm quen tiếng anh</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Carousel Container với responsive padding và centering */}
        <div className="mt-6 sm:mt-8 lg:mt-10 w-full flex justify-center py-4 sm:py-6 md:py-8">
          <div className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-6xl xl:max-w-7xl px-4 sm:px-6 md:px-8">
            <div
              className={`tai-lieu-carousel transition-opacity duration-300 ${
                isTransitioning ? "opacity-50" : "opacity-100"
              }`}
            >
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
                      key={index}
                      className="pl-1 sm:pl-2 md:pl-3 lg:pl-4 basis-[90%] xs:basis-[85%] sm:basis-[48%] md:basis-[31%] lg:basis-[23%] xl:basis-[18%] 2xl:basis-[15%]"
                    >
                      <div className="w-full h-[350px] xs:h-[380px] sm:h-[420px] md:h-[460px] lg:h-[500px] xl:h-[520px] flex flex-col items-center justify-center bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 group">
                        <div className="relative w-full h-[85%] rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl overflow-hidden">
                          <Image
                            src={imagePath}
                            alt={`${currentBookData.name} - Sách ${index + 1}`}
                            width={800}
                            height={600}
                            quality={85}
                            sizes="(max-width: 480px) 85vw, (max-width: 640px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                            className="object-contain w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                            priority={index < 4}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-2 sm:p-3 md:p-4 text-center w-full bg-white">
                          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 line-clamp-1">
                            Sách {index + 1}
                          </h3>
                        </div>
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
