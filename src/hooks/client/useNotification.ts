import { markAsReadNoti } from "@/actions/notiActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface NotifactionParams {
    notificationId: number;
}

export const useNotification = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async (data: NotifactionParams) => {
            if (!session) {
                throw new Error("Không tìm thấy session");
            }
            
            return await markAsReadNoti({
                notiId: data.notificationId
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};