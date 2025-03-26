import { getServerSession } from "next-auth";
import LessonClient from "./lesson-client";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getSectionContentDataBSectionId,
  getSectionDataByLessonId,
  updateLockedSectionContent,
  updateSectionContentLocked
} from "@/actions/sectionAction";
import { updateProgressSectionContent } from "@/actions/progressAction";

async function LessonPage({
  params,
  searchParams
}: {
  params: { lessonId: string };
  searchParams: { section?: string };
}) {
  const { lessonId } = await params;
  const { section: sectionId } = await searchParams;

  const session = await getServerSession(authOptions);

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

  // const updateLockedSectionContentAction = async ({
  //   sectionContentId,
  //   isLocked
  // }: {
  //   sectionContentId: string;
  //   isLocked: boolean;
  // }) => {
  //   "use server";
  //   const response = await updateLockedSectionContent({
  //     userId: session.user.userId,
  //     sectionContentId: sectionContentId,
  //     isLocked: isLocked
  //   });

  //   return response;
  // };
  // const updateLockedSectionContentAction = async ({
  //   sectionContentId,
  // }: {
  //   sectionContentId: string;
  //   isLocked: boolean;
  // }) => {
  //   "use server";
  //   const response = await updateSectionContentLocked({
  //     userId: session.user.userId,
  //     scID: sectionContentId,
  //   });

  //   return response;
  // };

  // const updateProgressSectionContentAction = async ({
  //   sectionContentId,
  //   progress
  // }: {
  //   sectionContentId: string;
  //   progress: number;
  // }) => {
  //   "use server";
  //   const response = await updateProgressSectionContent({
  //     userId: session.user.userId,
  //     sectionContentId: sectionContentId,
  //     progress: progress
  //   });
  //   return response
  // }



  return (
    <LessonClient
      sectionData={sectionData.data}
      sectionContentData={sectionContentData?.data}
      // updateLockedSectionContentAction={updateLockedSectionContentAction}
      // updateProgressSectionContentAction={updateProgressSectionContentAction}
    />
  );
}

export default LessonPage;
