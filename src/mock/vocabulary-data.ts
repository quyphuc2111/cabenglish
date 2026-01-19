// Re-export types from data.ts for backward compatibility
export type { VocabularyItem } from "./data";

import { WEEKLY_LESSONS, VocabularyItem } from "./data";

export type UnitVocabularyConfig = {
    [unitSlug: string]: {
        [week: number]: VocabularyItem[];
    };
};

/**
 * Legacy LESSON_VOCABULARY export
 * Extracts vocabulary from WEEKLY_LESSONS for backward compatibility
 */
export const LESSON_VOCABULARY: Record<string, VocabularyItem[]> = (() => {
    const vocabulary: Record<string, VocabularyItem[]> = {
        'default': []
    };
    
    // Build vocabulary map from WEEKLY_LESSONS
    Object.values(WEEKLY_LESSONS).forEach(weekData => {
        weekData.lessons.forEach(lesson => {
            lesson.lessonDetails.forEach(detail => {
                if (detail.type === 'game' && detail.gameData?.vocabularyItems) {
                    // Only add if not already exists or if current has more items
                    if (!vocabulary[lesson.id] || vocabulary[lesson.id].length < detail.gameData.vocabularyItems.length) {
                        vocabulary[lesson.id] = detail.gameData.vocabularyItems;
                    }
                }
            });
        });
    });
    
    // Set default vocabulary from first available
    const firstLesson = Object.keys(vocabulary).find(k => k !== 'default' && vocabulary[k].length > 0);
    if (firstLesson) {
        vocabulary['default'] = vocabulary[firstLesson];
    }
    
    return vocabulary;
})();

/**
 * Get vocabulary by unit and week
 */
export const vocabularyData: UnitVocabularyConfig = {
    "unit-1": {
        13: LESSON_VOCABULARY['23123'] || [],
    },
    "unit-2": {
        14: LESSON_VOCABULARY['1401'] || []
    }
};

/**
 * Get vocabulary items for a specific lesson
 */
export const getVocabularyByLessonId = (lessonId: string): VocabularyItem[] => {
    return LESSON_VOCABULARY[lessonId] || LESSON_VOCABULARY['default'] || [];
};
