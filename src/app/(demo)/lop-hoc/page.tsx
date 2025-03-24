// "use client"

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
import { headers } from "next/headers";

async function ClassroomPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const classroomData = await getAllClassroomDataByUserId({
    userId: session.user.userId
  });

  // Lấy pathname từ headers
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const classroomName = decodeURIComponent(pathname).split("/").pop();

  // Kiểm tra xem classroom có tồn tại trong dữ liệu không
  const classroomExists = classroomData.data.some(
    (classroom) => classroom.classname === classroomName
  );

  // Nếu classroom không tồn tại, chuyển hướng về /lop-hoc
  if (classroomName && !classroomExists) {
    redirect("/lop-hoc");
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
    <Suspense fallback={<div>Đang tải...</div>}>
      <ClassroomClient
        classroomData={classroomData.data}
        increamentLike={increamentLike}
        decreamentLike={decreamentLike}
      />
    </Suspense>
  );
}

export default ClassroomPage;
