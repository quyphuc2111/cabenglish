import { getServerSession } from "next-auth";
import LessonCompleteClient from "./lesson-complete-client";
import { LessonService } from "@/services/lesson.service";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";


async function LessonCompletePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const lessonService = await LessonService.lessonData(session.user.userId);

  return <LessonCompleteClient lessonData={lessonService.lessonData} />;
}

export default LessonCompletePage;
