import { VocabularyItem, WeeklyLessonConfig, LessonDetail } from './types';

// ============================================
// VOCABULARY DATA - GRADE 4
// ============================================

const VOCAB_DAILY_ROUTINE: VocabularyItem[] = [
    {
        id: 1,
        word: "wake up",
        meaning: "thức dậy",
        image: "/grade4_daily_routine.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/wakeup.mp3"
    },
    {
        id: 2,
        word: "brush teeth",
        meaning: "đánh răng",
        image: "/grade4_daily_routine.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/brushteeth.mp3"
    },
    {
        id: 3,
        word: "eat breakfast",
        meaning: "ăn sáng",
        image: "/grade4_daily_routine.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/breakfast.mp3"
    },
    {
        id: 4,
        word: "go to school",
        meaning: "đi học",
        image: "/grade4_daily_routine.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/gotoschool.mp3"
    },
    {
        id: 5,
        word: "do homework",
        meaning: "làm bài tập",
        image: "/grade4_daily_routine.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/homework.mp3"
    }
];

const VOCAB_HOBBIES: VocabularyItem[] = [
    {
        id: 1,
        word: "reading",
        meaning: "đọc sách",
        image: "/grade4_hobbies.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/reading.mp3"
    },
    {
        id: 2,
        word: "drawing",
        meaning: "vẽ",
        image: "/grade4_hobbies.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/drawing.mp3"
    },
    {
        id: 3,
        word: "swimming",
        meaning: "bơi lội",
        image: "/grade4_hobbies.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/swimming.mp3"
    },
    {
        id: 4,
        word: "dancing",
        meaning: "nhảy múa",
        image: "/grade4_hobbies.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/dancing.mp3"
    },
    {
        id: 5,
        word: "playing soccer",
        meaning: "chơi bóng đá",
        image: "/grade4_hobbies.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/soccer.mp3"
    }
];

const VOCAB_FOOD: VocabularyItem[] = [
    {
        id: 1,
        word: "apple",
        meaning: "táo",
        image: "/grade4_food.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/apple.mp3"
    },
    {
        id: 2,
        word: "banana",
        meaning: "chuối",
        image: "/grade4_food.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/banana.mp3"
    },
    {
        id: 3,
        word: "rice",
        meaning: "cơm",
        image: "/grade4_food.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/rice.mp3"
    },
    {
        id: 4,
        word: "chicken",
        meaning: "thịt gà",
        image: "/grade4_food.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/chicken.mp3"
    },
    {
        id: 5,
        word: "milk",
        meaning: "sữa",
        image: "/grade4_food.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/milk.mp3"
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

const VOCAB_WEATHER: VocabularyItem[] = [
    { id: 1, word: "sunny", meaning: "trời nắng", image: "/grade3_weather.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/sunny.mp3" },
    { id: 2, word: "rainy", meaning: "trời mưa", image: "/grade3_weather.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/rainy.mp3" },
    { id: 3, word: "foggy", meaning: "sương mù", image: "/grade3_weather.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/foggy.mp3" },
    { id: 4, word: "hot", meaning: "nóng", image: "/grade3_weather.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hot.mp3" },
    { id: 5, word: "cold", meaning: "lạnh", image: "/grade3_weather.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/cold.mp3" },
    { id: 6, word: "cloudy", meaning: "nhiều mây", image: "/grade3_weather.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/cloudy.mp3" },
    { id: 7, word: "windy", meaning: "có gió", image: "/grade3_weather.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/windy.mp3" }
];

export const GRADE_4_LESSONS: WeeklyLessonConfig = {
    1: {
        weekTitle: "Tuần 1: Thời tiết",
        lessons: [
            {
                id: 'g4-w1-l1',
                category_title: 'Unit 1 - Lesson 1',
                title: 'Thời tiết',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video bài giảng',
                        score: "100",
                        iconType: 'video',
                        videoUrl: "/AICourse/videocanva/4.Weather Thời tiết.mp4"
                    },
                    {
                        id: 2,
                        type: 'game',
                        title: 'Gõ lại từ vựng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'typing', vocabularyItems: VOCAB_WEATHER }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Chọn từ vựng đúng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'choice', vocabularyItems: VOCAB_WEATHER }
                    },
                    {
                        id: 4,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "50",
                        iconType: 'game',
                        gameData: { gameType: 'recording', vocabularyItems: VOCAB_WEATHER }
                    }
                ]
            },


                {
                id: 'g111-w3-l1',
                category_title: 'Unit 1 - Lesson: Từ vựng',
                title: 'Đồ ăn',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_HOBBIES)
            }
        ]
    },
    2: {
        weekTitle: "Tuần 2: Sở thích",
        lessons: [
            {
                id: 'g4-w2-l1',
                category_title: 'Unit 2 - Lesson 1',
                title: 'Các hoạt động giải trí',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_HOBBIES)
            },
            {
                id: 'g4-w2-l2',
                category_title: 'Unit 2 - Lesson 2',
                title: 'Sở thích của tôi',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_HOBBIES)
            },
            {
                id: 'g4-w2-l3',
                category_title: 'Unit 2 - Lesson 3',
                title: 'Hỏi về sở thích',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/3.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_HOBBIES)
            }
        ]
    },
    3: {
        weekTitle: "Tuần 3: Đồ ăn thức uống",
        lessons: [
            {
                id: 'g4-w3-l1',
                category_title: 'Unit 3 - Lesson 1',
                title: 'Các loại thực phẩm',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_FOOD)
            },
            {
                id: 'g4-w3-l2',
                category_title: 'Unit 3 - Lesson 2',
                title: 'Món ăn yêu thích',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_FOOD)
            }
        ]
    },
    4: {
        weekTitle: "Tuần 4: Ôn tập tổng hợp",
        lessons: [
            {
                id: 'g4-w4-l1',
                category_title: 'Review',
                title: 'Ôn tập Unit 1-3',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/4.png',
                progress: 0,
                lessonDetails: createLessonDetails([...VOCAB_DAILY_ROUTINE, ...VOCAB_HOBBIES])
            }
        ]
    }
};
