import { createUnitByClassId, getAllUnitsByClassId } from "@/app/api/actions/units";
import { UnitsFormValues } from "@/lib/validations/units";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUnitByClassId(classId: number | string) {
  return useQuery({
    queryKey: ["units-by-class-id", classId],
    queryFn: () => getAllUnitsByClassId(classId),
    enabled: !!classId
  });
}

// export const useGetSingleUnit = (ntId: string | null) => {
//   return useQuery({
//     queryKey: ["notitype", ntId],
//     queryFn: async () => {
//       if (!ntId) return null;
//       const response = await getSingleNotiTypeAdminData({ 
//         ntId: parseInt(ntId) 
//       });
//       if (response.error) {
//         throw new Error(response.error);
//       }
//       return response.data;
//     },
//     enabled: !!ntId,
//   });
// };

export function useCreateUnitByClassId(classId: number | null) {
  const queryClient = useQueryClient();

  // if (!classId) {
  //   console.error('Missing or invalid classId:', classId);
  //   return null;
  // }

  return useMutation({
    mutationFn: (data: UnitsFormValues) => {
      if (!classId) {
        throw new Error('Missing classId');
      }
      return createUnitByClassId({
        unitData: data,
        classId: classId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["units-by-class-id"],
        exact: false,
        refetchType: "all"
      });
      
      queryClient.invalidateQueries({
        queryKey: ["units-by-class-id", String(classId)],
        exact: true
      });
    }
  });
}

export function useUpdateUnitByClassId(classId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UnitsFormValues) => updateUnitByClassId({
      unitData: data,
      classId: classId
    }),
    onSuccess: () => {
      // Invalidate và refetch
      queryClient.invalidateQueries({ queryKey: ["units-by-class-id"] });
    },
  });
}
