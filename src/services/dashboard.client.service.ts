import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { fetchFilterData } from "@/actions/filterAction";
import { initializeLocked } from "@/actions/lockedAction";
import { initializeProgress } from "@/actions/progressAction";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";

export const DashboardClientService = {
  async fetchDashboardData(userId: string, mode: "default" | "free" = "default") {
    try {
      const [courseData, filterData, lockedData, classroomData, progressData] =
        await Promise.all([
          getAllLessonDataByUserId({ userId }),
          fetchFilterData({ userId }),
          initializeLocked({ userId, mode }),
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
  }
}; 