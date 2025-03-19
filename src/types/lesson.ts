export interface LessonType {
    classId: number;
    unitId: number;
    lessonId: number;
    schoolWeekId: number;
    lessonName: string;
    className: string;
    unitName: string;
    imageUrl: string;
    schoolWeek: number;
    progress: number;
    numLiked: number;
    isLocked: boolean;
}

export interface LessonAdminType {
   schoolweek?: number;
   lessonId: number;
   lessonName: string;
   imageUrl: string;
   numLiked: number;
   order: number;
   isActive: boolean;
}

