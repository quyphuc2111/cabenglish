import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { LessonType } from "@/types/lesson";

export const LessonService = {
  async lessonData(userId: string) {
    try {
      const response = await getAllLessonDataByUserId({ userId });

      return {
        lessonData: response.data
      };
    } catch (error) {
      console.error("Error fetching lesson data:", error);
      throw error;
    }
  },

  async lessonTeachingData(userId: string) {
    try {
      const response = await getAllLessonDataByUserId({ userId });

      // Lọc bài đang dạy (0 < progress < 1 và không bị khóa)
      const teachingLessons = response.data
        .filter(
          (lesson: LessonType) =>
            lesson.progress < 1 && lesson.progress > 0 && !lesson.isLocked
        )
        .sort((a: LessonType, b: LessonType) => {
          // Sắp xếp theo classId, unitId, lessonId
          if (a.classId !== b.classId) return a.classId - b.classId;
          if (a.unitId !== b.unitId) return a.unitId - b.unitId;
          return a.lessonId - b.lessonId;
        });

      // Tạo danh sách classroom từ dữ liệu lesson
      const classroomData = response.data
        .reduce((acc: any[], lesson: LessonType) => {
          const existingClassroom = acc.find(
            (classroom) => classroom.class_id === lesson.classId
          );
          if (!existingClassroom) {
            acc.push({
              class_id: lesson.classId,
              classname: lesson.className
            });
          }
          return acc;
        }, [])
        .sort((a, b) => a.class_id - b.class_id);

      return {
        teachingLessons,
        classroomData
      };
    } catch (error) {
      console.error("Error fetching lesson data:", error);
      throw error;
    }
  },
  async lessonPendingData(userId: string) {
    try {
      const response = await getAllLessonDataByUserId({ userId });

      // Lọc bài chưa dạy (progress = 0)
      const pendingLessons = response.data.filter(
        (lesson) => lesson.progress === 0
      );

      return {
        pendingLessons,
        totalLessons: response.data.length
      };
    } catch (error) {
      console.error("Error fetching lesson data:", error);
      throw error;
    }
  },

  async lessonCompleteData(userId: string) {
    try {
      const response = await getAllLessonDataByUserId({ userId });

      const completeLessons = response.data.filter(
        (lesson) => lesson.progress === 1
      );

      return {
        completeLessons
      };
    } catch (error) {
      console.error("Error fetching lesson data:", error);
      throw error;
    }
  }
};
