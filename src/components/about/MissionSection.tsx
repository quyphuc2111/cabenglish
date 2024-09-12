import React from "react";
import about_book from "@/assets/about_book.png";
import Image from "next/image";

function MissionSection() {
  return (
   <div className="bg-gray-100 py-16">
     <div className="container flex flex-col items-center ">
      <h2 className="text-4xl font-semibold mb-10">Sứ mệnh của BKT SmartKid</h2>

      <div className="flex flex-col md:flex-row gap-10">
        <div>
          <Image src={about_book} width={315} height={365} alt="About book" className="-mb-16"/>
          <div className="bg-green-500 p-10 rounded-xl z-10 relative">
            <p className="text-white font-semibold text-xl">
              Với các tính năng tương tác của phần mềm linh hoạt, áp dụng cho
              tất cả các lứa tuổi, Nâng cao hứng thú, động lực của người dùng
              thông qua các công cụ đa chức năng và các chủ đề phong phú, đơn
              giản hóa thao tác sử dụng.
            </p>
          </div>
        </div>
        <div className="bg-white p-10 rounded-xl">
          <h2 className="text-xl font-semibold text-green-500 mb-5">Tại BKT Smart Kids, chúng tôi tin rằng: </h2>
          <div className="flex flex-col gap-5">
            <p className="bg-gray-100 p-6 rounded-xl">
              Với các tính năng tương tác của phần mềm linh hoạt, dễ dàng thao
              tác và sử dụng cho tất cả các lứa tuổi. Nâng cao hứng thú, động
              lực của người dùng thông qua nhiều bài giảng thú vị và thiết thực,
              được chia làm các chủ đề cụ thể, xây dựng qua nhiều hình thức học
              tập khác nhau.
            </p>
            <p className="bg-gray-100 p-6 rounded-xl">
              Người dùng sẽ cảm thấy dễ dàng, tự tin hơn khi sử dụng phần mềm:
              Thiết kế gần gũi với nhận thức của người dùng, tiếp cận nhanh với
              mọi tính năng của phần mềm.
            </p>
            <p className="bg-gray-100 p-6 rounded-xl">
              Thay vì loay hoay cho việc nghiên cứu, tìm kiếm tài liệu học tập –
              giảng dạy. Phần mềm là lựa chọn tuyệt vời giúp bạn tiết kiệm rất
              nhiều thời gian; sử dụng triệt để các tính năng của phần mềm.
            </p>
          </div>
        </div>
      </div>
    </div>
   </div>
  );
}

export default MissionSection;
