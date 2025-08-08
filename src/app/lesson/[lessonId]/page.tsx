import { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import LessonClient from "./lesson-client";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import {
  getSectionContentDataBSectionId,
  getSectionDataByLessonId
} from "@/actions/sectionAction";
import type { SectionContentType } from "@/types/section";
import { getLockedStatusByLessonId } from "@/actions/lessonAction";

export const dynamic = "force-dynamic";

export interface PageProps {
  params: {
    lessonId: string;
  };
  searchParams: { section?: string };
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams =
    typeof (params as any)?.then === "function"
      ? await (params as unknown as Promise<PageProps["params"]>)
      : params;

  const session = await getServerSession(authOptions);
  if (!session) return {};

  const { lessonId } = resolvedParams;

  // DEBUG logs for metadata
  try {
    console.log(
      "[lesson/[lessonId]] generateMetadata -> params:",
      resolvedParams
    );
    const previousImages = (await parent).openGraph?.images || [];

    const preload = await getSectionDataByLessonId({
      lessonId,
      userId: session.user.userId as string
    });
    console.log(
      "[lesson/[lessonId]] generateMetadata -> preload keys:",
      preload
    );

    return {
      title: `Bài học ${lessonId}`,
      description: `Chi tiết bài học và các phần học`,
      openGraph: {
        title: `Bài học ${lessonId}`,
        description: `Chi tiết bài học và các phần học`,
        images: [...previousImages]
      }
    };
  } catch (e) {
    console.error("[lesson/[lessonId]] generateMetadata error:", e);
    return {
      title: `Bài học ${lessonId}`,
      description: `Chi tiết bài học và các phần học`
    };
  }
}

async function LessonPage({ params, searchParams }: PageProps) {
  // Safely handle potential Promise for params/searchParams to satisfy runtime
  const resolvedParams =
    typeof (params as any)?.then === "function"
      ? await (params as unknown as Promise<PageProps["params"]>)
      : params;
  const resolvedSearchParams =
    typeof (searchParams as any)?.then === "function"
      ? await (searchParams as unknown as Promise<PageProps["searchParams"]>)
      : searchParams || {};

  const session = await getServerSession(authOptions);
  const { lessonId } = resolvedParams;
  const { section: sectionId } = resolvedSearchParams;

  if (!session) {
    redirect("/signin");
  }

  const lockedStatusResponse = await getLockedStatusByLessonId({
    userId: session.user.userId,
    lessonId
  });

  // Handle error cases
  if (!lockedStatusResponse.success || !lockedStatusResponse.data) {
    console.error("Error getting locked status:", lockedStatusResponse.error);
    redirect("/tong-quan");
  }

  // Check if lesson is locked
  if (lockedStatusResponse.data.isLocked) {
    redirect("/tong-quan");
  }

  try {
    const sectionData = await getSectionDataByLessonId({
      lessonId,
      userId: session.user.userId as string
    });

    console.log("lessonID:", lessonId);
    console.log("sectionData:", sectionData);

    // Always normalize section contents to SectionContentType[]
    let sectionContents: SectionContentType[] = [];

    if (sectionId) {
      try {
        const res = await getSectionContentDataBSectionId({
          userId: session.user.userId as string,
          sectionId
        });
        const maybe = (res as any)?.data;
        if (Array.isArray(maybe)) {
          sectionContents = maybe as SectionContentType[];
        }
      } catch (contentError) {
        console.error("Error loading section content:", contentError);
      }
    }

    return (
      <LessonClient
        lessonId={lessonId}
        sectionData={sectionData.data || []}
        sectionContentData={sectionContents}
        isLoading={false}
        error={undefined}
      />
    );
  } catch (error) {
    console.error("Error loading lesson data:", error);

    return (
      <LessonClient
        lessonId={lessonId}
        sectionData={[]}
        sectionContentData={[]}
        isLoading={false}
        error="Không thể tải dữ liệu bài học. Vui lòng thử lại sau hoặc liên hệ admin."
      />
    );
  }
}

export default LessonPage;
