import { getServerSession } from "next-auth";
import LessonPendingClient from "./lesson-pending-client";
import { LessonService } from "@/services/lesson.service";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FilterService } from "@/services/filter.service";

async function BaiGiangChuaDayPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const lessonService = await LessonService.lessonPendingData(
    session.user.userId
  );
  const filterService = await FilterService.fetchFilterData(
    session.user.userId
  );

  return (
    <LessonPendingClient
      pendingLessons={lessonService.pendingLessons}
      totalLessons={lessonService.totalLessons}
      initialFilterData={filterService.initialFilterData}
      fetchFilterData={filterService.fetchFilterData}
    />
  );
}

export default BaiGiangChuaDayPage;
