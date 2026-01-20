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

// ============================================
// VOCABULARY DATA
// ============================================

const VOCABULARY_PLACES: VocabularyItem[] = [
    {
        id: 1,
        word: "hometown",
        meaning: "quê hương",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/hometown.mp3",
        image: "https://static.edupia.vn/images/word/2018/05/07/hometown.png",
    },
    {
        id: 2,
        word: "pretty",
        meaning: "đẹp",
        audio: "https://static.edupia.vn/resource/voice/2018/05/28/pretty.mp3",
        image: "https://static.edupia.vn/images/word/2018/05/30/pretty.jpg",
    },
    {
        id: 3,
        word: "quiet",
        meaning: "yên tĩnh",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/quiet.mp3",
        image: "https://static.edupia.vn/images/word/2018/05/07/quiet.png",
    },
    {
        id: 4,
        word: "crowded",
        meaning: "đông đúc",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/crowded.mp3",
        image: "https://static.edupia.vn/resource/images/2018/05/07/crowded.png",
    },
    {
        id: 5,
        word: "modern",
        meaning: "hiện đại",
        audio: "https://static.edupia.vn/resource/voice/2018/05/28/modern.mp3",
        image: "https://static.edupia.vn//resource//images//2018//05//13//mordern.png",
    },
];

const VOCABULARY_ADDRESS: VocabularyItem[] = [
    {
        id: 1,
        word: "address",
        meaning: "địa chỉ",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/address.mp3",
        image: "https://static.edupia.vn/images/word/2018/05/07/address.png",
    },
    {
        id: 2,
        word: "street",
        meaning: "đường phố",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/street.mp3",
        image: "https://static.edupia.vn/images/word/2018/05/07/street.png",
    },
    {
        id: 3,
        word: "village",
        meaning: "làng",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/village.mp3",
        image: "https://static.edupia.vn/images/word/2018/05/07/village.png",
    },
    {
        id: 4,
        word: "city",
        meaning: "thành phố",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/city.mp3",
        image: "https://static.edupia.vn/images/word/2018/05/07/city.png",
    },
    {
        id: 5,
        word: "country",
        meaning: "nông thôn / đất nước",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/country.mp3",
        image: "https://static.edupia.vn/images/word/2018/05/07/country.png",
    },
];

const VOCABULARY_ACTIVITIES: VocabularyItem[] = [
    {
        id: 1,
        word: "always",
        meaning: "luôn luôn",
        image: "https://static.edupia.vn/images/word/2018/06/01/always.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/always.mp3",
    },
    {
        id: 2,
        word: "usually",
        meaning: "thường xuyên",
        image: "https://static.edupia.vn/images/word/2018/06/01/usually.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/usually.mp3",
    },
    {
        id: 3,
        word: "often",
        meaning: "thường",
        image: "https://static.edupia.vn/images/word/2018/06/01/often.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/often.mp3",
    },
    {
        id: 4,
        word: "sometimes",
        meaning: "đôi khi",
        image: "https://static.edupia.vn/images/word/2018/06/01/sometimes.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/sometimes.mp3",
    },
    {
        id: 5,
        word: "never",
        meaning: "không bao giờ",
        image: "https://static.edupia.vn/images/word/2018/06/01/never.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/never.mp3",
    },
];

const VOCABULARY_FREQUENCY: VocabularyItem[] = [
    {
        id: 1,
        word: "wake up",
        meaning: "thức dậy",
        image: "https://static.edupia.vn/images/word/2018/06/01/wakeup.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/wakeup.mp3",
    },
    {
        id: 2,
        word: "go to bed",
        meaning: "đi ngủ",
        image: "https://static.edupia.vn/images/word/2018/06/01/gotobed.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/gotobed.mp3",
    },
    {
        id: 3,
        word: "have breakfast",
        meaning: "ăn sáng",
        image: "https://static.edupia.vn/images/word/2018/06/01/breakfast.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/breakfast.mp3",
    },
    {
        id: 4,
        word: "do homework",
        meaning: "làm bài tập",
        image: "https://static.edupia.vn/images/word/2018/06/01/homework.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/homework.mp3",
    },
    {
        id: 5,
        word: "watch TV",
        meaning: "xem TV",
        image: "https://static.edupia.vn/images/word/2018/06/01/watchtv.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/watchtv.mp3",
    },
];

const VOCABULARY_PHONICS: VocabularyItem[] = [
    {
        id: 1,
        word: "today",
        meaning: "hôm nay",
        image: "https://static.edupia.vn/images/word/2018/06/01/today.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/today.mp3",
    },
    {
        id: 2,
        word: "happy",
        meaning: "vui vẻ",
        image: "https://static.edupia.vn/images/word/2018/06/01/happy.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/happy.mp3",
    },
    {
        id: 3,
        word: "answer",
        meaning: "câu trả lời",
        image: "https://static.edupia.vn/images/word/2018/06/01/answer.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/answer.mp3",
    },
];

