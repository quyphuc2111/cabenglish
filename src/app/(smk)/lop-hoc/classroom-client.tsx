// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { BreadcrumbLayout } from "@/components/admin-panel/breadcrumb-layout";
import { useRouter } from "next/navigation";
import ClassroomCard from "@/components/lesson/classroom-card";
import { ClassroomType } from "@/types/classroom";

function ClassroomClient({
  classroomData,
  increamentLike,
  selectedClassroomName
}: {
  classroomData: ClassroomType[];
  increamentLike: (params: { classroomId: number }) => Promise<any>;
  selectedClassroomName?: string;
}) {
  const router = useRouter();
  const [likedClassrooms, setLikedClassrooms] = useState<Record<number, boolean>>({});
  const [likeCount, setLikeCount] = useState<Record<number, number>>({});
  
  // Debounce timers cho mỗi classroom
  const debounceTimersRef = useRef<Record<number, NodeJS.Timeout>>({});
  const pendingLikesRef = useRef<Record<number, number>>({});

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
      // ===== INSTANT UI UPDATE =====
      // Tăng like count ngay lập tức
      setLikeCount(prev => ({
        ...prev,
        [classroomId]: (prev[classroomId] || 0) + 1
      }));

      // Đánh dấu là đã like
      setLikedClassrooms(prev => ({
        ...prev,
        [classroomId]: true
      }));

      // ===== DEBOUNCED API CALL =====
      // Track số lần like pending
      if (!pendingLikesRef.current[classroomId]) {
        pendingLikesRef.current[classroomId] = 0;
      }
      pendingLikesRef.current[classroomId] += 1;

      // Clear timer cũ nếu có
      if (debounceTimersRef.current[classroomId]) {
        clearTimeout(debounceTimersRef.current[classroomId]);
      }

      // Set timer mới - gọi API sau 500ms không có click mới
      debounceTimersRef.current[classroomId] = setTimeout(async () => {
        const likesToSend = pendingLikesRef.current[classroomId];
        pendingLikesRef.current[classroomId] = 0;

        if (likesToSend === 0) return;

        try {
          // Gọi API nhiều lần liên tiếp
          for (let i = 0; i < likesToSend; i++) {
            await increamentLike({ classroomId });
          }
        } catch (error) {
          console.error("Lỗi khi xử lý like:", error);
          
          // Revert tất cả likes pending
          setLikeCount(prev => ({
            ...prev,
            [classroomId]: Math.max(0, (prev[classroomId] || 0) - likesToSend)
          }));
        }
      }, 500); // Debounce 500ms
    } catch (error) {
      console.error("Lỗi khi xử lý like:", error);
    }
  };

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  return (
    <BreadcrumbLayout title="Lớp học">
      <div className="flex flex-col gap-3 sm:gap-5 w-full max-w-full">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 px-2 sm:px-0">
          <Image
            src="/menu-icon/lophoc_icon.png"
            alt="chong_sach"
            width={40}
            height={40}
            className="sm:w-[40px] sm:h-[40px]"
          />
          <p className="text-[#555] text-base sm:text-lg md:text-[20px] font-bold truncate">
            {selectedClassroomName 
              ? `Đang chuyển đến lớp: ${selectedClassroomName}` 
              : "Danh sách lớp học"
            }
          </p>
        </div>
        <div className="bg-white py-5 sm:py-8 md:py-10 px-3 sm:px-4 md:px-5 lg:px-6 rounded-xl sm:rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full">
          {classroomData.map((classroomItem, index) => {
            const isSelected = selectedClassroomName && 
              classroomItem.classname.toLowerCase() === selectedClassroomName.toLowerCase();
            
            // Sử dụng likeCount optimistic hoặc giá trị gốc
            const currentLikeCount = likeCount[classroomItem.class_id] !== undefined 
              ? classroomItem.numliked + likeCount[classroomItem.class_id]
              : classroomItem.numliked;
            
            return (
              <div key={index} className="w-full h-full">
                <ClassroomCard
                  class_id={classroomItem.class_id}
                  classname={classroomItem.classname}
                  description={classroomItem.description}
                  numliked={currentLikeCount}
                  imageurl={classroomItem.imageurl}
                  progress={classroomItem.progress}
                  order={classroomItem.order}
                  className={`w-full h-full ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
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
