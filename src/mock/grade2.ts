import { VocabularyItem, WeeklyLessonConfig, LessonDetail } from './types';

// ============================================
// VOCABULARY DATA - GRADE 2
// ============================================

const VOCAB_FAMILY: VocabularyItem[] = [
    {
        id: 1,
        word: "mother",
        meaning: "mẹ",
        image: "/grade2_family.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/mother.mp3"
    },
    {
        id: 2,
        word: "father",
        meaning: "bố",
        image: "/grade2_family.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/father.mp3"
    },
    {
        id: 3,
        word: "sister",
        meaning: "chị/em gái",
        image: "/grade2_family.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/sister.mp3"
    },
    {
        id: 4,
        word: "brother",
        meaning: "anh/em trai",
        image: "/grade2_family.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/brother.mp3"
    },
    {
        id: 5,
        word: "grandmother",
        meaning: "bà",
        image: "/grade2_family.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/grandmother.mp3"
    }
];

const VOCAB_SCHOOL_SUPPLIES: VocabularyItem[] = [
    {
        id: 1,
        word: "pen",
        meaning: "bút mực",
        image: "/vocab_pen.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/pen.mp3"
    },
    {
        id: 2,
        word: "pencil",
        meaning: "bút chì",
        image: "/vocab_pencil.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/pencil.mp3"
    },
    {
        id: 3,
        word: "eraser",
        meaning: "tẩy",
        image: "/vocab_eraser.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/eraser.mp3"
    },
    {
        id: 4,
        word: "ruler",
        meaning: "thước kẻ",
        image: "/vocab_ruler.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/ruler.mp3"
    },
    {
        id: 5,
        word: "school bag",
        meaning: "cặp sách",
        image: "/vocab_schoolbag.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/schoolbag.mp3"
    },
    {
        id: 6,
        word: "notebook",
        meaning: "vở",
        image: "/vocab_notebook.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/notebook.mp3"
    },
    {
        id: 7,
        word: "glue",
        meaning: "keo dán",
        image: "/vocab_glue.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/glue.mp3"
    }
];

const VOCAB_HOUSE: VocabularyItem[] = [
    {
        id: 1,
        word: "bedroom",
        meaning: "phòng ngủ",
        image: "/grade2_house_rooms.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/bedroom.mp3"
    },
    {
        id: 2,
        word: "kitchen",
        meaning: "nhà bếp",
        image: "/grade2_house_rooms.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/kitchen.mp3"
    },
    {
        id: 3,
        word: "living room",
        meaning: "phòng khách",
        image: "/grade2_house_rooms.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/livingroom.mp3"
    },
    {
        id: 4,
        word: "bathroom",
        meaning: "phòng tắm",
        image: "/grade2_house_rooms.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/bathroom.mp3"
    },
    {
        id: 5,
        word: "garden",
        meaning: "vườn",
        image: "/grade2_house_rooms.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/garden.mp3"
    }
];

const createLessonDetails = (vocabItems: VocabularyItem[]): LessonDetail[] => [
    {
        id: 1,
        type: 'video',
        title: 'Video bài giảng',
        score: "0",
        iconType: 'video',
        videoUrl: "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4"
    },
    {
        id: 2,
        type: 'game',
        title: 'Gõ lại từ vựng',
        score: "0",
        iconType: 'game',
        gameData: { gameType: 'typing', vocabularyItems: vocabItems }
    },
    {
        id: 3,
        type: 'game',
        title: 'Chọn từ vựng đúng',
        score: "0",
        iconType: 'game',
        gameData: { gameType: 'choice', vocabularyItems: vocabItems }
    },
    {
        id: 4,
        type: 'game',
        title: 'Ghi âm phát âm',
        score: "0",
        iconType: 'game',
        gameData: { gameType: 'recording', vocabularyItems: vocabItems }
    }
];

export const GRADE_2_LESSONS: WeeklyLessonConfig = {
    1: {
        weekTitle: "Tuần 1: Học tập",
        lessons: [
            {
                id: 'g2-w1-l1',
                category_title: 'Unit 1 - Lesson 1',
                title: 'Các công cụ học tập',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video bài giảng',
                        score: "100",
                        iconType: 'video',
                        videoUrl: "/AICourse/videocanva/2. Các công cụ học tập.mp4"
                    },
                    {
                        id: 2,
                        type: 'game',
                        title: 'Gõ lại từ vựng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'typing', vocabularyItems: VOCAB_SCHOOL_SUPPLIES }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Chọn từ vựng đúng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'choice', vocabularyItems: VOCAB_SCHOOL_SUPPLIES }
                    },
                    {
                        id: 4,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "50",
                        iconType: 'game',
                        gameData: { gameType: 'recording', vocabularyItems: VOCAB_SCHOOL_SUPPLIES }
                    }
                ]
            }
        ]
    },
    2: {
        weekTitle: "Tuần 2: Đồ dùng học tập",
        lessons: [
            {
                id: 'g2-w2-l1',
                category_title: 'Unit 2 - Lesson 1',
                title: 'Đồ dùng trong cặp',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_SCHOOL_SUPPLIES)
            },
            {
                id: 'g2-w2-l2',
                category_title: 'Unit 2 - Lesson 2',
                title: 'Hỏi mượn đồ dùng',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_SCHOOL_SUPPLIES)
            }
        ]
    },
    3: {
        weekTitle: "Tuần 3: Ngôi nhà của tôi",
        lessons: [
            {
                id: 'g2-w3-l1',
                category_title: 'Unit 3 - Lesson 1',
                title: 'Các phòng trong nhà',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_HOUSE)
            },
            {
                id: 'g2-w3-l2',
                category_title: 'Unit 3 - Lesson 2',
                title: 'Mô tả ngôi nhà',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_HOUSE)
            }
        ]
    }
};
