// @ts-nocheck
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BreadcrumbLayout } from "@/components/admin-panel/breadcrumb-layout";
import { useRouter } from "next/navigation";
import ClassroomCard from "@/components/lesson/classroom-card";
import { ClassroomType } from "@/types/classroom";

function ClassroomClient({
  classroomData,
  incrementLikeByClassroomId,
  decrementLikeByClassroomId
}: {
  classroomData: ClassroomType[];
  incrementLikeByClassroomId: (classroomId: number) => Promise<void>;
  decrementLikeByClassroomId: (classroomId: number) => Promise<void>;
}) {
  const router = useRouter();
  const [likedClassrooms, setLikedClassrooms] = useState<Record<number, boolean>>({});

  const handleClassroomClick = (name: string) => {
    router.push(`/lop-hoc/${name}`);
  };

  const handleLikeClick = async (classroomId: number) => {
    try {
      const isLiked = likedClassrooms[classroomId];
      
      if (!isLiked) {
        const messageResponse = await incrementLikeByClassroomId({ classroomId });
        if (!messageResponse.error && messageResponse.data) {
          setLikedClassrooms(prev => ({
            ...prev,
            [classroomId]: true
          }));
          router.refresh();
        }
      } else {
        const messageResponse = await decrementLikeByClassroomId({ classroomId });
        if (!messageResponse.error && messageResponse.data) {
          setLikedClassrooms(prev => ({
            ...prev,
            [classroomId]: false
          }));
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý like:", error);
    }
  };

  return (
    <BreadcrumbLayout title="Lớp học">
      <div className="flex flex-col gap-5 ">
        <div className="flex items-center gap-5">
          <Image
            src="/book_multi.png"
            alt="chong_sach"
            width={40}
            height={40}
          />
          <p className="text-[#555] text-[20px] font-bold">Danh sách lớp học</p>
        </div>
        <div className="bg-white py-10 px-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {classroomData.map((classroomItem, index) => {
            return (
              <div key={index}>
                <ClassroomCard
                  class_id={classroomItem.class_id}
                  classname={classroomItem.classname}
                  description={classroomItem.description}
                  numliked={classroomItem.numliked}
                  imageurl={classroomItem.imageurl}
                  progress={classroomItem.progress}
                  order={classroomItem.order}
                  className="w-full"
                  onClick={() => handleClassroomClick(classroomItem.classname)}
                  onLikeClick={() => handleLikeClick(classroomItem.class_id)}
                  isLiked={likedClassrooms[classroomItem.class_id]}
                />
              </div>
            );
          })}
        </div>
      </div>
    </BreadcrumbLayout>
  );
}

export default ClassroomClient;
