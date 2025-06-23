"use server";
import { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import ClassroomChildClient from "./classroom-child-client";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";
import { FilterService } from "@/services/filter.service";

export interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  if (!session) return {};

  const { slug } = await params;
  const classname = decodeURIComponent(slug);

  // Lấy thông tin lớp học
  const { data: classrooms } = await getAllClassroomDataByUserId({
    userId: session.user.userId
  });

  const currentClas = classrooms.find(
    (classroom) => classroom.classname.toLowerCase() === classname.toLowerCase()
  );

  // Lấy metadata từ parent
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${classname} - Lớp học`,
    description: `Quản lý bài học cho lớp ${classname}`,
    openGraph: {
      title: `${classname} - Lớp học`,
      description: `Quản lý bài học cho lớp ${classname}`,
      images: [...previousImages]
    }
  };
}

async function Page({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;

  if (!session) redirect("/signin");

  const classname = decodeURIComponent(slug);

  const { data: classrooms } = await getAllClassroomDataByUserId({
    userId: session.user.userId
  });

  const hasMatchingClass = classrooms.some(
    (classroom) => classroom.classname.toLowerCase() === classname.toLowerCase()
  );

  if (!hasMatchingClass) {
    return redirect("/lop-hoc");
  }

  console.log("session.user.mode", session.user.mode)

  const lessonData = await getAllLessonDataByUserId({
    userId: session.user.userId as string,
    mode: session.user.mode
  });

  const filteredLessons = (
    Array.isArray(lessonData) ? lessonData : lessonData.data
  ).filter(
    (lesson) =>
      (lesson.classname || lesson.className).toLowerCase() ===
      classname.toLowerCase()
  );

  // const filterService = await FilterService.fetchFilterData(
  //   session.user.userId as string
  // );



  return (
    <ClassroomChildClient
      slug={slug}
      lessonData={filteredLessons}
      // initialFilterData={filterService.initialFilterData}
      // fetchFilterData={filterService.fetchFilterData}
    />
  );
}

export default Page;
