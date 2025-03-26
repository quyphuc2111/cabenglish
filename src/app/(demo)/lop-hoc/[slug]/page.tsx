import { getServerSession } from "next-auth";
import ClassroomChildClient from "./classroom-child-client";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";
import { getSectionDataByLessonId } from "@/actions/sectionAction";
import { FilterService } from "@/services/filter.service";

async function Page({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const { slug } = await params; 
  
  if (!session) redirect("/signin");

  const classname = decodeURIComponent(slug).replace(/-/g, ' ');
  
  // Kiểm tra classroom tồn tại
  const { data: classrooms } = await getAllClassroomDataByUserId({
    userId: session.user.userId
  });
  
  const hasMatchingClass = classrooms.some(classroom => 
    classroom.classname.toLowerCase() === classname.toLowerCase()
  );

  if (!hasMatchingClass) {
    return redirect('/lop-hoc');
  }

  // Lấy và lọc lesson data
  const lessonData = await getAllLessonDataByUserId({
    userId: session.user.userId
  });
  
  const filteredLessons = (Array.isArray(lessonData) ? lessonData : lessonData.data)
    .filter(lesson => 
      (lesson.classname || lesson.className).toLowerCase() === classname.toLowerCase()
    );

  const filterService = await FilterService.fetchFilterData(session.user.userId);

  return (
    <ClassroomChildClient 
      slug={slug} 
      lessonData={filteredLessons}
      initialFilterData={filterService.initialFilterData}
      fetchFilterData={filterService.fetchFilterData}
    />
  );
}

export default Page;