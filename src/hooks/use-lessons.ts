import {
  createLesson,
  getAllLessonsByClassIdUnitId
} from "@/app/api/actions/lessons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LessonAdminType } from "@/types/lesson";
import {
  deleteLessonAdminData,
  getSingleLessonAdminData,
  updateLessonAdminDataByClassIdUnitId
} from "@/actions/lessonAction";

interface LessonResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface LessonParams {
  lessonIds: string[];
  classId: number;
  unitId: number;
}

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
        [
          "lessons-by-class-id-unit-id",
          String(variables.classId),
          String(variables.unitId)
        ],
        ["lessons-by-class-id", String(variables.classId)],
        ["lessons"]
      ];

      queryKeys.forEach((queryKey) => {
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

export const useGetSingleLesson = (
  lessonId: number,
  classId: number,
  unitId: number
) => {
  return useQuery({
    queryKey: ["lesson", lessonId, classId, unitId],
    queryFn: async () => {
      if (!lessonId || !classId || !unitId) return null;

      const response = await getSingleLessonAdminData({
        lessonId: lessonId,
        classId: classId,
        unitId: unitId
      });
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!lessonId && !!classId && !!unitId
  });
};

export const useUpdateLessonByClassIdUnitId = (
  lessonId: number,
  classId: number,
  unitId: number
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LessonAdminType) =>
      updateLessonAdminDataByClassIdUnitId({
        lessonId: lessonId,
        classId: classId,
        unitId: unitId,
        lessonData: data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lesson", lessonId, classId, unitId]
      });
      queryClient.invalidateQueries({
        queryKey: ["lessons-by-class-id-unit-id", classId, unitId]
      });
    }
  });
};

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation<LessonResponse, Error, LessonParams>({
    mutationFn: async (params: LessonParams) => {
      if (!params.lessonIds?.length) {
        throw new Error("Không tìm thấy thông tin lessonIds");
      }

      if (!params.classId) {
        throw new Error("Không tìm thấy thông tin classId");
      }

      if (!params.unitId) {
        throw new Error("Không tìm thấy thông tin unitId");
      }

      const response = await deleteLessonAdminData({
        lessonIds: params.lessonIds,
        classId: params.classId,
        unitId: params.unitId
      });

      console.log("response", response);

      if (!response.success) {
        throw new Error(response.error || "Có lỗi xảy ra khi xóa bài học");
      }

      return response;
    },
    onSuccess: (_, variables) => {
      // Invalidate các queries liên quan
      const queryKeys = [
        [
          "lessons-by-class-id-unit-id",
          String(variables.classId),
          String(variables.unitId)
        ],
        ["lessons-by-class-id", String(variables.classId)],
        ["lessons"]
      ];

      queryKeys.forEach((queryKey) => {
        queryClient.invalidateQueries({
          queryKey,
          exact: false
        });
      });
    },
    onError: (error: Error) => {
      console.error("Delete lesson error:", error.message);
    }
  });
}
