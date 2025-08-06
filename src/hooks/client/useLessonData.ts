"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { LessonType } from '@/types/lesson';
import { getAllLessonDataByUserId } from '@/actions/lessonAction';
import { useCallback } from 'react';

interface UseLessonDataProps {
  classname?: string;
  mode?: "default" | "free";
  enabled?: boolean;
}

export function useLessonData({ 
  classname, 
  mode = "default", 
  enabled = true 
}: UseLessonDataProps = {}) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const queryKey = ['lessons', session?.user?.userId, mode, classname];

  const {
    data: allLessons = [],
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!session?.user?.userId) {
        throw new Error('User not authenticated');
      }
      
      const response = await getAllLessonDataByUserId({
        userId: session.user.userId,
        mode
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch lessons');
      }
      
      return response.data;
    },
    enabled: enabled && !!session?.user?.userId,
    staleTime: 0, 
    gcTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
  });

  // Filter lessons by classname if provided
  const filteredLessons = classname 
    ? allLessons.filter(
        (lesson: LessonType) =>
          lesson.className?.toLowerCase() === classname.toLowerCase()
      )
    : allLessons;

  // Invalidate and refetch lessons
  const invalidateLessons = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['lessons'] });
    return refetch();
  }, [queryClient, refetch]);

  // Update specific lesson in cache
  const updateLessonInCache = useCallback((lessonId: number, updates: Partial<LessonType>) => {
    queryClient.setQueryData(queryKey, (oldData: LessonType[] | undefined) => {
      if (!oldData) return oldData;
      
      return oldData.map(lesson => 
        lesson.lessonId === lessonId 
          ? { ...lesson, ...updates }
          : lesson
      );
    });
  }, [queryClient, queryKey]);

  // Remove lesson from cache (for unlike functionality)
  const removeLessonFromCache = useCallback((lessonId: number) => {
    queryClient.setQueryData(queryKey, (oldData: LessonType[] | undefined) => {
      if (!oldData) return oldData;
      return oldData.filter(lesson => lesson.lessonId !== lessonId);
    });
  }, [queryClient, queryKey]);

  return {
    lessons: filteredLessons,
    allLessons,
    isLoading,
    isFetching,
    error,
    refetch,
    invalidateLessons,
    updateLessonInCache,
    removeLessonFromCache
  };
}

// Hook riêng cho classroom specific data
export function useClassroomLessons(classname: string, mode: "default" | "free" = "default") {
  return useLessonData({ classname, mode });
}