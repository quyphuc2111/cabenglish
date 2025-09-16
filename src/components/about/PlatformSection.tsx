import React from "react";

import SMK_App from "@/assets/smkapp.png";
import SMK_Web from "@/assets/smkweb.png";
import SMK_Mobile from "@/assets/smkmb.jpg";
import Image from "next/image";

const PlatformData = [
  {
    title: "BKT SmartKids PC",
    desc: "Với tên gọi BKT SmartKids là một trên máy tính nhằm phục vụ cho lứa tuổi mầm non được các thầy cô sử dụng trực tiếp trong quá trình giảng dạy các bé. Tương thích với nhiều thiết bị màn hình thông minh nhằm nâng cáo quá trình giảng dạy",
    image: SMK_App
  },
  {
    title: "BKT SmartKids Web",
    desc: "Đầu tư vào con người và thế hệ tương lai là sự đầu tư khôn ngoan nhất.",
    image: SMK_Web
  },
  {
    title: "BKT SmartKids Mobile",
    desc: "Xây dựng lộ trình học tập hợp lý với từng trẻ nhỏ, dễ dàng học tập mọi lúc mọi nơi và giúp ba mẹ theo dõi quá trình học tiếng anh và dựa vào các kết quả đánh giá có trên ứng dụng",
    image: SMK_Mobile
  }
];

function PlatformSection() {
  return (
    <div className="bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 md:p-16">
      <div className="mx-auto max-w-8xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-12 sm:mb-16 md:mb-24">
          Các nền tảng của BKT SmartKids
        </h2>
        <div className="grid gap-8 md:gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
          {PlatformData &&
            PlatformData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-4 sm:gap-6 mb-10 sm:mb-0 items-center rounded-3xl bg-white p-6 sm:p-8 md:p-10 md:px-5 shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 hover:bg-gradient-to-b hover:from-white hover:to-green-50 transition-all duration-300 group relative"
                >
                  {/* Tooltip preview that appears on hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 -top-4 left-1/2 -translate-x-1/2 transform -translate-y-full bg-white p-2 rounded-xl shadow-2xl border-2 border-green-200 z-10 transition-all duration-300 scale-0 group-hover:scale-100 w-48 h-48 sm:w-56 sm:h-56 pointer-events-none">
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={`${item.title} preview`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 48vw, 56vw"
                      />
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-green-200 rotate-45"></div>
                  </div>

                  <div className="bg-white p-3 sm:p-5 -mt-16 sm:-mt-20 md:-mt-24 rounded-full shadow-lg border border-gray-100">
                    <div className="relative rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 ring-4 ring-green-50 shadow-inner">
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="object-cover"
                        fill
                        sizes="(max-width: 640px) 24vw, (max-width: 768px) 28vw, 32vw"
                        priority={index === 0}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-left md:text-center">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-justify">
                    {item.desc}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default PlatformSection;
