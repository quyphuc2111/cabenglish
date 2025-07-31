"use server";
import { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import ClassroomChildClient from "./classroom-child-client";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";
import { getClassIdByClassname, getClassroomByClassname } from "@/utils/getClassIdByClassname";

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

  const { data: classrooms } = await getAllClassroomDataByUserId({
    userId: session.user.userId
  });

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

  // Lấy thông tin classroom và class_id
  const matchingClassroom = getClassroomByClassname(classrooms, classname);
  const classId = getClassIdByClassname(classrooms, classname);

  if (!matchingClassroom || !classId) {
    return redirect("/lop-hoc");
  }

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

  return (
    <ClassroomChildClient
      slug={slug}
      lessonData={filteredLessons}
      classId={classId}
      classroom={matchingClassroom}
    />
  );
}

export default Page;
