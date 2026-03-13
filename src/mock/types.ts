// ============================================
// TYPE DEFINITIONS
// ============================================

// Vocabulary item for games
export type VocabularyItem = {
    id: number;
    word: string;
    meaning?: string;
    image: string;
    audio: string;
    scramble?: boolean;
};

// Game types: typing (gõ lại từ), choice (lựa chọn từ), recording (ghi âm)
export type GameType = 'typing' | 'choice' | 'recording';

// Game data configuration
export type GameData = {
    gameType: GameType;
    vocabularyItems: VocabularyItem[];
};

// Lesson detail (video or game)
export type LessonDetail = {
    id: number;
    type: 'video' | 'game';
    title: string;
    score: string;
    iconType: string;
    videoUrl?: string;
    gameData?: GameData;
};

// Individual lesson within a week
export type WeeklyLesson = {
    id: string;
    category_title: string;
    title: string;
    image: string;
    progress?: number;
    lessonDetails: LessonDetail[];
};

// Weekly lesson configuration by grade
export type WeeklyLessonConfig = {
    [week: number]: {
        weekTitle: string;
        lessons: WeeklyLesson[];
    };
};

// Grade-based lesson configuration
export type GradeLessonConfig = {
    [grade: number]: WeeklyLessonConfig;
};
