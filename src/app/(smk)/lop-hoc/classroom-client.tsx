// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BreadcrumbLayout } from "@/components/admin-panel/breadcrumb-layout";
import { useRouter } from "next/navigation";
import ClassroomCard from "@/components/lesson/classroom-card";
import { ClassroomType } from "@/types/classroom";

function ClassroomClient({
  classroomData,
  increamentLike,
  decreamentLike,
  selectedClassroomName
}: {
  classroomData: ClassroomType[];
  increamentLike: (params: { classroomId: number }) => Promise<any>;
  decreamentLike: (params: { classroomId: number }) => Promise<any>;
  selectedClassroomName?: string;
}) {
  const router = useRouter();
  const [likedClassrooms, setLikedClassrooms] = useState<Record<number, boolean>>({});

  // Nếu có selectedClassroomName, tự động chuyển đến classroom đó
  useEffect(() => {
    if (selectedClassroomName) {
      const selectedClassroom = classroomData.find(
        (classroom) => classroom.classname.toLowerCase() === selectedClassroomName.toLowerCase()
      );
      
      if (selectedClassroom) {
        // Encode classname trực tiếp mà không thay thế spaces
        const encodedClassname = encodeURIComponent(selectedClassroom.classname);
        router.push(`/lop-hoc/${encodedClassname}`);
      }
    }
  }, [selectedClassroomName, classroomData, router]);

  const handleClassroomClick = (name: string) => {
    // Encode classname trực tiếp mà không thay thế spaces
    const encodedName = encodeURIComponent(name);
    router.push(`/lop-hoc/${encodedName}`);
  };

  const handleLikeClick = async (classroomId: number) => {
    try {
      const isLiked = likedClassrooms[classroomId];
      
      if (!isLiked) {
        const messageResponse = await increamentLike({ classroomId });
        if (!messageResponse.error && messageResponse.data) {
          setLikedClassrooms(prev => ({
            ...prev,
            [classroomId]: true
          }));
          router.refresh();
        }
      } else {
        const messageResponse = await decreamentLike({ classroomId });
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
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <Image
            src="/book_multi.png"
            alt="chong_sach"
            width={40}
            height={40}
          />
          <p className="text-[#555] text-[20px] font-bold">
            {selectedClassroomName 
              ? `Đang chuyển đến lớp: ${selectedClassroomName}` 
              : "Danh sách lớp học"
            }
          </p>
        </div>
        <div className="bg-white py-10 px-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {classroomData.map((classroomItem, index) => {
            const isSelected = selectedClassroomName && 
              classroomItem.classname.toLowerCase() === selectedClassroomName.toLowerCase();
            
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
                  className={`w-full ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
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
