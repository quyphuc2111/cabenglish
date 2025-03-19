import { createLesson, getAllLessonsByClassIdUnitId } from "@/app/api/actions/lessons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LessonAdminType } from "@/types/lesson";
import { getSingleLessonAdminData } from "@/actions/lessonAction";

export function useLessonsByClassIdUnitId(classId: string, unitId: string) {
    return useQuery({
      queryKey: ["lessons-by-class-id-unit-id", classId, unitId],
      queryFn: () => getAllLessonsByClassIdUnitId(classId, unitId),
      enabled: !!classId && !!unitId
    });
}

interface CreateLessonParams {
  lessonData: LessonAdminType[];
  classId: number;
  unitId: number;
}

interface CreateLessonResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export function useCreateLessonByClassIdUnitId() {
  const queryClient = useQueryClient();

  return useMutation<CreateLessonResponse, Error, CreateLessonParams>({
    mutationFn: async (params) => {
      if (!params.classId) {
        throw new Error("Không tìm thấy thông tin lớp học");
      }

      if (!params.unitId) {
        throw new Error("Không tìm thấy thông tin unit");
      }

      const response = await createLesson({
        lessonData: params.lessonData,
        classId: params.classId,
        unitId: params.unitId
      });

      if (!response.success) {
        throw new Error(response.error || "Có lỗi xảy ra khi tạo bài học");
      }

      return response;
    },

    onSuccess: (_, variables) => {
      // Invalidate các queries liên quan
      const queryKeys = [
        ["lessons-by-class-id-unit-id", String(variables.classId), String(variables.unitId)],
        ["lessons-by-class-id", String(variables.classId)],
        ["lessons"]
      ];

      queryKeys.forEach(queryKey => {
        queryClient.invalidateQueries({
          queryKey,
          exact: false
        });
      });
    },

    onError: (error) => {
      console.error("Create lesson error:", error);
    }
  });
}

export const useGetSingleLesson = (lessonId: string | null) => {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      if (!lessonId) return null;
      const response = await getSingleLessonAdminData({ 
        lessonId: parseInt(lessonId) 
      });
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!lessonId,
  });
};
  
  // export function useUpdateUnitByClassId(classId: number) {
  //   const queryClient = useQueryClient();
  
  //   return useMutation({
  //     mutationFn: (data: UnitsFormValues) => updateUnitByClassId({
  //       unitData: data,
  //       classId: classId
  //     }),
  //     onSuccess: () => {
  //       // Invalidate và refetch
  //       queryClient.invalidateQueries({ queryKey: ["units-by-class-id"] });
  //     },
  //   });
  // }
  