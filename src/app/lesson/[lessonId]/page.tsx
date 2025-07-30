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
  
  try {
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
  } catch (error) {
    return {
      title: `Bài học ${lessonId}`,
      description: `Chi tiết bài học và các phần học`,
    };
  }
}

async function LessonPage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const { lessonId } = await params;
  const { section: sectionId } = await searchParams;

  if (!session) {
    redirect("/signin");
  }

  try {
    const sectionData = await getSectionDataByLessonId({
      lessonId,
      userId: session.user.userId
    });

    let sectionContentData;
    if (sectionId) {
      try {
        sectionContentData = await getSectionContentDataBSectionId({
          userId: session.user.userId,
          sectionId
        });
      } catch (contentError) {
        console.error("Error loading section content:", contentError);
        // Không cần throw error ở đây vì có thể section content chưa được tạo
      }
    }

    return (
      <LessonClient
        sectionData={sectionData.data || []}
        sectionContentData={sectionContentData?.data}
        isLoading={false}
        error={undefined}
      />
    );
  } catch (error) {
    console.error("Error loading lesson data:", error);
    
    return (
      <LessonClient
        sectionData={[]}
        sectionContentData={undefined}
        isLoading={false}
        error="Không thể tải dữ liệu bài học. Vui lòng thử lại sau hoặc liên hệ admin."
      />
    );
  }
}

export default LessonPage;
