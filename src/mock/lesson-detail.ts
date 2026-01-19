import { WEEKLY_LESSONS, LessonDetail, findLessonById } from "./data";

// Re-export types for backward compatibility
export type { LessonDetail as LessonTabConfig } from "./data";

/**
 * Get lesson details by lesson ID
 * Searches across all weeks to find the lesson
 */
export const getLessonDetailsById = (lessonId: string): LessonDetail[] => {
    const result = findLessonById(lessonId);
    if (result) {
        return result.lesson.lessonDetails;
    }
    
    // Return default lesson details if not found
    return LESSON_DETAILS['default'];
};

/**
 * Legacy LESSON_DETAILS export for backward compatibility
 * Maps lesson IDs to their details
 */
export const LESSON_DETAILS: Record<string, LessonDetail[]> = (() => {
    const details: Record<string, LessonDetail[]> = {
        'default': [
            {
                id: 1,
                type: 'video',
                title: 'Video bài giảng',
                score: "100",
                iconType: 'video',
                videoUrl: "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4"
            },
            {
                id: 2,
                type: 'game',
                title: 'Luyện tập',
                score: "100",
                iconType: 'game',
                gameData: {
                    gameType: 'typing',
                    vocabularyItems: []
                }
            }
        ]
    };
    
    // Build from WEEKLY_LESSONS
    Object.values(WEEKLY_LESSONS).forEach(weekData => {
        weekData.lessons.forEach(lesson => {
            details[lesson.id] = lesson.lessonDetails;
        });
    });
    
    return details;
})();
