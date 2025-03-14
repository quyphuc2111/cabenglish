import { createLesson, getAllLessonsByClassIdUnitId } from "@/app/api/actions/lessons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLessonsByClassIdUnitId(classId: string, unitId: string) {
    return useQuery({
      queryKey: ["lessons-by-class-id-unit-id", classId, unitId],
      queryFn: () => getAllLessonsByClassIdUnitId(classId, unitId),
      enabled: !!classId && !!unitId
    });
}


export function useCreateLessonByClassIdUnitId(classId: number | null, unitId: number | null) {
    const queryClient = useQueryClient();
  
    if (!classId) {
      console.error('Missing or invalid classId:', classId);
    }

    if (!unitId) {
        console.error('Missing or invalid unitId:', unitId);
    }
  
    return useMutation({
      mutationFn: (data: any) => {
        if (!classId) {
          throw new Error('Missing classId');
        }
        if (!unitId) {
            throw new Error('Missing unitId');
        }
        return createLesson({
          lessonData: data,
          classId: classId,
          unitId: unitId
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["lessons-by-class-id-unit-id", String(classId), String(unitId)],
          exact: false,
          refetchType: "all"
        });
        
        queryClient.invalidateQueries({
          queryKey: ["lessons-by-class-id-unit-id", String(classId), String(unitId)],
          exact: true
        });
      },
    });
  }
  
//   export function useUpdateUnitByClassId(classId: number) {
//     const queryClient = useQueryClient();
  
//     return useMutation({
//       mutationFn: (data: UnitsFormValues) => updateUnitByClassId({
//         unitData: data,
//         classId: classId
//       }),
//       onSuccess: () => {
//         // Invalidate và refetch
//         queryClient.invalidateQueries({ queryKey: ["units-by-class-id"] });
//       },
//     });
//   }
  