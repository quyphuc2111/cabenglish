import React from "react";
import Image from "next/image";

import coin from "@/assets/coin.png";
import { formatDate } from "date-fns";
import CountdownTimer from "./cout-down";

function ExtraItem({ title, desc, imageUrl, type }: any) {
  return (
    <div>
      <div className="bg-white p-3 flex flex-col shadow-course-inset rounded-3xl overflow-hidden cursor-pointer">
        <div className="relative w-full h-[200px] rounded-3xl overflow-hidden">
          <Image
            src={imageUrl}
            alt="activiti"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div>
          <h2 className="font-semibold mt-5 mb-3">{title}</h2>

          <div className="flex justify-between">
            {type === "date" ? (
              <div className="flex gap-2">
                <span className="text-[#21bdc6] text-xs md:text-sm flex gap-1 items-center">
                  <div className="w-4 h-4 relative">
                    <Image
                      src="https://static.edupia.vn/uploads/v3/assets/images/classroom/sapdienra.png"
                      alt="timer"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  Sắp diễn ra
                </span>
                <span className="flex text-xs md:text-sm text-red-500 gap-1">
                  Còn
                  <CountdownTimer targetDate={"2024-12-31T00:00:00"} />
                </span>
              </div>
            ) : (
              <span className="text-zinc-500 text-sm">{desc}</span>
            )}

            <div className="flex gap-2">
              {type!== 'date' &&   Array(4)
                .fill(null)
                .map((item, index) => {
                  return (
                    <div className="w-4 h-4 relative" key={index}>
                      <Image
                        src={coin}
                        alt="coin"
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExtraItem;
