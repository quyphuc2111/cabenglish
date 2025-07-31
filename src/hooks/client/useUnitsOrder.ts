"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getUnitByClassId } from "@/actions/unitsAction";
import { LessonType } from "@/types/lesson";
import { Units } from "@/types/unit";
import { useMemo } from "react";

interface UseUnitsOrderProps {
  classId: string | number;
  lessons: LessonType[];
}

interface UseUnitsOrderReturn {
  sortedLessons: LessonType[];
  units: Units[];
  isLoading: boolean;
  error: string | null;
}

export const useUnitsOrder = ({ classId, lessons }: UseUnitsOrderProps): UseUnitsOrderReturn => {
  const { data: session } = useSession();

  // Fetch units data
  const { data: unitsData, isLoading, error } = useQuery({
    queryKey: ["units", classId, session?.user?.userId],
    queryFn: async () => {
      if (!session?.user?.userId) {
        throw new Error("User ID not found");
      }
      return await getUnitByClassId(classId, session.user.userId);
    },
    enabled: !!session?.user?.userId && !!classId,
  });

  // Sort lessons by unit order
  const sortedLessons = useMemo(() => {
    if (!unitsData || !Array.isArray(unitsData) || !lessons.length) {
      return lessons;
    }

    const units: Units[] = unitsData;
    
    // Create a map of unitId to order for quick lookup
    const unitOrderMap = new Map<number, number>();
    units.forEach(unit => {
      unitOrderMap.set(unit.unitId, unit.order);
    });
    // Sort lessons by unit order, then by lesson order within each unit
    const sorted = [...lessons].sort((a, b) => {
      const unitOrderA = unitOrderMap.get(a.unitId) ?? Number.MAX_SAFE_INTEGER;
      const unitOrderB = unitOrderMap.get(b.unitId) ?? Number.MAX_SAFE_INTEGER;
      
      // First sort by unit order
      if (unitOrderA !== unitOrderB) {
        return unitOrderA - unitOrderB;
      }
      
      // If same unit, sort by lesson order
      return a.lessonOrder - b.lessonOrder;
    });

    return sorted;
  }, [unitsData, lessons]);

  return {
    sortedLessons,
    units: unitsData || [],
    isLoading,
    error: error?.message || unitsData?.error || null
  };
};