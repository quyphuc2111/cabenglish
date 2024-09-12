import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const GiftItem = ({ title, image, coin, quantity, ...props }: any) => {
  return (
    <div {...props} className="bg-white shadow-course-inset rounded-3xl border overflow-hidden">
      <div className="bg-gray-50 flex justify-center">
        <Image src={image} alt={title} width={150} height={100} />
      </div>

      <div className="flex justify-between p-4">
        <p className="font-semibold text-lg">{title}</p>
        <p className="flex items-center gap-1">
          <span className="font-semibold">{coin}</span>
          <Image
            src="https://static.edupia.vn/uploads/v3/assets/images/gift-shop/coin.svg"
            alt="coin"
            width={28}
            height={28}
          />
        </p>
      </div>
      <div className="p-4">
        <Button size="lg" className={`${quantity == 0 ? "bg-zinc-600" : "bg-[#ff9213]"}  w-full`} disabled={quantity == 0 && true}>
          {quantity == 0 ? "Tạm hết quà" : "Đổi quà"}
        </Button>
      </div>
    </div>
  );
};

function ListGifts({title}: any) {
  return (
   <>
   <h3 className="text-2xl font-semibold border-l-4 pl-2 border-[#ff9213] text-[#017379]">{title}</h3>
    <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
      {Array(31)
        .fill("")
        .map((item, index) => {
          return (
            <GiftItem
              key={index}
              title={`Quà thứ ${index + 1}`}
              image={`https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/migrate-v1/images/2024/02/27/pea-cam-ipad-1.png`}
              coin={1000 + index * 100}
              quantity={index % 3 == 0 ? 0 : 100}
            />
          );
        })}
    </div>
   </>
  );
}

export default ListGifts;
