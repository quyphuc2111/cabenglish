// Re-export all types for backward compatibility
export type {
    VocabularyItem,
    GameType,
    GameData,
    LessonDetail,
    WeeklyLesson,
    WeeklyLessonConfig,
    GradeLessonConfig
} from './types';

import type { WeeklyLesson, LessonDetail, WeeklyLessonConfig, GradeLessonConfig } from './types';

// ============================================
// GRADE DATA IMPORTS
// ============================================

import { GRADE_1_LESSONS } from './grade1';
import { GRADE_2_LESSONS } from './grade2';
import { GRADE_3_LESSONS } from './grade3';
import { GRADE_4_LESSONS } from './grade4';
import { GRADE_5_LESSONS } from './grade5';

// ============================================
// MAIN EXPORT: ALL GRADES LESSONS
// ============================================

export const LESSONS_BY_GRADE: GradeLessonConfig = {
    1: GRADE_1_LESSONS,
    2: GRADE_2_LESSONS,
    3: GRADE_3_LESSONS,
    4: GRADE_4_LESSONS,
    5: GRADE_5_LESSONS
};

// Backward compatibility: Default to Grade 5
export const WEEKLY_LESSONS: WeeklyLessonConfig = GRADE_5_LESSONS;

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getLessonsByGradeAndWeek = (grade: number, week: number): WeeklyLesson[] => {
    return LESSONS_BY_GRADE[grade]?.[week]?.lessons || [];
};

export const getLessonsByWeek = (week: number, grade: number = 5): WeeklyLesson[] => {
    return getLessonsByGradeAndWeek(grade, week);
};

export const getLessonDetailsByGrade = (grade: number, week: number, lessonId: string): LessonDetail[] => {
    const weekData = LESSONS_BY_GRADE[grade]?.[week];
    if (!weekData) return [];
    const lesson = weekData.lessons.find(l => l.id === lessonId);
    return lesson?.lessonDetails || [];
};

export const getLessonDetails = (week: number, lessonId: string, grade: number = 5): LessonDetail[] => {
    return getLessonDetailsByGrade(grade, week, lessonId);
};

export const getAvailableWeeksByGrade = (grade: number): number[] => {
    const gradeData = LESSONS_BY_GRADE[grade];
    if (!gradeData) return [];
    return Object.keys(gradeData).map(Number).sort((a, b) => a - b);
};

export const getAvailableWeeks = (grade: number = 5): number[] => {
    return getAvailableWeeksByGrade(grade);
};

export const getWeekTitleByGrade = (grade: number, week: number): string => {
    return LESSONS_BY_GRADE[grade]?.[week]?.weekTitle || `Tuần ${week}`;
};

export const getWeekTitle = (week: number, grade: number = 5): string => {
    return getWeekTitleByGrade(grade, week);
};

export const findLessonByIdInGrade = (grade: number, lessonId: string): { week: number; lesson: WeeklyLesson } | null => {
    const gradeData = LESSONS_BY_GRADE[grade];
    if (!gradeData) return null;
    for (const [week, data] of Object.entries(gradeData)) {
        const lesson = data.lessons.find(l => l.id === lessonId);
        if (lesson) return { week: Number(week), lesson };
    }
    return null;
};

export const findLessonById = (lessonId: string, grade: number = 5): { week: number; lesson: WeeklyLesson } | null => {
    return findLessonByIdInGrade(grade, lessonId);
};

export const findLessonByIdGlobal = (lessonId: string): { grade: number; week: number; lesson: WeeklyLesson } | null => {
    if (!lessonId) return null;
    for (const [gradeStr, gradeData] of Object.entries(LESSONS_BY_GRADE)) {
        const grade = Number(gradeStr);
        if (isNaN(grade) || !gradeData) continue;
        for (const [weekStr, weekData] of Object.entries(gradeData)) {
            const week = Number(weekStr);
            if (isNaN(week) || !weekData || !weekData.lessons) continue;
            const lesson = weekData.lessons.find(l => l && l.id === lessonId);
            if (lesson) return { grade, week, lesson };
        }
    }
    return null;
};

// ============================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================

export const MAIN_LESSON = WEEKLY_LESSONS[1]?.lessons.map(lesson => ({
    category_title: lesson.category_title,
    title: lesson.title,
    image: lesson.image
})) || [];

export const ACCOUNT_INFOMATION = {
    userInfo: { username: 'bktdev', password: '123123123123', vipDays: 999999999 },
    studentInfo: { name: 'Bê Ka Tê', dateOfBirth: new Date(), gender: 0, className: 'Lớp 5C187' },
    parentInfo: { name: 'Bê Ka Tê Dad', dateOfBirth: null, gender: 0, phoneNumber: '0983312386', email: null, address: null }
};

export const AVATAR_SYSTEM = [
    { image: 'https://static.edupia.vn/images/avata_system/51.png', alt: 'avata_system' },
    { image: 'https://static.edupia.vn/images/avata_system/52.png', alt: 'avata_system' },
    { image: 'https://static.edupia.vn/images/avata_system/53.png', alt: 'avata_system' },
    { image: 'https://static.edupia.vn/images/avata_system/54.png', alt: 'avata_system' },
    { image: 'https://static.edupia.vn/images/avata_system/55.png', alt: 'avata_system' },
    { image: 'https://static.edupia.vn/images/avata_system/56.png', alt: 'avata_system' },
    { image: 'https://static.edupia.vn/images/avata_system/57.png', alt: 'avata_system' },
    { image: 'https://static.edupia.vn/images/avata_system/58.png', alt: 'avata_system' },
    { image: 'https://static.edupia.vn/images/avata_system/59.png', alt: 'avata_system' },
    { image: 'https://static.edupia.vn/images/avata_system/60.png', alt: 'avata_system' }
];
