import { getNotificationListByUserId } from "@/actions/notificationAction";
import ClientPanelLayout from "@/components/admin-panel/client-panel-layout";
import UserStoreProvider from "@/components/user-store-provider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

export default async function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin-v2");
  }
  const userId = session.user.userId as string;
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await getNotificationListByUserId({userId});
      return response.data || [];
    }
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserStoreProvider userId={userId}>
        <ClientPanelLayout>{children}</ClientPanelLayout>
      </UserStoreProvider>
    </HydrationBoundary>
  );
}
