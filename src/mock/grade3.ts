import { VocabularyItem, WeeklyLessonConfig, LessonDetail } from './types';

// ============================================
// VOCABULARY DATA - GRADE 3
// ============================================

const VOCAB_SUBJECTS: VocabularyItem[] = [
    {
        id: 1,
        word: "math",
        meaning: "toán học",
        image: "/grade3_subjects.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/math.mp3"
    },
    {
        id: 2,
        word: "science",
        meaning: "khoa học",
        image: "/grade3_subjects.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/science.mp3"
    },
    {
        id: 3,
        word: "art",
        meaning: "mỹ thuật",
        image: "/grade3_subjects.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/art.mp3"
    },
    {
        id: 4,
        word: "music",
        meaning: "âm nhạc",
        image: "/grade3_subjects.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/music.mp3"
    },
    {
        id: 5,
        word: "PE",
        meaning: "thể dục",
        image: "/grade3_subjects.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/pe.mp3"
    }
];

const VOCAB_TIME: VocabularyItem[] = [
    {
        id: 1,
        word: "morning",
        meaning: "buổi sáng",
        image: "/grade3_time.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/morning.mp3"
    },
    {
        id: 2,
        word: "afternoon",
        meaning: "buổi chiều",
        image: "/grade3_time.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/afternoon.mp3"
    },
    {
        id: 3,
        word: "evening",
        meaning: "buổi tối",
        image: "/grade3_time.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/evening.mp3"
    },
    {
        id: 4,
        word: "night",
        meaning: "ban đêm",
        image: "/grade3_time.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/night.mp3"
    },
    {
        id: 5,
        word: "clock",
        meaning: "đồng hồ",
        image: "/grade3_time.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/clock.mp3"
    }
];

const VOCAB_WEATHER: VocabularyItem[] = [
    {
        id: 1,
        word: "sunny",
        meaning: "trời nắng",
        image: "/grade3_weather.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/sunny.mp3"
    },
    {
        id: 2,
        word: "rainy",
        meaning: "trời mưa",
        image: "/grade3_weather.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/rainy.mp3"
    },
    {
        id: 3,
        word: "cloudy",
        meaning: "trời nhiều mây",
        image: "/grade3_weather.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/cloudy.mp3"
    },
    {
        id: 4,
        word: "windy",
        meaning: "trời có gió",
        image: "/grade3_weather.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/windy.mp3"
    },
    {
        id: 5,
        word: "snowy",
        meaning: "trời có tuyết",
        image: "/grade3_weather.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/snowy.mp3"
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

const VOCAB_FAMILY: VocabularyItem[] = [
    { id: 1, word: "father", meaning: "bố", image: "/vocab_father.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/father.mp3" },
    { id: 2, word: "mother", meaning: "mẹ", image: "/vocab_mother.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/mother.mp3" },
    { id: 3, word: "grandfather", meaning: "ông", image: "/vocab_grandfather.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/grandfather.mp3" },
    { id: 4, word: "grandmother", meaning: "bà", image: "/vocab_grandmother.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/grandmother.mp3" },
    { id: 5, word: "brother", meaning: "em trai", image: "/vocab_brother.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/brother.mp3" },
    { id: 6, word: "sister", meaning: "em gái", image: "/vocab_sister.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/sister.mp3" }
];

export const GRADE_3_LESSONS: WeeklyLessonConfig = {
    1: {
        weekTitle: "Tuần 1: Gia đình",
        lessons: [
            {
                id: 'g3-w1-l1',
                category_title: 'Unit 1 - Lesson: Từ vựng',
                title: 'Gia đình',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video bài giảng',
                        score: "100",
                        iconType: 'video',
                        videoUrl: "/AICourse/videocanva/3. Family.mp4"
                    },
                    {
                        id: 2,
                        type: 'game',
                        title: 'Gõ lại từ vựng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'typing', vocabularyItems: VOCAB_FAMILY }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Chọn từ vựng đúng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'choice', vocabularyItems: VOCAB_FAMILY }
                    },
                    {
                        id: 4,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "50",
                        iconType: 'game',
                        gameData: { gameType: 'recording', vocabularyItems: VOCAB_FAMILY }
                    }
                ]
            },


             {
                id: 'g111-w3-l1',
                category_title: 'Unit 1 - Lesson: Từ vựng',
                title: 'Những hoạt động thường ngày của trẻ',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_TIME)
            }
        ]
    },
    2: {
        weekTitle: "Tuần 2: Thời gian",
        lessons: [
            {
                id: 'g3-w2-l1',
                category_title: 'Unit 2 - Lesson 1',
                title: 'Các buổi trong ngày',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_TIME)
            },
            {
                id: 'g3-w2-l2',
                category_title: 'Unit 2 - Lesson 2',
                title: 'Hỏi và trả lời về giờ',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_TIME)
            },
            {
                id: 'g3-w2-l3',
                category_title: 'Unit 2 - Lesson 3',
                title: 'Thời khóa biểu',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/3.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_TIME)
            }
        ]
    },
    3: {
        weekTitle: "Tuần 3: Thời tiết",
        lessons: [
            {
                id: 'g3-w3-l1',
                category_title: 'Unit 3 - Lesson 1',
                title: 'Các loại thời tiết',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_WEATHER)
            },
            {
                id: 'g3-w3-l2',
                category_title: 'Unit 3 - Lesson 2',
                title: 'Hỏi về thời tiết',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_WEATHER)
            }
        ]
    },
    4: {
        weekTitle: "Tuần 4: Ôn tập",
        lessons: [
            {
                id: 'g3-w4-l1',
                category_title: 'Review',
                title: 'Ôn tập tổng hợp',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/4.png',
                progress: 0,
                lessonDetails: createLessonDetails([...VOCAB_SUBJECTS, ...VOCAB_WEATHER])
            }
        ]
    }
};
