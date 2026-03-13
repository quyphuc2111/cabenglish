import { VocabularyItem, WeeklyLessonConfig, LessonDetail } from './types';

// ============================================
// VOCABULARY DATA - GRADE 1
// ============================================

const VOCAB_GREETINGS: VocabularyItem[] = [
    {
        id: 1,
        word: "hello",
        meaning: "xin chào",
        image: "/grade1_school.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3"
    },
    {
        id: 2,
        word: "goodbye",
        meaning: "tạm biệt",
        image: "/grade1_school.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/goodbye.mp3"
    },
    {
        id: 3,
        word: "thanks",
        meaning: "cảm ơn",
        image: "/grade1_school.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/thanks.mp3"
    },
    {
        id: 4,
        word: "please",
        meaning: "làm ơn",
        image: "/grade1_school.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/please.mp3"
    },
    {
        id: 5,
        word: "sorry",
        meaning: "xin lỗi",
        image: "/grade1_school.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/sorry.mp3"
    }
];

const VOCAB_COLORS: VocabularyItem[] = [
    {
        id: 1,
        word: "red",
        meaning: "màu đỏ",
        image: "/grade1_colors.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/red.mp3"
    },
    {
        id: 2,
        word: "blue",
        meaning: "màu xanh dương",
        image: "/grade1_colors.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/blue.mp3"
    },
    {
        id: 3,
        word: "yellow",
        meaning: "màu vàng",
        image: "/grade1_colors.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/yellow.mp3"
    },
    {
        id: 4,
        word: "green",
        meaning: "màu xanh lá",
        image: "/grade1_colors.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/green.mp3"
    },
    {
        id: 5,
        word: "orange",
        meaning: "màu cam",
        image: "/grade1_colors.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/orange.mp3"
    }
];

const VOCAB_ANIMALS: VocabularyItem[] = [
    {
        id: 1,
        word: "cat",
        meaning: "con mèo",
        image: "/grade1_animals.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/cat.mp3"
    },
    {
        id: 2,
        word: "dog",
        meaning: "con chó",
        image: "/grade1_animals.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/dog.mp3"
    },
    {
        id: 3,
        word: "bird",
        meaning: "con chim",
        image: "/grade1_animals.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/bird.mp3"
    },
    {
        id: 4,
        word: "fish",
        meaning: "con cá",
        image: "/grade1_animals.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/fish.mp3"
    },
    {
        id: 5,
        word: "rabbit",
        meaning: "con thỏ",
        image: "/grade1_animals.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/rabbit.mp3"
    }
];

const VOCAB_NUMBERS: VocabularyItem[] = [
    {
        id: 1,
        word: "one",
        meaning: "số một",
        image: "/grade1_school.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/one.mp3"
    },
    {
        id: 2,
        word: "two",
        meaning: "số hai",
        image: "/grade1_school.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/two.mp3"
    },
    {
        id: 3,
        word: "three",
        meaning: "số ba",
        image: "/grade1_school.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/three.mp3"
    },
    {
        id: 4,
        word: "four",
        meaning: "số bốn",
        image: "/grade1_school.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/four.mp3"
    },
    {
        id: 5,
        word: "five",
        meaning: "số năm",
        image: "/grade1_school.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/five.mp3"
    }
];

const ALL_COUNTING_VOCAB: VocabularyItem[] = [
    { id: 1, word: "one", meaning: "số 1", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/one.mp3" },
    { id: 2, word: "two", meaning: "số 2", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/two.mp3" },
    { id: 3, word: "three", meaning: "số 3", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/three.mp3" },
    { id: 4, word: "four", meaning: "số 4", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/four.mp3" },
    { id: 5, word: "five", meaning: "số 5", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/five.mp3" },
    { id: 6, word: "six", meaning: "số 6", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/six.mp3" },
    { id: 7, word: "seven", meaning: "số 7", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/seven.mp3" },
    { id: 8, word: "eight", meaning: "số 8", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/eight.mp3" },
    { id: 9, word: "nine", meaning: "số 9", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/nine.mp3" },
    { id: 10, word: "ten", meaning: "số 10", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/ten.mp3" },
    { id: 11, word: "eleven", meaning: "số 11", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/eleven.mp3" },
    { id: 12, word: "twelve", meaning: "số 12", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/twelve.mp3" },
    { id: 13, word: "thirteen", meaning: "số 13", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/thirteen.mp3" },
    { id: 14, word: "fourteen", meaning: "số 14", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/fourteen.mp3" },
    { id: 15, word: "fifteen", meaning: "số 15", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/fifteen.mp3" },
    { id: 16, word: "sixteen", meaning: "số 16", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/sixteen.mp3" },
    { id: 17, word: "seventeen", meaning: "số 17", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/seventeen.mp3" },
    { id: 18, word: "eighteen", meaning: "số 18", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/eighteen.mp3" },
    { id: 19, word: "nineteen", meaning: "số 19", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/nineteen.mp3" },
    { id: 20, word: "twenty", meaning: "số 20", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/twenty.mp3" }
];

const getRandomCountingVocab = (count: number = 8): VocabularyItem[] => {
    const shuffled = [...ALL_COUNTING_VOCAB].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((item, idx) => ({ ...item, id: idx + 1 }));
};

const VOCAB_COUNTING: VocabularyItem[] = getRandomCountingVocab(5);

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

export const GRADE_1_LESSONS: WeeklyLessonConfig = {
    1: {
        weekTitle: "Tuần 1: Làm quen với tiếng Anh",
        lessons: [
            {
                id: 'g1-w1-l1',
                category_title: 'Unit 1 - Lesson 1',
                title: 'Học đếm số',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video bài giảng',
                        score: "100",
                        iconType: 'video',
                        videoUrl: "/AICourse/videocanva/1.Học đếm số.mp4"
                    },
                    {
                        id: 2,
                        type: 'game',
                        title: 'Gõ lại từ vựng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'typing', vocabularyItems: VOCAB_COUNTING }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Chọn từ vựng đúng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'choice', vocabularyItems: VOCAB_COUNTING }
                    },
                    {
                        id: 4,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "50",
                        iconType: 'game',
                        gameData: { gameType: 'recording', vocabularyItems: VOCAB_COUNTING }
                    }
                ]
            },
        ]
    },
    2: {
        weekTitle: "Tuần 2: Động vật và số đếm",
        lessons: [
            {
                id: 'g1-w2-l1',
                category_title: 'Unit 2 - Lesson 1',
                title: 'Động vật thân thiện',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_ANIMALS)
            },
            {
                id: 'g1-w2-l2',
                category_title: 'Unit 2 - Lesson 2',
                title: 'Đếm số từ 1 đến 5',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_NUMBERS)
            }
        ]
    },
    3: {
        weekTitle: "Tuần 3: Ôn tập",
        lessons: [
            {
                id: 'g1-w3-l1',
                category_title: 'Review',
                title: 'Ôn tập Unit 1 & 2',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/4.png',
                progress: 0,
                lessonDetails: createLessonDetails([...VOCAB_GREETINGS, ...VOCAB_COLORS])
            }
        ]
    }
};
