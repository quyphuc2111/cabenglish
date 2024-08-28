"use client"
import React, { Fragment } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import MainContent from "../main-content";
import { MAIN_LESSON } from "@/mock/data";
import Image from "next/image";

import coin from "@/assets/coin.png";
import ExtraItem from "./extra-item";
import { useRouter } from "next/navigation";

const MissionData = [
  {
    label: "Nhiệm vụ Tuần 1",
    value: "Mission 1"
  },
  {
    label: "Nhiệm vụ Tuần 2",
    value: "Mission 2"
  },
  {
    label: "Nhiệm vụ Tuần 3",
    value: "Mission 3"
  },
  {
    label: "Nhiệm vụ Tuần 4",
    value: "Mission 4"
  },
  {
    label: "Nhiệm vụ Tuần 5",
    value: "Mission 5"
  }
];

const ExtraData = [
  {
    title: 'Bài tập video',
    desc: 'Thử thách luyện nói Unit 1',
    imageUrl: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/extra-activities2x.png'
  },
  {
    title: 'Champions League',
    desc: 'Thử thách luyện nói Unit 1',
    imageUrl: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/c1-3.png',
    type: 'date'
  },
  {
    title: 'Live Class',
    desc: '18h & 20h thứ 7 hàng tuần',
    imageUrl: 'https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/common/images/2024/08/10/teacher-caymans-room-tour.jpg'
  }
]

function ClassroomContent() {
  const router = useRouter()
  return (
    <div>
      <Select defaultValue="Mission 1">
        <SelectTrigger className="w-[200px] bg-white py-6 rounded-2xl font-semibold text-lg">
          <SelectValue placeholder="Nhiệm vụ" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {MissionData.map((item) => (
              <SelectItem key={item.value} value={item.value} >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <MainContent title="Bài học chính">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
          {MAIN_LESSON &&
            MAIN_LESSON.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex gap-5 bg-white py-7 px-5 rounded-3xl shadow-course-inset cursor-pointer"
                  onClick={() => router.push('khoahoc/tieng-anh-lop-1/unit/4432?lesson=23123')}
                >
                  <Image
                    className="rounded-3xl"
                    src={item.image}
                    alt={item.title}
                    width={90}
                    height={112}
                  />
                  <div className="flex flex-col justify-between">
                    <span className="text-sm">{item.category_title}</span>
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="flex gap-2">
                      {Array(4)
                        .fill(null)
                        .map((item, index) => {
                          return (
                            <Image
                              src={coin}
                              alt="coin"
                              width={16}
                              height={16}
                              key={index}
                            />
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </MainContent>

      <MainContent title="Hoạt động ngoại khóa">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
          {ExtraData &&
            ExtraData.map((item, index) => {
              return (
             <Fragment key={index}>
               <ExtraItem title={item.title} desc={item.desc} imageUrl={item.imageUrl} type={item.type} />
             </Fragment>
              );
            })}
        </div>
      </MainContent>

      <div className="h-16"></div>
    </div>
  );
}

export default ClassroomContent;
