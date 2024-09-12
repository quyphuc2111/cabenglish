import React from "react";

import lienHe from "@/assets/lienhe.png";
import Image from "next/image";
import BackgroundSVG from "./BackgroundSVG";
import { Button } from "../ui/button";

function AdviSection() {
  return (
    <div className="relative w-full h-[470px] ">
     <div className="absolute left-4 right-0 ">
     <BackgroundSVG />
     </div>
      <div className="container flex absolute top-0 md:left-1/2 transform md:-translate-x-1/2 items-center justify-between md:w-1/2 ">
        <div className="md:max-w-[520px] flex flex-col gap-5">
          <h2 className="text-xl font-semibold">
            Trẻ em cần được trao cơ hội để có thể học tập và phát triển tốt hơn.
            Giúp con khai phá tiềm năng tư duy và ngôn ngữ ngay hôm nay.
          </h2>

          <p>
            Nhập tên ba (mẹ) để được BKT Smart Kids tư vấn lộ trình học cho bé{" "}
          </p>

          <div className="flex gap-5">
            <input className="p-3 border border-gray-300 w-full rounded-lg" type="text" placeholder="Họ và ba mẹ" />
          </div>

          <Button size={"lg"} className="bg-green-600">Nhận tư vấn miễn phí</Button>
        </div>
        <div className="hidden md:block">
        <Image height={500} width={300} src={lienHe} alt="Liên hệ" />
        </div>
      </div>
    </div>
  );
}

export default AdviSection;
