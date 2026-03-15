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

// ============================================
// ADDITIONAL VOCABULARY DATA - GRADE 1
// ============================================

const VOCAB_FAMILY: VocabularyItem[] = [
    { id: 1, word: "mother", meaning: "mẹ", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/mother.mp3" },
    { id: 2, word: "father", meaning: "bố", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/father.mp3" },
    { id: 3, word: "sister", meaning: "chị/em gái", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/sister.mp3" },
    { id: 4, word: "brother", meaning: "anh/em trai", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/brother.mp3" },
    { id: 5, word: "grandmother", meaning: "bà", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/grandmother.mp3" },
    { id: 6, word: "grandfather", meaning: "ông", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/grandfather.mp3" },
];

const VOCAB_BODY: VocabularyItem[] = [
    { id: 1, word: "head", meaning: "đầu", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/head.mp3" },
    { id: 2, word: "eye", meaning: "mắt", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/eye.mp3" },
    { id: 3, word: "nose", meaning: "mũi", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/nose.mp3" },
    { id: 4, word: "mouth", meaning: "miệng", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/mouth.mp3" },
    { id: 5, word: "hand", meaning: "bàn tay", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hand.mp3" },
    { id: 6, word: "foot", meaning: "bàn chân", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/foot.mp3" },
];

const VOCAB_FOOD: VocabularyItem[] = [
    { id: 1, word: "apple", meaning: "quả táo", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/apple.mp3" },
    { id: 2, word: "banana", meaning: "quả chuối", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/banana.mp3" },
    { id: 3, word: "milk", meaning: "sữa", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/milk.mp3" },
    { id: 4, word: "bread", meaning: "bánh mì", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/bread.mp3" },
    { id: 5, word: "rice", meaning: "cơm", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/rice.mp3" },
    { id: 6, word: "water", meaning: "nước", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/water.mp3" },
];

const VOCAB_SCHOOL: VocabularyItem[] = [
    { id: 1, word: "pen", meaning: "bút bi", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/pen.mp3" },
    { id: 2, word: "pencil", meaning: "bút chì", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/pencil.mp3" },
    { id: 3, word: "book", meaning: "quyển sách", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/book.mp3" },
    { id: 4, word: "bag", meaning: "cái túi", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/bag.mp3" },
    { id: 5, word: "ruler", meaning: "thước kẻ", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/ruler.mp3" },
    { id: 6, word: "eraser", meaning: "cục tẩy", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/eraser.mp3" },
];

const VOCAB_SHAPES: VocabularyItem[] = [
    { id: 1, word: "circle", meaning: "hình tròn", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/circle.mp3" },
    { id: 2, word: "square", meaning: "hình vuông", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/square.mp3" },
    { id: 3, word: "triangle", meaning: "hình tam giác", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/triangle.mp3" },
    { id: 4, word: "rectangle", meaning: "hình chữ nhật", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/rectangle.mp3" },
    { id: 5, word: "star", meaning: "ngôi sao", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/star.mp3" },
];

const VOCAB_WEATHER: VocabularyItem[] = [
    { id: 1, word: "sunny", meaning: "trời nắng", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/sunny.mp3" },
    { id: 2, word: "rainy", meaning: "trời mưa", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/rainy.mp3" },
    { id: 3, word: "cloudy", meaning: "trời nhiều mây", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/cloudy.mp3" },
    { id: 4, word: "windy", meaning: "trời có gió", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/windy.mp3" },
    { id: 5, word: "hot", meaning: "nóng", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hot.mp3" },
    { id: 6, word: "cold", meaning: "lạnh", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/cold.mp3" },
];

// Chữ cái A-E: mỗi chữ một từ đại diện + nghĩa tiếng Việt + audio
const VOCAB_ALPHABET_AE: VocabularyItem[] = [
    {
        id: 1,
        word: "ant",
        meaning: "A - con kiến",
        image: "/vocab_alphabet_a_ant.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/ant.mp3"
    },
    {
        id: 2,
        word: "ball",
        meaning: "B - quả bóng",
        image: "/vocab_alphabet_b_ball.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/ball.mp3"
    },
    {
        id: 3,
        word: "cat",
        meaning: "C - con mèo",
        image: "/vocab_alphabet_c_cat.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/cat.mp3"
    },
    {
        id: 4,
        word: "dog",
        meaning: "D - con chó",
        image: "/vocab_alphabet_d_dog.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/dog.mp3"
    },
    {
        id: 5,
        word: "egg",
        meaning: "E - quả trứng",
        image: "/vocab_alphabet_e_egg.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/egg.mp3"
    }
];

export const GRADE_1_LESSONS: WeeklyLessonConfig = {
    1: {
        weekTitle: "Tuần 1: Làm quen với tiếng Anh",
        lessons: [
            {
                id: 'g1-w1-l1',
                category_title: 'Unit 1 - Lesson: Từ vựng',
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
            {
                id: 'g111-w3-l1',
                category_title: 'Unit 1 - Lesson: Từ vựng',
                title: 'Học bảng chữ cái',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails([...VOCAB_GREETINGS, ...VOCAB_COLORS])
            },
            {
                id: 'g1-w1-l3',
                category_title: 'Unit 1 - Lesson 3: Giao tiếp',
                title: 'Lời chào hỏi cơ bản',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_GREETINGS)
            },
            {
                id: 'g1-w1-l4',
                category_title: 'Unit 1 - Lesson 4: Màu sắc',
                title: 'Nhận biết màu sắc',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/3.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_COLORS)
            },
            {
                id: 'g1-w1-l5',
                category_title: 'Unit 1 - Lesson 5: Phát âm',
                title: 'Luyện phát âm chữ cái A-E',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video bài giảng phát âm A-E',
                        score: "0",
                        iconType: 'video',
                        videoUrl: "https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/tieng-anh/video_timestamps/2023/04/11/g2u10l1_video-vocab-new-convert.mp4"
                    },
                    {
                        id: 2,
                        type: 'game',
                        title: 'Gõ lại chữ cái',
                        score: "0",
                        iconType: 'game',
                        gameData: { gameType: 'typing', vocabularyItems: VOCAB_ALPHABET_AE }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Chọn từ đúng với chữ cái',
                        score: "0",
                        iconType: 'game',
                        gameData: { gameType: 'choice', vocabularyItems: VOCAB_ALPHABET_AE }
                    },
                    {
                        id: 4,
                        type: 'game',
                        title: 'Phát âm chữ cái A-E',
                        score: "0",
                        iconType: 'game',
                        gameData: { gameType: 'recording', vocabularyItems: VOCAB_ALPHABET_AE }
                    }
                ]
            }
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
    },
    4: {
        weekTitle: "Tuần 4: Gia đình yêu thương",
        lessons: [
            {
                id: 'g1-w4-l1',
                category_title: 'Unit 3 - Lesson 1',
                title: 'Các thành viên trong gia đình',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_FAMILY)
            },
            {
                id: 'g1-w4-l2',
                category_title: 'Unit 3 - Lesson 2',
                title: 'Màu sắc yêu thích',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/3.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_COLORS)
            }
        ]
    },
    5: {
        weekTitle: "Tuần 5: Cơ thể của tôi",
        lessons: [
            {
                id: 'g1-w5-l1',
                category_title: 'Unit 4 - Lesson 1',
                title: 'Các bộ phận cơ thể',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/3.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_BODY)
            },
            {
                id: 'g1-w5-l2',
                category_title: 'Unit 4 - Lesson 2',
                title: 'Lời chào hỏi hằng ngày',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/4.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_GREETINGS)
            }
        ]
    },
    6: {
        weekTitle: "Tuần 6: Thức ăn và đồ uống",
        lessons: [
            {
                id: 'g1-w6-l1',
                category_title: 'Unit 5 - Lesson 1',
                title: 'Thức ăn hằng ngày',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_FOOD)
            },
            {
                id: 'g1-w6-l2',
                category_title: 'Unit 5 - Lesson 2',
                title: 'Đếm số từ 6 đến 10',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: createLessonDetails(ALL_COUNTING_VOCAB.slice(5, 10))
            }
        ]
    },
    7: {
        weekTitle: "Tuần 7: Đồ dùng học tập",
        lessons: [
            {
                id: 'g1-w7-l1',
                category_title: 'Unit 6 - Lesson 1',
                title: 'Đồ dùng trong lớp học',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/3.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_SCHOOL)
            },
            {
                id: 'g1-w7-l2',
                category_title: 'Unit 6 - Lesson 2',
                title: 'Ôn tập gia đình & cơ thể',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/4.png',
                progress: 0,
                lessonDetails: createLessonDetails([...VOCAB_FAMILY, ...VOCAB_BODY])
            }
        ]
    },
    8: {
        weekTitle: "Tuần 8: Hình khối vui nhộn",
        lessons: [
            {
                id: 'g1-w8-l1',
                category_title: 'Unit 7 - Lesson 1',
                title: 'Các hình khối cơ bản',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_SHAPES)
            },
            {
                id: 'g1-w8-l2',
                category_title: 'Unit 7 - Lesson 2',
                title: 'Màu sắc và hình khối',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 0,
                lessonDetails: createLessonDetails([...VOCAB_COLORS, ...VOCAB_SHAPES])
            }
        ]
    },
    9: {
        weekTitle: "Tuần 9: Thời tiết và ôn tập cuối kỳ",
        lessons: [
            {
                id: 'g1-w9-l1',
                category_title: 'Unit 8 - Lesson 1',
                title: 'Thời tiết xung quanh ta',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/3.png',
                progress: 0,
                lessonDetails: createLessonDetails(VOCAB_WEATHER)
            },
            {
                id: 'g1-w9-l2',
                category_title: 'Review - Ôn tập cuối kỳ',
                title: 'Ôn tập tất cả bài học',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/4.png',
                progress: 0,
                lessonDetails: createLessonDetails([
                    ...VOCAB_GREETINGS,
                    ...VOCAB_ANIMALS,
                    ...VOCAB_COLORS,
                    ...VOCAB_FAMILY,
                ])
            }
        ]
    }
};

