// @ts-nocheck
import { Metadata, ResolvingMetadata } from 'next';
import { getServerSession, User } from "next-auth";
import LessonClient from "./lesson-client";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getSectionContentDataBSectionId,
  getSectionDataByLessonId
} from "@/actions/sectionAction";

export interface PageProps {
  params: Promise<{
    lessonId: string;
  }>;
  searchParams: Promise<{ section?: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  if (!session) return {};

  const { lessonId } = await params;
  
  // Lấy thông tin section
  const sectionData = await getSectionDataByLessonId({
    lessonId,
    userId: session.user.userId  as User
  });

  // Lấy metadata từ parent
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Bài học ${lessonId}`,
    description: `Chi tiết bài học và các phần học`,
    openGraph: {
      title: `Bài học ${lessonId}`,
      description: `Chi tiết bài học và các phần học`,
      images: [...previousImages],
    },
  };
}

async function LessonPage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const { lessonId } = await params;
  const { section: sectionId } = await searchParams;

  if (!session) {
    redirect("/signin");
  }

  const sectionData = await getSectionDataByLessonId({
    lessonId,
    userId: session.user.userId
  });

  let sectionContentData;
  if (sectionId) {
    sectionContentData = await getSectionContentDataBSectionId({
      userId: session.user.userId,
      sectionId
    });
    // console.log(sectionContentData);
  }


  return (
    <LessonClient
      sectionData={sectionData.data}
      sectionContentData={sectionContentData?.data}
    />
  );
}

export default LessonPage;
