import { deleteUnitsByClassId } from "@/actions/unitsAction";
import { createUnitByClassId, getAllUnitsByClassId, createManyUnitsByClassId, updateUnitByClassId } from "@/app/api/actions/units";
import { UnitsFormValues } from "@/lib/validations/units";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUnitByClassId(classId: number | string) {
  return useQuery({
    queryKey: ["units-by-class-id", classId],
    queryFn: () => getAllUnitsByClassId(classId),
    enabled: !!classId
  });
}

export function useCreateUnitByClassId(classId: number | null) {
  const queryClient = useQueryClient();

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
      
      // Invalidate validation queries để cập nhật validation real-time
      queryClient.invalidateQueries({ queryKey: ["units-validation"] });
      queryClient.invalidateQueries({ queryKey: ["units-validation", classId] });
    }
  });
}

export function useCreateManyUnitsByClassId(classId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UnitsFormValues[]) => {
      if (!classId) {
        throw new Error('Missing classId');
      }
      return createManyUnitsByClassId({
        unitsData: data,
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
      
      // Invalidate validation queries để cập nhật validation real-time
      queryClient.invalidateQueries({ queryKey: ["units-validation"] });
      queryClient.invalidateQueries({ queryKey: ["units-validation", classId] });
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
      queryClient.invalidateQueries({ queryKey: ["units-by-class-id", String(classId)] });
      // Invalidate validation queries để cập nhật validation real-time
      queryClient.invalidateQueries({ queryKey: ["units-validation"] });
      queryClient.invalidateQueries({ queryKey: ["units-validation", classId] });
    },
  });
}

export function useDeleteUnits(classId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (unitIds: number[]) => deleteUnitsByClassId(classId, unitIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units-by-class-id"] });
      queryClient.invalidateQueries({ queryKey: ["units-by-class-id", String(classId)] });
      // Invalidate validation queries để cập nhật validation real-time
      queryClient.invalidateQueries({ queryKey: ["units-validation"] });
      queryClient.invalidateQueries({ queryKey: ["units-validation", classId] });
    },
  });
}
