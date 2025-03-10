import { getServerSession } from "next-auth";
import ClassroomChildClient from "./classroom-child-client";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";
import { getSectionDataByLessonId } from "@/actions/sectionAction";

async function Page({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;
  
  if (!session) {
    redirect("/signin");
  }

  // Lấy danh sách classroom của user
  const classroomData = await getAllClassroomDataByUserId({
    userId: session.user.userId
  });

  // Decode và format classname từ slug
  const formatClassname = (slug: string) => {
    return decodeURIComponent(slug).replace(/-/g, ' '); 
  };

  const classname = formatClassname(slug);

  // Kiểm tra xem classroom có tồn tại trong dữ liệu không
  const classroomExists = classroomData.data.some(
    classroom => classroom.classname.toLowerCase() === classname.toLowerCase()
  );

  // Nếu classroom không tồn tại, chuyển hướng về /lop-hoc
  if (!classroomExists) {
    redirect('/lop-hoc');
  }

  const lessonDataByClassname = await getAllLessonDataByUserId({
    userId: session.user.userId
  });

  // Lọc data theo classname
  const filteredLessonData = Array.isArray(lessonDataByClassname) 
    ? lessonDataByClassname.filter(lesson => lesson.classname.toLowerCase() === classname.toLowerCase())
    : lessonDataByClassname.data.filter(lesson => lesson.className.toLowerCase() === classname.toLowerCase());

  // Kiểm tra nếu không có data
  if (filteredLessonData.length === 0) {
    console.log(`Không tìm thấy dữ liệu cho lớp: ${classname}`);
    // Có thể redirect hoặc hiển thị thông báo
    // return redirect('/404');
  }

//   const sectionData = await getSectionDataByLessonId({
//     userId: session.user.userId,
//     lessonId: filteredLessonData[0].lessonId
//   });

//   const handleLessonSelect = (lessonId: number) => {
//     console.log("lessonId", lessonId)
//   }

  const fetchSectionData = async (lessonId: number) => {
    "use server"
    const sectionData = await getSectionDataByLessonId({
      userId: session.user.userId,
      lessonId: lessonId.toString()
    });
    return sectionData;
  }

  return (
    <ClassroomChildClient 
      slug={slug} 
      lessonData={filteredLessonData}
      fetchSectionData={fetchSectionData}
    //   userId={session.user.userId}
    />
  );
}

export default Page;