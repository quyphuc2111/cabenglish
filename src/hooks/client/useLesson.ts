import { decrementLessonLike, incrementLessonLike } from "@/actions/lessonAction";
import { updateProgressSectionContent } from "@/actions/progressAction";
import { updateSectionContentLocked, updateSectionLocked } from "@/actions/sectionAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

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
            if (!session) {
                throw new Error("Không tìm thấy session");
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
            if (!session) {
                throw new Error("Không tìm thấy session");
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
            if (!session) {
                throw new Error("Không tìm thấy session");
            }

            const response = await updateSectionLocked({
                userId: session.user.userId,
                sectionId: data.sectionId
            });

            return response;
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