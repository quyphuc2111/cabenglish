"use client"
import React, { Fragment, useState, useEffect, useMemo } from "react";
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
import { LESSONS_BY_GRADE, getLessonsByGradeAndWeek, getAvailableWeeksByGrade } from "@/mock/data";
import Image from "next/image";

import coin from "@/assets/coin.png";
import ExtraItem from "./extra-item";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get grade from URL parameter, default to 5
  const gradeParam = searchParams.get('grade');
  const currentGrade = gradeParam ? Number(gradeParam) : 5;
  
  // Get available weeks for current grade
  const availableWeeks = useMemo(() => {
    return getAvailableWeeksByGrade(currentGrade);
  }, [currentGrade]);
  
  // Set default week to first available week
  const [currentWeek, setCurrentWeek] = useState<number>(
    availableWeeks.length > 0 ? availableWeeks[0] : 1
  );
  
  // Update current week when grade changes
  useEffect(() => {
    if (availableWeeks.length > 0) {
      setCurrentWeek(availableWeeks[0]);
    }
  }, [currentGrade, availableWeeks]);
  
  // Generate mission data based on available weeks
  const MissionData = useMemo(() => {
    return availableWeeks.map(week => ({
      label: `Nhiệm vụ Tuần ${week}`,
      value: week.toString()
    }));
  }, [availableWeeks]);

  // Get lessons for current grade and week
  const currentLessons = getLessonsByGradeAndWeek(currentGrade, currentWeek);

  return (
    <div>
      {/* Grade Display */}
      <div className="mb-6 flex items-center gap-4">
        <div className="bg-gradient-to-r from-[#1D5995] to-[#2B7AC4] text-white px-6 py-3 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold">Lớp {currentGrade}</h2>
        </div>
        <button
          onClick={() => router.push('/chon-lop-hoc')}
          className="text-[#1D5995] hover:text-[#2B7AC4] font-semibold underline"
        >
          Đổi lớp học
        </button>
      </div>

      {/* Week Selection */}
      <Select 
        value={currentWeek.toString()} 
        onValueChange={(value) => setCurrentWeek(Number(value))}
      >
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
          {currentLessons &&
            currentLessons.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex gap-5 bg-white py-7 px-5 rounded-3xl shadow-course-inset cursor-pointer"
                  onClick={() => router.push(`/khoahoc/tieng-anh-lop-${currentGrade}/unit/4432?lesson=${item.id}`)}
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
