import React from "react";
import Image from "next/image";

import check_button from "@/assets/check_button.png";
import img_mk from "@/assets/img-mk.png";

const ForYouData = [
  {
    desc: "BKT Smart Kids dành cho trẻ em từ 18 tháng tuổi – 5 tuổi áp dụng các phương pháp giáo dục sớm, lấy sự phát triển của trẻ làm trung tâm, xây dựng môi trường học thông minh và hiện đại."
  },
  {
    desc: "BKT Smart Kids giáo trình được biên soạn kĩ lưỡng, kết hợp với nhiều phương pháp như Phonics giúp bé có thể luyện, và nhận biết mặt chữ từ khi còn bé bằng Flashcard, phương pháp dạy và học phù hợp với độ tuổi của bé."
  },
  {
    desc: "BKT Smart Kids giúp các trẻ tiếp cận từ mới thông qua hình ảnh và trương tác với nhiều từ mới, mẫu câu được giới thiệu theo ngữ cảnh một cách tự nhiên, luyện nghe, nói  giúp các bé dễ nhận biết, hình dung và ghi nhớ từ lâu hơn từ đó trẻ phát triển toàn diện về cả tư duy lẫn ngoại ngữ."
  },
  {
    desc: "Những gia đình chưa có định hướng học tập cho trẻ, BKT sẽ giúp ba mẹ thấu hiểu xác định chính xác để xây dựng nên một lộ trình học chuẩn cho trẻ dựa vào độ tuổi và sở thích của trẻ từ đó xây dựng nên một môi trường học tập đầy hứng thú và linh hoạt."
  }
];

function ForYouSection() {
  return (
    <div className="container py-16">
      <h2 className="text-4xl font-semibold">BKT Smart Dành cho ai?</h2>

      <div className="md:grid md:grid-cols-2">
        <div>
          {ForYouData &&
            ForYouData.map((item, index) => {
              return (
                <div key={index} className="p-5 grid grid-cols-9 border-b border-gray-200">
                  <div className={`col-span-1 flex ${index % 2 == 0 ? "justify-start" : "justify-end"} items-center `}>
                    <Image
                      src={check_button}
                      width={35}
                      height={35}
                      sizes="(max-width: 768px) 100vw,
                              (max-width: 1200px) 50vw,
                              33vw"
                      alt="Check Icon"
                    />
                  </div>
                  <p className={`col-span-8 ${index % 2 == 0 ? "" : "-order-1"}`}>{item.desc}</p>
                </div>
              );
            })}
        </div>
        <div className="justify-center items-center hidden md:flex">
          <Image
            src={img_mk}
            width={480}
            height={320}
            alt="Image of Man with Keyboard"
            className="my-8 "
          />
        </div>
      </div>
    </div>
  );
}

export default ForYouSection;