// ============================================
// GRADE 5 WEEKLY LESSONS DATA
// ============================================

const GRADE_5_LESSONS: WeeklyLessonConfig = {
    1: {
        weekTitle: "Tuần 13: Unit 1 - Địa chỉ và nơi ở",
        lessons: [
        {
            id: '23123',
            category_title: 'Unit 1 - Lesson: Từ vựng',
            title: 'Chủ đề mô tả nơi chốn',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 80,
                lessonDetails: [
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
                        title: 'Gõ lại từ vựng',
                        score: "100",
                        iconType: 'game',
                        gameData: {
                            gameType: 'typing',
                            vocabularyItems: VOCABULARY_PLACES
                        }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Chọn từ vựng đúng',
                        score: "100",
                        iconType: 'game',
                        gameData: {
                            gameType: 'choice',
                            vocabularyItems: VOCABULARY_PLACES
                        }
                    },
                    {
                        id: 4,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "50",
                        iconType: 'game',
                        gameData: {
                            gameType: 'recording',
                            vocabularyItems: VOCABULARY_PLACES
                        }
                    },
                    {
                        id: 5,
                        type: 'video',
                        title: 'Video ôn tập',
                        score: "50",
                        iconType: 'video',
                        videoUrl: "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4"
                    }
                ]
        },
        {
            id: '1302',
            category_title: 'Unit 1 - Lesson: Từ vựng',
            title: 'Chủ đề địa chỉ',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 60,
                lessonDetails: [
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
                        title: 'Gõ lại từ vựng',
                        score: "100",
                        iconType: 'game',
                        gameData: {
                            gameType: 'typing',
                            vocabularyItems: VOCABULARY_ADDRESS
                        }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Chọn từ vựng đúng',
                        score: "80",
                        iconType: 'game',
                        gameData: {
                            gameType: 'choice',
                            vocabularyItems: VOCABULARY_ADDRESS
                        }
                    },
                    {
                        id: 4,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'recording',
                            vocabularyItems: VOCABULARY_ADDRESS
                        }
                    }
                ]
        },
        {
            id: '1303',
            category_title: 'Unit 1 - Lesson: Mẫu câu',
            title: 'Hỏi về địa chỉ và nơi ở của bạn',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 40,
                lessonDetails: [
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
                        title: 'Chọn câu trả lời đúng',
                        score: "100",
                        iconType: 'game',
                        gameData: {
                            gameType: 'choice',
                            vocabularyItems: VOCABULARY_ADDRESS
                        }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Ghi âm mẫu câu',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'recording',
                            vocabularyItems: VOCABULARY_ADDRESS
                        }
                    }
                ]
        },
        {
            id: '1304',
            category_title: 'Unit 1 - Lesson: Ngữ âm',
            title: 'Trọng âm từ',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/3.png',
                progress: 20,
                lessonDetails: [
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
                        title: 'Chọn trọng âm đúng',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'choice',
                            vocabularyItems: VOCABULARY_PHONICS
                        }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'recording',
                            vocabularyItems: VOCABULARY_PHONICS
                        }
                    }
                ]
        },
        {
            id: '1305',
            category_title: 'Unit 1 - Lesson: Luyện giao tiếp I-speak',
            title: 'Chủ đề "Địa chỉ của bạn là gì?"',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/5.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video hội thoại mẫu',
                        score: "0",
                        iconType: 'video',
                        videoUrl: "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4"
                    },
                    {
                        id: 2,
                        type: 'game',
                        title: 'Luyện ghi âm hội thoại',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'recording',
                            vocabularyItems: VOCABULARY_ADDRESS
                        }
                    }
                ]
            }
        ]
    },
    2: {
        weekTitle: "Tuần 14: Unit 2 - Các hoạt động hàng ngày",
        lessons: [
        {
            id: '1401',
            category_title: 'Unit 2 - Lesson: Từ vựng',
            title: 'Chủ đề các hoạt động',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 75,
                lessonDetails: [
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
                        title: 'Gõ lại từ vựng',
                        score: "100",
                        iconType: 'game',
                        gameData: {
                            gameType: 'typing',
                            vocabularyItems: VOCABULARY_ACTIVITIES
                        }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Chọn từ vựng đúng',
                        score: "100",
                        iconType: 'game',
                        gameData: {
                            gameType: 'choice',
                            vocabularyItems: VOCABULARY_ACTIVITIES
                        }
                    },
                    {
                        id: 4,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "50",
                        iconType: 'game',
                        gameData: {
                            gameType: 'recording',
                            vocabularyItems: VOCABULARY_ACTIVITIES
                        }
                    }
                ]
        },
        {
            id: '1402',
            category_title: 'Unit 2 - Lesson: Từ vựng',
            title: 'Các trạng từ chỉ tần suất',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 50,
                lessonDetails: [
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
                        title: 'Gõ lại từ vựng',
                        score: "80",
                        iconType: 'game',
                        gameData: {
                            gameType: 'typing',
                            vocabularyItems: VOCABULARY_FREQUENCY
                        }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Chọn từ vựng đúng',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'choice',
                            vocabularyItems: VOCABULARY_FREQUENCY
                        }
                    },
                    {
                        id: 4,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'recording',
                            vocabularyItems: VOCABULARY_FREQUENCY
                        }
                    }
                ]
        },
        {
            id: '1403',
            category_title: 'Unit 2 - Lesson: Mẫu câu',
                title: 'Hỏi và trả lời bạn thường làm gì - Hỏi về tần suất làm một việc gì đó',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 30,
                lessonDetails: [
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
                        title: 'Chọn câu trả lời đúng',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'choice',
                            vocabularyItems: VOCABULARY_FREQUENCY
                        }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Ghi âm mẫu câu',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'recording',
                            vocabularyItems: VOCABULARY_FREQUENCY
                        }
                    }
                ]
        },
        {
            id: '1404',
            category_title: 'Unit 2 - Lesson: Ngữ âm',
            title: 'Trọng âm từ',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/3.png',
                progress: 15,
                lessonDetails: [
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
                        title: 'Chọn trọng âm đúng',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'choice',
                            vocabularyItems: VOCABULARY_PHONICS
                        }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'recording',
                            vocabularyItems: VOCABULARY_PHONICS
                        }
                    }
                ]
        },
        {
            id: '1405',
            category_title: 'Unit 2 - Lesson: Luyện giao tiếp I-speak',
            title: 'Chủ đề: "Mình luôn ngủ dậy sớm, còn bạn thì sao?"',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/5.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video hội thoại mẫu',
                        score: "0",
                        iconType: 'video',
                        videoUrl: "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4"
                    },
                    {
                        id: 2,
                        type: 'game',
                        title: 'Luyện ghi âm hội thoại',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'recording',
                            vocabularyItems: VOCABULARY_FREQUENCY
                        }
                    }
                ]
            }
        ]
    },
    3: {
        weekTitle: "Tuần 15: Unit 3 - Ôn tập",
        lessons: [
            {
                id: '1501',
                category_title: 'Unit 3 - Lesson: Ôn tập',
                title: 'Ôn tập từ vựng Unit 1 & 2',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/4.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video tổng hợp',
                        score: "0",
                        iconType: 'video',
                        videoUrl: "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4"
                    },
                    {
                        id: 2,
                        type: 'game',
                        title: 'Gõ lại từ vựng tổng hợp',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'typing',
                            vocabularyItems: [...VOCABULARY_PLACES, ...VOCABULARY_ACTIVITIES]
                        }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Trắc nghiệm tổng hợp',
                        score: "0",
                        iconType: 'game',
                        gameData: {
                            gameType: 'choice',
                            vocabularyItems: [...VOCABULARY_ADDRESS, ...VOCABULARY_FREQUENCY]
                        }
                    }
                ]
            }
        ]
    }
};

