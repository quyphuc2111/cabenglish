import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteSchoolWeekAdminData,
  getAllSchoolWeekAdminData,
  getSingleSchoolWeekAdminData,
  updateSchoolWeekAdminData
} from "@/actions/schoolWeekAction";
import { SchoolWeekFormValues } from "@/lib/validations/schoolweek";
import { createSchoolWeek } from "@/app/api/actions/schoolweek";

interface UpdateSchoolWeekParams {
  swId: number;
  data: SchoolWeekFormValues;
}

export function useSchoolWeek() {
  return useQuery({
    queryKey: ["school-weeks"],
    queryFn: () => getAllSchoolWeekAdminData()
  });
}

export function useCreateSchoolWeek() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SchoolWeekFormValues) => {
      const response = await createSchoolWeek(data);
      if (!response.success || response.error) {
        throw new Error(response.error || "Có lỗi xảy ra khi tạo tuần học 111");
      }
      
      return response;
    },
    onSuccess: () => {
      // Invalidate và refetch
      queryClient.invalidateQueries({ queryKey: ["school-weeks"] });
    },
    onError: (error: Error) => {
      // console.error("Create error:", error);
    }
  });
}

export const useGetSingleSchoolWeek = (swId: string | null) => {
  return useQuery({
    queryKey: ["school-week", swId],
    queryFn: async () => {
      if (!swId) return null;
      const response = await getSingleSchoolWeekAdminData({
        swId: parseInt(swId)
      });
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!swId
  });
};

export const useUpdateSchoolWeek = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ swId, data }: UpdateSchoolWeekParams) => {
      const response = await updateSchoolWeekAdminData({
        swId: swId,
        schoolWeekData: {
          value: data.value,
          swId: data.swId || 0
        }
      });

      if (response.error) {
        throw new Error(`API Error: ${response.error}`);
      }

      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["school-weeks"] });
      queryClient.invalidateQueries({
        queryKey: ["school-week", variables.swId.toString()]
      });
    }
  });
};

export const useDeleteSchoolWeek = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (swId: string) => {
      const result = await deleteSchoolWeekAdminData({ swId: swId });
      
      // Kiểm tra nếu có lỗi từ server action
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-weeks"] });
    }
  });
};

// Hook để kiểm tra schoolWeek theo ID
export function useCheckSchoolWeekExists(value: string | number) {
  const { data: schoolWeeks } = useSchoolWeek();
  
  return useQuery({
    queryKey: ["school-week-exists", value],
    queryFn: () => {
      if (!schoolWeeks) return false;
      return schoolWeeks.data.some((week: any) => week.value === value);
    },
    enabled: !!schoolWeeks,
  });
}

// Hàm kiểm tra sự tồn tại của tuần học
export async function checkSchoolWeekExists(value: string | number) {
  const response = await getAllSchoolWeekAdminData();
  if (!response.data) return false;
  return response.data.some((week: any) => week.value === value);
}


