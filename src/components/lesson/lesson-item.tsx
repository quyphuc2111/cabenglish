"use client";
import React, { useState } from "react";
import Image from "next/image";
import Video from "next-video";
import learning from "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";

type LessonItemProps = {
  title: string;
  image: string;
  point?: string | null;
  rate: string | number;
  lessonInfo: any;
  onClick: () => void;
  params?: string | any;
};

function LessonItem({
  title,
  image,
  point,
  rate,
  onClick,
  lessonInfo,
  params
}: LessonItemProps) {
  const { part } = lessonInfo;

  const [activeIndexTab, setActiveIndexTab] = useState(1);

  const { alpha, beta, gamma } = useDeviceOrientation();

  const handleTabClick = (index: number) => {
    setActiveIndexTab(index);
  };

  return (
    <div className="w-full">
      {!params && (
        <div
          onClick={onClick}
          className={`w-full cursor-pointer bg-white shadow-course-inset mb-4 p-5 rounded-3xl border flex justify-between flex-col lg:flex-row ${
            !point ? "lg:items-center" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <Image src={image} width={58} height={58} alt="" />
            <h5 className="text-lg font-medium">{title}</h5>
          </div>
          {point ? (
            <div className="ml-[67px] lg:ml-0 flex items-center gap-3 ">
              <p className="text-xl font-semibold">{point} điểm</p>
              <span className="w-3 h-3 bg-zinc-300 rounded-full"></span>
              <p className="text-xl font-semibold text-zinc-500">{rate}%</p>
            </div>
          ) : (
            <div className="w-8 h-8 relative ml-[65px] lg:ml-0">
              <Image
                src="/lock.png"
                layout="fill"
                objectFit="cover"
                alt="lock"
              />
            </div>
          )}
        </div>
      )}
      <div className={`absolute top-0 ${
            params ? "left-0" : "left-full"
          } flex w-[1150px]`}>
        <div
          className={` tab-container h-[800px]`}
        >
          <div className="bg-[#f5fcff] ">
            <div className="p-3 md:p-7 text-white bg-[#00cccc] rounded-tl-3xl">
              <h2 className="text-xl md:text-2xl font-semibold">Unit 9</h2>
              <p className="text-lg text-nowrap">Từ vựng</p>
            </div>
            <div className="flex flex-col">
              {part.map((part: any, index: number) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleTabClick(index + 1)}
                    className={`flex flex-col gap-3 items-center py-5 cursor-pointer w-full ${
                      index + 1 === activeIndexTab ? "bg-[#e9f8f9]" : ""
                    }`}
                  >
                    <Image
                      src={`/exercise_type/${part.type}.png`}
                      alt="Image"
                      width={72}
                      height={72}
                    />
                    <p className="font-medium">{part.score} điểm</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`video-container ${
            params ? "left-[113px]" : ""
          }  w-full h-[800px]  top-0 bg-white`}
        >
          <div className="video-content">
            {!params && activeIndexTab === 1 && (
              <div>
                <Video src={learning} />
              </div>
            )}

            {params && activeIndexTab === 1 && (
              <div>
                <Video src={learning} />
              </div>
            )}

            <div className="flex items-start gap-7 mt-3">
              <Image
                src="/ga_con_lesson.png"
                width={173}
                height={174}
                alt="ga-con"
              />
              <p className="how-to-play bg-[#f5f5f5] p-9 rounded-3xl border relative">
                Cùng Pea học Tiếng Anh qua Video bài giảng thú vị sau đây nhé.
                Nếu chưa hiểu bài, em có thể tua lại để hiểu hơn nội dung bài
                giảng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonItem;
