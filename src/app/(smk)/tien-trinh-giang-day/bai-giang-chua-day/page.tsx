import { getServerSession } from "next-auth";
import LessonPendingClient from "./lesson-pending-client";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";

async function BaiGiangChuaDayPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  // Lấy toàn bộ lesson data theo user id
  const lessonResponse = await getAllLessonDataByUserId({
    userId: session.user.userId!
  });

  // Lấy toàn bộ classroom data theo user id
  const classroomResponse = await getAllClassroomDataByUserId({
    userId: session.user.userId!
  });

  // Lọc ra các bài học chưa dạy (progress = 0)
  const pendingLessons =
    lessonResponse.data?.filter((lesson) => lesson.progress === 0) || [];

  // Tổng số bài học (tất cả bài học, không chỉ bài chưa dạy)
  const totalLessons = lessonResponse.data?.length || 0;

  return (
    <LessonPendingClient
      pendingLessons={pendingLessons}
      totalLessons={totalLessons}
      classrooms={classroomResponse.data || []}
      userId={session.user.userId!}
    />
  );
}

export default BaiGiangChuaDayPage;
