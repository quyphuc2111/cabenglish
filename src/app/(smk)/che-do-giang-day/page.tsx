// @ts-nocheck
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TeachingModeClient from "./teaching-mode-client";
import { Suspense } from "react";
import { switchModeAction } from "@/actions/lockedAction";
import { updateUserInfo, getUserInfo } from "@/actions/userAction";
import { Loading } from "@/components/common/loading";

async function TeachingMode() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const updateUser = async ({mode}: {mode: string}) => {
    "use server"
    // Lấy thông tin user hiện tại từ database
    const currentUserInfo = await getUserInfo({
      userId: session.user.userId
    });

    if (!currentUserInfo.success) {
      throw new Error(currentUserInfo.error || "Không thể lấy thông tin user");
    }

    const userInfo = await updateUserInfo({
      userId: session.user.userId,
      userInfo: {
        mode: mode,
        email: currentUserInfo.data?.email || "",
        language: currentUserInfo.data?.language || "",
        theme: currentUserInfo.data?.theme || "",
        is_firstlogin: false
      }
    });

    return userInfo;
  }

  const switchMode = async ({mode}: {mode: string}) => {
    "use server"
    const switchModeResponse = await switchModeAction({
      userId: session.user.userId,
      mode: mode
    });
    return switchModeResponse
  }
  

  return (
    <Suspense fallback={<Loading />}>
      <TeachingModeClient
        userId={session.user.userId}
        updateUserInfo={updateUser}
        switchMode={switchMode}
      />
    </Suspense>
  );
}

export default TeachingMode;
