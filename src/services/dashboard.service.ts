import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { fetchFilterData } from "@/actions/filterAction";
import { initializeLocked } from "@/actions/lockedAction";
import {
  initializeProgress,
  resetLessonProgress
} from "@/actions/progressAction";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";

export const DashboardService = {
  async fetchDashboardData(userId: string) {
    console.log("Fetching dashboard data for userId:", userId);
    try {
      const [courseData, filterData, lockedData, classroomData, progressData] =
        await Promise.all([
          getAllLessonDataByUserId({ userId }),
          fetchFilterData({ userId }),
          initializeLocked({ userId, mode: "default" }),
          getAllClassroomDataByUserId({ userId }),
          initializeProgress(userId)
        ]);

      return {
        courseData: courseData.data,
        filterData,
        lockedData,
        classroomData: classroomData.data,
        progressData
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  async resetLessonProgress(userId: string, lessonIds: number[]) {
    try {
      const response = await resetLessonProgress({ userId, lessonIds });
      return response;
    } catch (error) {
      console.error("Error resetting lesson progress:", error);
      throw error;
    }
  }
};