// ============================================
// GRADE 1-4 LESSONS DATA (Sample data - can be expanded)
// ============================================

const GRADE_1_LESSONS: WeeklyLessonConfig = {
    1: {
        weekTitle: "Tuần 1: Unit 1 - Greetings",
        lessons: [
            {
                id: 'g1-101',
                category_title: 'Unit 1 - Lesson: Vocabulary',
                title: 'Hello and Goodbye',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: [
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
                            vocabularyItems: VOCABULARY_PLACES
                        }
                    }
                ]
            }
        ]
    }
};

const GRADE_2_LESSONS: WeeklyLessonConfig = {
    1: {
        weekTitle: "Tuần 1: Unit 1 - My Family",
        lessons: [
            {
                id: 'g2-101',
                category_title: 'Unit 1 - Lesson: Vocabulary',
                title: 'Family Members',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video bài giảng',
                        score: "100",
                        iconType: 'video',
                        videoUrl: "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4"
                    }
                ]
            }
        ]
    }
};

const GRADE_3_LESSONS: WeeklyLessonConfig = {
    1: {
        weekTitle: "Tuần 1: Unit 1 - School",
        lessons: [
            {
                id: 'g3-101',
                category_title: 'Unit 1 - Lesson: Vocabulary',
                title: 'School Subjects',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video bài giảng',
                        score: "100",
                        iconType: 'video',
                        videoUrl: "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4"
                    }
                ]
            }
        ]
    }
};

