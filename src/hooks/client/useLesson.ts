import { decrementLessonLike, incrementLessonLike } from "@/actions/lessonAction";
import { updateProgressSectionContent } from "@/actions/progressAction";
import { updateSectionLocked } from "@/actions/sectionAction";
import { updateSectionContentLocked } from "@/actions/sectionContentAction";
import { 
  updateSectionLocked as updateSectionLockedFromLocked,
  updateLessonLocked 
} from "@/actions/lockedAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface ProgressSectionContent {
    userId: string;
    sectionContentId: string | number;
    progress: 0 | 1;
}

interface SectionContentLocked {
    userId: string;
    sectionContentId: string | number;
}

interface SectionLocked {
    userId?: string;
    sectionId: number;
}

export const useUpdateProgressSectionContent = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async (data: ProgressSectionContent) => {
            if (!session?.user?.userId) {
                throw new Error("Không tìm thấy session hoặc userId");
            }
            
            return await updateProgressSectionContent({
                userId: session.user.userId,
                sectionContentId: data.sectionContentId,
                progress: data.progress
            });
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ["lesson", lessonId, classId, unitId] });
            // queryClient.invalidateQueries({ queryKey: ["lessons-by-class-id-unit-id", classId, unitId] });
        },
    });
};

export const useUpdateSectionContentLocked = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async (data: SectionContentLocked) => {
            if (!session?.user?.userId) {
                throw new Error("Không tìm thấy session hoặc userId");
            }

            const response = await updateSectionContentLocked({
                userId: session.user.userId,
                scID: data.sectionContentId
            });

            return response;
        },  
    });
};  


export const useUpdateSectionLocked = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async (data: SectionLocked) => {
            if (!session?.user?.userId) {
                throw new Error("Không tìm thấy session hoặc userId");
            }

            const response = await updateSectionLocked({
                userId: session.user.userId,
                sectionId: data.sectionId.toString()
            });

            return response;
        },  
    });
};  

export const useUpdateSectionLockedFromLocked = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async (data: { sectionId: number }) => {
            if (!session?.user?.userId) {
                throw new Error("Không tìm thấy session hoặc userId");
            }

            const response = await updateSectionLockedFromLocked({
                userId: session.user.userId,
                sectionId: data.sectionId
            });

            return response;
        },
        onSuccess: () => {
            // Invalidate các query liên quan để refresh data
            queryClient.invalidateQueries({ queryKey: ["sections"] });
            queryClient.invalidateQueries({ queryKey: ["lesson"] });
        },
    });
};

export const useUpdateLessonLocked = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    return useMutation({
        mutationFn: async (data: { lessonId: number }) => {
            if (!session?.user?.userId) {
                throw new Error("Không tìm thấy session hoặc userId");
            }

            const response = await updateLessonLocked({
                userId: session.user.userId,
                lessonId: data.lessonId
            });

            return response;
        },
        onSuccess: () => {
            // Invalidate các query liên quan để refresh data
            queryClient.invalidateQueries({ queryKey: ["lessons"] });
            queryClient.invalidateQueries({ queryKey: ["lesson"] });
            queryClient.invalidateQueries({ queryKey: ["classroom"] });
        },
    });
};

export const useLessonLike = () => {
    const queryClient = useQueryClient();
    
    const likeMutation = useMutation({
        mutationFn: async ({ lessonId, action }: { lessonId: string; action: 'like' | 'unlike' }) => {
            const response = action === 'like' 
                ? await incrementLessonLike(lessonId)
                : await decrementLessonLike(lessonId);
                
            return response;
        }
    });

    return likeMutation;
}

export const useAutoUnlockNextLesson = (lessonData: any[]) => {
    const { mutate: updateLessonLocked } = useUpdateLessonLocked();

    const checkAndUnlockNextLesson = useCallback(() => {
        if (!lessonData || lessonData.length === 0) return;

        // Sắp xếp lessons theo thứ tự (có thể theo lessonId hoặc order nếu có)
        const sortedLessons = [...lessonData].sort((a, b) => {
            // Sắp xếp theo lessonId hoặc bất kỳ field order nào có sẵn
            if (a.order && b.order) {
                return a.order - b.order;
            }
            return a.lessonId - b.lessonId;
        });

        // Tìm bài học cuối cùng đã hoàn thành (progress === 1)
        let lastCompletedIndex = -1;
        for (let i = 0; i < sortedLessons.length; i++) {
            if (sortedLessons[i].progress === 1) {
                lastCompletedIndex = i;
            }
        }

        // Nếu có bài học đã hoàn thành và còn bài học tiếp theo
        if (lastCompletedIndex >= 0 && lastCompletedIndex < sortedLessons.length - 1) {
            const nextLesson = sortedLessons[lastCompletedIndex + 1];
            
            // Kiểm tra xem bài học tiếp theo có bị khóa không
            if (nextLesson.isLocked) {
                
                updateLessonLocked(
                    { lessonId: nextLesson.lessonId },
                    {
                        onSuccess: () => {
                            console.log(`Đã mở khóa bài học: ${nextLesson.lessonName}`);
                        },
                        onError: (error) => {
                            console.error(`Lỗi khi mở khóa bài học ${nextLesson.lessonId}:`, error);
                        }
                    }
                );
            }
        }
    }, [lessonData, updateLessonLocked]);

    // Tự động check khi lessonData thay đổi
    useEffect(() => {
        checkAndUnlockNextLesson();
    }, [checkAndUnlockNextLesson]);

    // Return function để có thể gọi manual nếu cần
    return {
        checkAndUnlockNextLesson
    };
};

// Thêm một hook để handle lesson data updates
export const useLessonDataUpdate = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const triggerUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  return { updateTrigger, triggerUpdate };
};