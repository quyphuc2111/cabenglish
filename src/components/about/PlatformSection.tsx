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
    <div className="bg-gray-50 p-2 md:p-16">
      <div className="container ">
        <h2 className="text-4xl font-semibold text-center mb-24">
          Các nền tảng của BKT
        </h2>
        <div className="md:flex gap-8">
          {PlatformData &&
            PlatformData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-6 mb-10 md:mb-0 md:basis-1/3 items-center rounded-3xl bg-white p-10 shadow-md hover:bg-green-400 hover:text-white transition duration-300" 
                >
                  <div className="bg-white p-5 -mt-24 rounded-full  ">
                    <div className="relative  rounded-full overflow-hidden w-32 h-32 ">
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="border border-gray-50"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default PlatformSection;
