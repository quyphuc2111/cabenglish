import { getServerSession } from "next-auth";
import LessonTeachingClient from "./lesson-teaching-client";
import { LessonService } from "@/services/lesson.service";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";
import { getAllLessonDataByUserId } from "@/actions/lessonAction";

async function LessonTeachingPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.userId) {
    redirect("/signin-v2");
  }

  const userId = session.user.userId;

  // Load toàn bộ lesson data từ server side
  const allLessonsResponse = await getAllLessonDataByUserId({
    userId
  });

  // Lọc ra các Bài học đang dạy (0 < progress < 1)
  const teachingLessons = allLessonsResponse.data
    .filter(
      (lesson) => lesson.progress > 0 && lesson.progress < 1 && !lesson.isLocked
    )
    .sort((a, b) => {
      if (a.classId !== b.classId) return a.classId - b.classId;
      if (a.unitId !== b.unitId) return a.unitId - b.unitId;
      return a.lessonId - b.lessonId;
    });

  // Load danh sách classroom từ server side
  const classroomResponse = await getAllClassroomDataByUserId({
    userId
  });

  return (
    <LessonTeachingClient
      teachingLessons={teachingLessons}
      classrooms={classroomResponse.data}
      allLessons={allLessonsResponse.data}
    />
  );
}

export default LessonTeachingPage;
