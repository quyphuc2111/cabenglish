import { getNotificationListByUserId } from "@/actions/notificationAction";
import ClientPanelLayout from "@/components/admin-panel/client-panel-layout";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }
  const notificationList = await getNotificationListByUserId({userId: session.user.userId});

  return <ClientPanelLayout notificationList={notificationList.data}>{children}</ClientPanelLayout>;
}
