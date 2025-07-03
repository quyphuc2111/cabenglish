import Image from "next/image";
import React from "react";
import tree_logo from "@/assets/tree_logo.png";

function HeroSection() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-20">
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold">Về BKT SmartKid</h2>
          <p className="text-base sm:text-lg text-gray-700">
            Smart Kids là phần mềm học trực tuyến dành cho trẻ mầm non, được thiết
            kế để mang đến trải nghiệm học tập thú vị và hiệu quả cho các bé dưới
            6 tuổi. Với Smart Kids, trẻ sẽ được khám phá thế giới học tập qua các
            bài học tương tác, trò chơi giáo dục, và video hấp dẫn. Phần mềm bao
            gồm các môn học cơ bản như toán, tiếng Việt, tiếng Anh, cùng với các
            hoạt động phát triển kỹ năng tư duy và sáng tạo. <br /> <br /> Smart Kids
            được xây dựng dựa trên các phương pháp giáo dục tiên tiến, đảm bảo phù
            hợp với từng giai đoạn phát triển của trẻ. Giao diện thân thiện, dễ sử
            dụng và hình ảnh sinh động giúp các bé dễ dàng tiếp cận và yêu thích
            việc học. Đặc biệt, phần mềm cũng cung cấp các tính năng quản lý và
            theo dõi tiến trình học tập, giúp phụ huynh và giáo viên có thể nắm
            bắt và hỗ trợ kịp thời cho sự phát triển của trẻ
          </p>
        </div>

        <div className="relative mt-8 lg:mt-0 w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <Image 
            src={tree_logo} 
            width={480} 
            height={470} 
            alt="Tree Logo" 
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
