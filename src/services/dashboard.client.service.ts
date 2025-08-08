import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { fetchFilterData } from "@/actions/filterAction";
import { initializeLocked } from "@/actions/lockedAction";
import { initializeProgress } from "@/actions/progressAction";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";

export const DashboardClientService = {
  async fetchDashboardData(userId: string, mode: "default" | "free" = "default") {
    try {

      console.log("📚 Fetching dashboard data with userId:", userId, "and mode:", mode);
      const [lockedData, progressData, courseData, filterData,  classroomData ] =
        await Promise.all([
          initializeLocked({ userId, mode }),
          initializeProgress(userId),
          getAllLessonDataByUserId({ userId }),
          fetchFilterData({ userId }),
          getAllClassroomDataByUserId({ userId })
        ]);

      return {
        lockedData,
        progressData,
        courseData: courseData.data,
        filterData,
        classroomData: classroomData.data,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }
}; 