"use server";

import { getAllLessonDataByUserId } from "@/actions/lessonAction";

export async function getNextLessonByLessonId({
  userId,
  currentLessonId
}: {
  userId: string;
  currentLessonId: number;
}) {
  try {
    const response = await getAllLessonDataByUserId({ userId });

    if (!response.data || response.data.length === 0) {
      return {
        nextLesson: null,
        isLastLesson: true,
        currentLesson: null,
        error: undefined
      };
    }

    // Tìm lesson hiện tại
    const currentLesson = response.data.find(
      (lesson) => lesson.lessonId === currentLessonId
    );

    if (!currentLesson) {
      return {
        nextLesson: null,
        isLastLesson: true,
        currentLesson: null,
        error: "Không tìm thấy bài học hiện tại"
      };
    }

    // Lọc lessons trong cùng classroom và sắp xếp theo order
    const classLessons = response.data
      .filter((lesson) => lesson.classId === currentLesson.classId)
      .sort((a, b) => {
        // Sắp xếp theo lessonOrder trước (ưu tiên), sau đó theo unitId, cuối cùng theo lessonId
        if (a.lessonOrder && b.lessonOrder) {
          const orderDiff = a.lessonOrder - b.lessonOrder;
          if (orderDiff !== 0) return orderDiff;
        }
        if (a.unitId !== b.unitId) return a.unitId - b.unitId;
        return a.lessonId - b.lessonId;
      });

    // Tìm vị trí của lesson hiện tại trong danh sách đã sắp xếp
    const currentIndex = classLessons.findIndex(
      (lesson) => lesson.lessonId === currentLessonId
    );

    if (currentIndex === -1) {
      return {
        nextLesson: null,
        isLastLesson: true,
        currentLesson,
        error: "Không tìm thấy bài học hiện tại trong danh sách"
      };
    }

    // Kiểm tra xem có lesson tiếp theo không
    const nextLesson = classLessons[currentIndex + 1];
    const isLastLesson = !nextLesson;

    return {
      nextLesson: nextLesson || null,
      isLastLesson,
      currentLesson,
      error: undefined
    };
  } catch (error) {
    console.error("Error getting next lesson:", error);
    return {
      nextLesson: null,
      isLastLesson: true,
      currentLesson: null,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra"
    };
  }
}
