// @ts-nocheck
// "use server";
import { Suspense } from "react";
import ClassroomClient from "./classroom-client";
import {
  decrementLikeByClassroomId,
  getAllClassroomDataByUserId,
  incrementLikeByClassroomId
} from "@/actions/classroomAction";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Loading } from "@/components/common/loading";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function ClassroomPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const classroomData = await getAllClassroomDataByUserId({
    userId: session.user.userId
  });

  console.log("classroomData", classroomData);

  // Lấy classroom name từ searchParams
  const resolvedSearchParams = await searchParams;
  const classroomName = resolvedSearchParams.classroom as string;

  console.log("classroomName from searchParams", classroomName);

  // Nếu có classroom name trong searchParams, kiểm tra xem có tồn tại không
  if (classroomName) {
    const decodedClassroomName = decodeURIComponent(classroomName);
    console.log("classroomName decoded", decodedClassroomName);

    // Kiểm tra xem classroom có tồn tại trong dữ liệu không
    const classroomExists = classroomData.data.some(
      (classroom) => classroom.classname.toLowerCase() === decodedClassroomName.toLowerCase()
    );

    // Nếu classroom không tồn tại, chuyển hướng về /lop-hoc
    if (!classroomExists) {
      return redirect("/lop-hoc");
    }
  }

  const increamentLike = async ({ classroomId }: { classroomId: number }) => {
    "use server";
    const classroom = await incrementLikeByClassroomId({
      classroomId: classroomId
    });
    return classroom;
  };

  const decreamentLike = async ({ classroomId }: { classroomId: number }) => {
    "use server";
    const classroom = await decrementLikeByClassroomId({
      classroomId: classroomId
    });
    return classroom;
  };

  return (
    <Suspense fallback={<Loading />}>
      <ClassroomClient
        classroomData={classroomData.data}
        increamentLike={increamentLike}
        decreamentLike={decreamentLike}
        selectedClassroomName={classroomName ? decodeURIComponent(classroomName) : undefined}
      />
    </Suspense>
  );
}

export default ClassroomPage;