const GRADE_4_LESSONS: WeeklyLessonConfig = {
    1: {
        weekTitle: "Tuần 1: Unit 1 - Daily Activities",
        lessons: [
            {
                id: 'g4-101',
                category_title: 'Unit 1 - Lesson: Vocabulary',
                title: 'My Day',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video bài giảng',
                        score: "100",
                        iconType: 'video',
                        videoUrl: "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4"
                    }
                ]
            }
        ]
    }
};

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

/**
 * Get lessons for a specific grade and week
 */
export const getLessonsByGradeAndWeek = (grade: number, week: number): WeeklyLesson[] => {
    return LESSONS_BY_GRADE[grade]?.[week]?.lessons || [];
};

/**
 * Get lessons for a specific week (default Grade 5 for backward compatibility)
 */
export const getLessonsByWeek = (week: number, grade: number = 5): WeeklyLesson[] => {
    return getLessonsByGradeAndWeek(grade, week);
};

/**
 * Get lesson details by grade, week and lesson ID
 */
export const getLessonDetailsByGrade = (grade: number, week: number, lessonId: string): LessonDetail[] => {
    const weekData = LESSONS_BY_GRADE[grade]?.[week];
    if (!weekData) return [];
    
    const lesson = weekData.lessons.find(l => l.id === lessonId);
    return lesson?.lessonDetails || [];
};

/**
 * Get lesson details by lesson ID and week (default Grade 5)
 */
export const getLessonDetails = (week: number, lessonId: string, grade: number = 5): LessonDetail[] => {
    return getLessonDetailsByGrade(grade, week, lessonId);
};

/**
 * Get all available weeks for a grade
 */
export const getAvailableWeeksByGrade = (grade: number): number[] => {
    const gradeData = LESSONS_BY_GRADE[grade];
    if (!gradeData) return [];
    return Object.keys(gradeData).map(Number).sort((a, b) => a - b);
};

/**
 * Get all available weeks (default Grade 5)
 */
export const getAvailableWeeks = (grade: number = 5): number[] => {
    return getAvailableWeeksByGrade(grade);
};

/**
 * Get week title by grade and week
 */
export const getWeekTitleByGrade = (grade: number, week: number): string => {
    return LESSONS_BY_GRADE[grade]?.[week]?.weekTitle || `Tuần ${week}`;
};

/**
 * Get week title (default Grade 5)
 */
export const getWeekTitle = (week: number, grade: number = 5): string => {
    return getWeekTitleByGrade(grade, week);
};

/**
 * Find lesson by ID across all weeks in a grade
 */
export const findLessonByIdInGrade = (grade: number, lessonId: string): { week: number; lesson: WeeklyLesson } | null => {
    const gradeData = LESSONS_BY_GRADE[grade];
    if (!gradeData) return null;
    
    for (const [week, data] of Object.entries(gradeData)) {
        const lesson = data.lessons.find(l => l.id === lessonId);
        if (lesson) {
            return { week: Number(week), lesson };
        }
    }
    return null;
};

/**
 * Find lesson by ID across all weeks (default Grade 5)
 */
export const findLessonById = (lessonId: string, grade: number = 5): { week: number; lesson: WeeklyLesson } | null => {
    return findLessonByIdInGrade(grade, lessonId);
};

/**
 * Find lesson by ID across ALL grades and weeks
 */
export const findLessonByIdGlobal = (lessonId: string): { grade: number; week: number; lesson: WeeklyLesson } | null => {
    for (const [gradeStr, gradeData] of Object.entries(LESSONS_BY_GRADE)) {
        const grade = Number(gradeStr);
        for (const [weekStr, weekData] of Object.entries(gradeData)) {
            const week = Number(weekStr);
            const lesson = weekData.lessons.find(l => l.id === lessonId);
            if (lesson) {
                return { grade, week, lesson };
            }
        }
    }
    return null;
};

// ============================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================

export const MAIN_LESSON = WEEKLY_LESSONS[13]?.lessons.map(lesson => ({
    category_title: lesson.category_title,
    title: lesson.title,
    image: lesson.image
})) || [];

export const ACCOUNT_INFOMATION = {
    userInfo: {
        username: 'bktdev',
        password: '123123123123',
        vipDays: 999999999
    },
    studentInfo: {
        name: 'Bê Ka Tê',
        dateOfBirth: new Date(),
        gender: 0,
        className: 'Lớp 5C187'
    },
    parentInfo: {
        name: 'Bê Ka Tê Dad',
        dateOfBirth: null,
        gender: 0,
        phoneNumber: '0983312386',
        email: null,
        address: null
    }
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
    { image: 'https://static.edupia.vn/images/avata_system/60.png', alt: 'avata_system' },
];
