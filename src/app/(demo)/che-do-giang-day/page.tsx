// @ts-nocheck
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TeachingModeClient from "./teaching-mode-client";
import { Suspense } from "react";
import { switchModeAction } from "@/actions/lockedAction";
import { updateUserInfo } from "@/actions/userAction";
import { Loading } from "@/components/common/loading";

async function TeachingMode() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const initialTeachingMode = session.user.mode;
  const updateUser = async ({mode}: {mode: string}) => {
    "use server"
    const userInfo = await updateUserInfo({
      userId: session.user.userId,
      userInfo: {
        mode: mode,
        email: session.user.email || "",
        language: session.user.language || "",
        theme: session.user.theme || ""
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
        initialMode={initialTeachingMode as "defaultMode" | "freeMode"}
        userId={session.user.userId}
        // userInfo={userInfo}
        updateUserInfo={updateUser}
        switchMode={switchMode}
      />
    </Suspense>
  );
}

export default TeachingMode;
