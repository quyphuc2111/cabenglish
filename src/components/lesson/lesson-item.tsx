"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import VocabularyGame from "./vocabulary-game";
import { LESSON_DETAILS } from "@/mock/lesson-detail";

type LessonItemProps = {
  title: string;
  image: string;
  point?: string | null;
  rate: string | number;
  lessonInfo: any;
  onClick: () => void;
  params?: string | any;
  categoryTitle?: string;
};

function LessonItem({
  title,
  image,
  point,
  rate,
  onClick,
  lessonInfo,
  params,
  categoryTitle
}: LessonItemProps) {

  // Determine the lesson details to use (tabs configuration)
  const details = useMemo(() => {
    if (params && typeof params === 'string' && LESSON_DETAILS[params]) {
      return LESSON_DETAILS[params];
    }
    return LESSON_DETAILS['default'];
  }, [params]);

  const [activeIndexTab, setActiveIndexTab] = useState(0); // 0-indexed for array access

  const { alpha, beta, gamma } = useDeviceOrientation();

  const handleTabClick = (index: number) => {
    setActiveIndexTab(index);
  };

  const activeTab = details[activeIndexTab];

  // Extract Unit info from category_title (e.g., "Unit 1 - Lesson: Từ vựng" -> "Unit 1")
  const unitInfo = useMemo(() => {
    if (categoryTitle) {
      const match = categoryTitle.match(/Unit\s+\d+/i);
      return match ? match[0] : "Unit";
    }
    return "Unit";
  }, [categoryTitle]);

  return (
    <div className="w-full">
      {!params && (
        <div
          onClick={onClick}
          className={`w-full cursor-pointer bg-white shadow-course-inset mb-4 p-5 rounded-3xl border flex justify-between flex-col lg:flex-row ${!point ? "lg:items-center" : ""
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
      <div className={`absolute top-0 ${params ? "left-0" : "left-full"
        } flex w-[1150px]`}>
        <div
          className={`tab-container h-[800px] flex flex-col`}
        >
          <div className="bg-[#f5fcff] h-full flex flex-col">
            {/* Header - Fixed */}
            <div className="p-3 md:p-7 text-white bg-[#00cccc] rounded-tl-3xl flex-shrink-0">
              <h2 className="text-xl md:text-2xl font-semibold">{unitInfo}</h2>
              <p className="text-lg text-nowrap">{activeTab?.title || "Bài học"}</p>
            </div>
            
            {/* Tabs - Scrollable */}
            <div className="flex flex-col overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-[80px]">
              {details.map((part, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleTabClick(index)}
                    className={`flex flex-col gap-3 items-center py-5 cursor-pointer w-full ${index === activeIndexTab ? "bg-[#e9f8f9]" : ""
                      }`}
                  >
                    <Image
                      src={`/exercise_type/${part.iconType}.png`}
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
          className={`video-container ${params ? "left-[113px]" : ""
            }  w-full h-[800px]  top-0 bg-white overflow-hidden rounded-tr-3xl rounded-br-3xl`}
        >
          <div className="video-content w-full h-full">
            {/* RENDER CONTENT BASED ON ACTIVE TAB TYPE */}
            {activeTab?.type === 'video' && activeTab.videoUrl && (
              <div className="w-full h-full flex flex-col p-6">
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-xl">
                  <video
                    src={activeTab.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-start gap-7 mt-6">
                  <Image
                    src="/ga_con_lesson.png"
                    width={100}
                    height={100}
                    alt="ga-con"
                    className="object-contain"
                  />
                  <p className="how-to-play bg-[#f5f5f5] p-6 rounded-3xl border relative text-lg text-slate-600">
                    Cùng Pea học Tiếng Anh qua Video bài giảng thú vị sau đây nhé.
                    Nếu chưa hiểu bài, em có thể tua lại để hiểu hơn nội dung bài
                    giảng.
                  </p>
                </div>
              </div>
            )}

            {activeTab?.type === 'game' && activeTab.gameData && (
              <div className="w-full h-full">
                <VocabularyGame 
                  data={activeTab.gameData.vocabularyItems} 
                  gameType={activeTab.gameData.gameType}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonItem;
