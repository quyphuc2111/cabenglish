import { getAdminDashboardData } from "@/actions/adminDashboardAction";
import { useQuery } from "@tanstack/react-query";

export function useAdminDashboard() {
    return useQuery({
      queryKey: ["adminDashboard"],
      queryFn: () => getAdminDashboardData()
    });
  }