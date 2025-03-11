import { getServerSession } from "next-auth";
import LessonTeachingClient from "./lesson-teaching-client";
import { LessonService } from "@/services/lesson.service";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

async function LessonTeachingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const lessonService = await LessonService.lessonTeachingData(session.user.userId);
  return (
   <LessonTeachingClient teachingLessons={lessonService.teachingLessons} upcomingLessons={lessonService.upcomingLessons} />
  );
}

export default LessonTeachingPage;
