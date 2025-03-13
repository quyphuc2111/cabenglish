import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSchoolWeekAdminData, getAllSchoolWeekAdminData, getSingleSchoolWeekAdminData, updateSchoolWeekAdminData } from "@/actions/schoolWeekAction";
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
      mutationFn: (data: SchoolWeekFormValues) => createSchoolWeek(data),
      onSuccess: () => {
        // Invalidate và refetch
        queryClient.invalidateQueries({ queryKey: ["school-weeks"] });
      },
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
      enabled: !!swId,
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
          queryKey: ["school-week", variables.swId] 
        });
      }
    });
  };

  export const useDeleteSchoolWeek = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (swId: number) => deleteSchoolWeekAdminData({swId: swId}),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["school-weeks"] });
      },
    });
  };
  
  