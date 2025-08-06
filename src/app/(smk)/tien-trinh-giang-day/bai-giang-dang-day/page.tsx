import { getServerSession } from "next-auth";
import LessonTeachingClient from "./lesson-teaching-client";
import { LessonService } from "@/services/lesson.service";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FilterService } from "@/services/filter.service";

async function LessonTeachingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const lessonService = await LessonService.lessonTeachingData(
    session.user.userId
  );

  const filterService = await FilterService.fetchFilterData(
    session.user.userId
  );

  return (
    <LessonTeachingClient
      teachingLessons={lessonService.teachingLessons}
      initialFilterData={filterService.initialFilterData}
    />
  );
}

export default LessonTeachingPage;
