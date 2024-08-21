import React from "react";
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

const MissionData = [
  {
    label: "Nhiệm vụ tuần 1",
    value: "Mission 1"
  },
  {
    label: "Nhiệm vụ tuần 2",
    value: "Mission 2"
  },
  {
    label: "Nhiệm vụ tuần 3",
    value: "Mission 3"
  },
  {
    label: "Nhiệm vụ tuần 4",
    value: "Mission 4"
  },
  {
    label: "Nhiệm vụ tuần 5",
    value: "Mission 5"
  }
];

function ClassroomContent() {
  return (
    <div>
      <Select defaultValue="Mission 1">
        <SelectTrigger className="w-[180px] bg-white py-6 rounded-2xl font-semibold">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MAIN_LESSON &&
            MAIN_LESSON.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex gap-5 bg-white py-7 px-5 rounded-3xl shadow-course-inset"
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

      <MainContent title="Bài học chính">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MAIN_LESSON &&
            MAIN_LESSON.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex gap-5 bg-white py-7 px-5 rounded-3xl shadow-course-inset"
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
    </div>
  );
}

export default ClassroomContent;
