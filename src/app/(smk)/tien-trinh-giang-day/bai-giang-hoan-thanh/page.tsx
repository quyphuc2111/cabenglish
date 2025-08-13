import { getServerSession } from "next-auth";
import LessonCompleteClient from "./lesson-complete-client";
import { LessonService } from "@/services/lesson.service";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";

async function LessonCompletePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin-v2");
  }

  const lessonService = await LessonService.lessonData(session.user.userId!);

  // Lấy toàn bộ classroom data theo user id
  const classroomResponse = await getAllClassroomDataByUserId({
    userId: session.user.userId!
  });

  return (
    <LessonCompleteClient
      lessonData={lessonService.lessonData}
      classrooms={classroomResponse.data || []}
      userId={session.user.userId!}
    />
  );
}

export default LessonCompletePage;
