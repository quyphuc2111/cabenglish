import Image from "next/image";
import React from "react";
import tree_logo from "@/assets/tree_logo.png";

function HeroSection() {
  return (
    <div className="container flex items-center gap-20 py-20">
      <div className="flex flex-col gap-10">
        <h2 className="text-5xl font-semibold">Về BKT SmartKid</h2>
        <p className="text-lg">
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

      <Image src={tree_logo} width={480} height={470} alt="Tree Logo" className="hidden md:block" />
    </div>
  );
}

export default HeroSection;
