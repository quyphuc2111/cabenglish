import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getAllLessonDataByUserId } from '@/actions/lessonAction';
import { getUserInfo } from '@/actions/userAction';
import { LessonType } from '@/types/lesson';

// Query key factory
const lessonKeys = {
  all: ['lessons'] as const,
  lists: () => [...lessonKeys.all, 'list'] as const,
  list: (userId: string, mode?: string) => [...lessonKeys.lists(), userId, mode] as const,
  classroom: (userId: string, mode: string, classname: string) => 
    [...lessonKeys.list(userId, mode), 'classroom', classname] as const,
};

export const useLessonData = (userId?: string) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  
  const currentUserId = userId || session?.user?.userId;

  // Fetch user mode
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo', currentUserId],
    queryFn: async () => {
      if (!currentUserId) throw new Error('UserId is required');
      const response = await getUserInfo({ userId: currentUserId });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch user info');
      }
      return response.data;
    },
    enabled: !!currentUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch lessons data
  const {
    data: allLessons = [],
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: lessonKeys.list(currentUserId || '', userInfo?.mode || ''),
    queryFn: async () => {
      if (!currentUserId) throw new Error('UserId is required');
      const response = await getAllLessonDataByUserId({ userId: currentUserId });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch lessons');
      }
      // Ensure we return an array
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!currentUserId && !!userInfo,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  // Helper functions
  const invalidateLessons = () => {
    queryClient.invalidateQueries({ 
      queryKey: lessonKeys.list(currentUserId || '', userInfo?.mode || '') 
    });
  };

  const updateLessonInCache = (lessonId: number, updates: Partial<LessonType>) => {
    queryClient.setQueryData(
      lessonKeys.list(currentUserId || '', userInfo?.mode || ''),
      (oldData: LessonType[] | undefined) => {
        if (!Array.isArray(oldData)) return [];
        return oldData.map(lesson => 
          lesson.lessonId === lessonId 
            ? { ...lesson, ...updates }
            : lesson
        );
      }
    );
  };

  const removeLessonFromCache = (lessonId: number) => {
    queryClient.setQueryData(
      lessonKeys.list(currentUserId || '', userInfo?.mode || ''),
      (oldData: LessonType[] | undefined) => {
        if (!Array.isArray(oldData)) return [];
        return oldData.filter(lesson => lesson.lessonId !== lessonId);
      }
    );
  };

  return {
    lessons: allLessons,
    isLoading,
    isFetching,
    error,
    refetch,
    invalidateLessons,
    updateLessonInCache,
    removeLessonFromCache,
    userMode: userInfo?.mode,
  };
};

// Hook for classroom-specific lessons - Optimized version
export const useClassroomLessons = (classname?: string) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  
  const currentUserId = session?.user?.userId;

  // Stable query key parts
  const stableUserId = React.useMemo(() => currentUserId || '', [currentUserId]);
  const stableClassname = React.useMemo(() => classname || '', [classname]);

  // Fetch user mode first with stable key
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo', stableUserId],
    queryFn: async () => {
      if (!stableUserId) throw new Error('UserId is required');
      const response = await getUserInfo({ userId: stableUserId });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch user info');
      }
      return response.data;
    },
    enabled: !!stableUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Stable mode
  const stableMode = React.useMemo(() => userInfo?.mode || 'default', [userInfo?.mode]);

  // Stable query key for classroom lessons
  const classroomQueryKey = React.useMemo(() => 
    lessonKeys.classroom(stableUserId, stableMode, stableClassname),
    [stableUserId, stableMode, stableClassname]
  );

  // Fetch classroom-specific lessons with stable query key
  const {
    data: classroomLessons = [],
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: classroomQueryKey,
    queryFn: async () => {
      if (!stableUserId) throw new Error('UserId is required');
      const response = await getAllLessonDataByUserId({ 
        userId: stableUserId,
        mode: stableMode as "default" | "free"
      });
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch lessons');
      }
      
      // Filter by classname on server response
      const lessons = Array.isArray(response.data) ? response.data : [];
      return stableClassname 
        ? lessons.filter(lesson => 
            lesson.className?.toLowerCase() === stableClassname.toLowerCase()
          )
        : lessons;
    },
    enabled: !!stableUserId && !!userInfo && !!stableClassname,
    staleTime: 2 * 60 * 1000, // 2 minutes - increased for stability
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Disable to reduce calls
    refetchOnMount: false, // Disable to reduce calls
    refetchOnReconnect: true,
  });

  // Memoized helper functions
  const invalidateLessons = React.useCallback(() => {
    queryClient.invalidateQueries({ 
      queryKey: classroomQueryKey
    });
  }, [queryClient, classroomQueryKey]);

  const updateLessonInCache = React.useCallback((lessonId: number, updates: Partial<LessonType>) => {
    queryClient.setQueryData(
      classroomQueryKey,
      (oldData: LessonType[] | undefined) => {
        if (!Array.isArray(oldData)) return [];
        return oldData.map(lesson => 
          lesson.lessonId === lessonId 
            ? { ...lesson, ...updates }
            : lesson
        );
      }
    );
  }, [queryClient, classroomQueryKey]);

  const removeLessonFromCache = React.useCallback((lessonId: number) => {
    queryClient.setQueryData(
      classroomQueryKey,
      (oldData: LessonType[] | undefined) => {
        if (!Array.isArray(oldData)) return [];
        return oldData.filter(lesson => lesson.lessonId !== lessonId);
      }
    );
  }, [queryClient, classroomQueryKey]);

  return {
    lessons: classroomLessons,
    isLoading,
    isFetching,
    error,
    refetch,
    invalidateLessons,
    updateLessonInCache,
    removeLessonFromCache,
    userMode: stableMode,
  };
};