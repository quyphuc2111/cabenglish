"use client";
import React, { useState } from "react";
import Image from "next/image";
import Video from "next-video";
import learning from "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SectionItemProps = {
  sectionData: {
    section_id: number | string;
    section_name: string;
    estimate_time: number;
    progress: number;
    is_locked: boolean;
    icon_url: string;
    section_contents: {
      sc_id?: number | string;
      icon_url: string;
      title: string;
      iframe_url: string;
      description?: string;
    }[];
  };
  onClick: () => void;
  params?: string | any;
  selectedSection?: number;
};

function SectionItem({ sectionData, onClick, params, selectedSection }: SectionItemProps) {
  //   const { part } = lessonInfo;

  const {
    section_id,
    section_name,
    estimate_time,
    section_contents,
    progress,
    icon_url,
    is_locked
  } = sectionData;


  const { alpha, beta, gamma } = useDeviceOrientation();

  return (
    <div className="w-full">
      {!params && (
        <div
          onClick={onClick}
          className={`w-full cursor-pointer bg-white shadow-course-inset mb-4 p-5 rounded-3xl border flex justify-between flex-col lg:flex-row ${is_locked ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex items-center gap-2 w-1/2">
            <Image src={icon_url} width={58} height={58} alt="" />
            <h5 className="text-lg font-medium">{section_name}</h5>
          </div>

          <div className={`w-1/2 flex items-center gap-2 ${is_locked ? "justify-between " : "justify-end w-full"}`}>
            {
                is_locked && (
                    <div className="w-8 h-8 relative  lg:ml-0">
                    <Image
                      src="/lock.png"
                      layout="fill"
                      objectFit="cover"
                      alt="lock"
                    />
                  </div>
                )
            }
           
            <div className={`flex items-center gap-3  min-w-[100px] w-[250px] `}>
              <p className="text-xl font-semibold w-1/3">
                {estimate_time} phút
              </p>
              <span className="w-3 h-3 bg-zinc-300 rounded-full "></span>

              <p className="text-xl font-semibold text-zinc-500 w-1/3">
                {progress}%
              </p>
            </div>
          </div>
        </div>
      )}
      {/* <div
        className={`absolute top-0 ${
          params ? "left-0" : "left-full"
        } flex flex-col w-[1150px]`}
      >
        <Tabs defaultValue="1" className="w-full">
          <TabsList className="bg-[#f5fcff] w-full flex gap-5 h-auto p-4">
           <div className="bg-[#56B165] rounded-3xl p-3 w-2/12">
           {selectedSection === section_id && (
            <h5 className="text-lg font-medium">{section_name}</h5>
           )}
           </div>
          <div className="w-10/12 flex gap-5 overflow-x-auto">
          {section_contents.map((content, index) => (
              <TabsTrigger
                key={index}
                value={(index + 1).toString()}
                className={`flex gap-2 items-center py-2 data-[state=active]:bg-[#e9f8f9]`}
              >
                <Image
                  src={content.icon_url}
                  alt="Image"
                  width={40}
                  height={40}
                />
                <p className="font-medium">{content.title}</p>
              </TabsTrigger>
            ))}
          </div>
          </TabsList>

          {section_contents.map((content, index) => (
            <TabsContent key={index} value={(index + 1).toString()} className="w-full h-[800px] bg-white">
              <div className="video-content">
                {index === 0 && (
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
            </TabsContent>
          ))}
        </Tabs>
      </div> */}
    </div>
  );
}

export default SectionItem;
