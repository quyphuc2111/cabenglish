import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { LessonType } from "@/types/lesson";

export const LessonService = {
  async lessonData(userId: string) {
   try {
    const response = await getAllLessonDataByUserId({ userId });

    return {
        lessonData: response.data,
    }
   
   } catch (error) {
    console.error("Error fetching lesson data:", error);
    throw error;
   }
  },

  async lessonTeachingData(userId: string) {
    try {
      const response = await getAllLessonDataByUserId({ userId });
      
      // Lọc bài đang dạy (0 < progress < 1)
      const teachingLessons = response.data.filter(
        (lesson: LessonType) => lesson.progress < 1 && lesson.progress > 0
      ).slice(-1)[0];

      // Lọc và sắp xếp bài sắp dạy (progress = 0)
      const upcomingLessons = response.data
        .filter((lesson: LessonType) => lesson.progress === 0)
        .sort((a: LessonType, b: LessonType) => {
          // Sắp xếp theo tuần học và ID bài học
          if (a.schoolWeek === b.schoolWeek) {
            return a.lessonId - b.lessonId;
          }
          return a.schoolWeek - b.schoolWeek;
        });

      return {
        teachingLessons,
        upcomingLessons
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
      const pendingLessons = response.data.filter(lesson => lesson.progress === 0);
      
      return {
        pendingLessons,
        totalLessons: response.data.length
      };
    } catch (error) {
      console.error("Error fetching lesson data:", error);
      throw error;
    }
  }
};


