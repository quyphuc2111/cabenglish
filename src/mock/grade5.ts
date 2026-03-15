import { VocabularyItem, WeeklyLessonConfig, LessonDetail } from './types';

// ============================================
// VOCABULARY DATA - GRADE 5
// ============================================

const VOCAB_PLACES: VocabularyItem[] = [
    {
        id: 1,
        word: "hometown",
        meaning: "quê hương",
        image: "https://static.edupia.vn/images/word/2018/05/07/hometown.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/hometown.mp3"
    },
    {
        id: 2,
        word: "pretty",
        meaning: "đẹp",
        image: "https://static.edupia.vn/images/word/2018/05/30/pretty.jpg",
        audio: "https://static.edupia.vn/resource/voice/2018/05/28/pretty.mp3"
    },
    {
        id: 3,
        word: "quiet",
        meaning: "yên tĩnh",
        image: "https://static.edupia.vn/images/word/2018/05/07/quiet.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/quiet.mp3"
    },
    {
        id: 4,
        word: "crowded",
        meaning: "đông đúc",
        image: "https://static.edupia.vn/resource/images/2018/05/07/crowded.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/crowded.mp3"
    },
    {
        id: 5,
        word: "modern",
        meaning: "hiện đại",
        image: "https://static.edupia.vn//resource//images//2018//05//13//mordern.png",
        audio: "https://static.edupia.vn/resource/voice/2018/05/28/modern.mp3"
    }
];

const VOCAB_ADDRESS: VocabularyItem[] = [
    {
        id: 1,
        word: "address",
        meaning: "địa chỉ",
        image: "https://static.edupia.vn/images/word/2018/05/07/address.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/address.mp3"
    },
    {
        id: 2,
        word: "street",
        meaning: "đường phố",
        image: "https://static.edupia.vn/images/word/2018/05/07/street.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/street.mp3"
    },
    {
        id: 3,
        word: "village",
        meaning: "làng",
        image: "https://static.edupia.vn/images/word/2018/05/07/village.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/village.mp3"
    },
    {
        id: 4,
        word: "city",
        meaning: "thành phố",
        image: "https://static.edupia.vn/images/word/2018/05/07/city.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/city.mp3"
    },
    {
        id: 5,
        word: "country",
        meaning: "nông thôn",
        image: "https://static.edupia.vn/images/word/2018/05/07/country.png",
        audio: "https://static.edupia.vn/audio/word/2018/05/07/country.mp3"
    }
];

const VOCAB_ACTIVITIES: VocabularyItem[] = [
    {
        id: 1,
        word: "always",
        meaning: "luôn luôn",
        image: "https://static.edupia.vn/images/word/2018/06/01/always.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/always.mp3"
    },
    {
        id: 2,
        word: "usually",
        meaning: "thường xuyên",
        image: "https://static.edupia.vn/images/word/2018/06/01/usually.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/usually.mp3"
    },
    {
        id: 3,
        word: "often",
        meaning: "thường",
        image: "https://static.edupia.vn/images/word/2018/06/01/often.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/often.mp3"
    },
    {
        id: 4,
        word: "sometimes",
        meaning: "đôi khi",
        image: "https://static.edupia.vn/images/word/2018/06/01/sometimes.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/sometimes.mp3"
    },
    {
        id: 5,
        word: "never",
        meaning: "không bao giờ",
        image: "https://static.edupia.vn/images/word/2018/06/01/never.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/never.mp3"
    }
];

const VOCAB_FREQUENCY: VocabularyItem[] = [
    {
        id: 1,
        word: "wake up",
        meaning: "thức dậy",
        image: "https://static.edupia.vn/images/word/2018/06/01/wakeup.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/wakeup.mp3"
    },
    {
        id: 2,
        word: "go to bed",
        meaning: "đi ngủ",
        image: "https://static.edupia.vn/images/word/2018/06/01/gotobed.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/gotobed.mp3"
    },
    {
        id: 3,
        word: "have breakfast",
        meaning: "ăn sáng",
        image: "https://static.edupia.vn/images/word/2018/06/01/breakfast.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/breakfast.mp3"
    },
    {
        id: 4,
        word: "do homework",
        meaning: "làm bài tập",
        image: "https://static.edupia.vn/images/word/2018/06/01/homework.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/homework.mp3"
    },
    {
        id: 5,
        word: "watch TV",
        meaning: "xem TV",
        image: "https://static.edupia.vn/images/word/2018/06/01/watchtv.png",
        audio: "https://static.edupia.vn/audio/word/2018/06/01/watchtv.mp3"
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

const VOCAB_DREAM_JOBS: VocabularyItem[] = [
    { id: 1, word: "teacher", meaning: "giáo viên", image: "/vocab_teacher.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/teacher.mp3" },
    { id: 2, word: "doctor", meaning: "bác sĩ", image: "/vocab_doctor.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/doctor.mp3" },
    { id: 3, word: "firefighter", meaning: "lính cứu hỏa", image: "/vocab_firefighter.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/firefighter.mp3" },
    { id: 4, word: "farmer", meaning: "nông dân", image: "/vocab_farmer.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/farmer.mp3" },
    { id: 5, word: "pilot", meaning: "phi công", image: "/vocab_pilot.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/pilot.mp3" },
    { id: 6, word: "chef", meaning: "đầu bếp", image: "/vocab_chef.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/chef.mp3" },
    { id: 7, word: "engineer", meaning: "kỹ sư", image: "/vocab_engineer.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/engineer.mp3" }
];

export const GRADE_5_LESSONS: WeeklyLessonConfig = {
    1: {
        weekTitle: "Tuần 1: Unit 1 - Công việc mơ ước",
        lessons: [
            {
                id: 'g5-w1-l1',
                category_title: 'Unit 1 - Lesson: Từ vựng',
                title: 'Công việc mơ ước',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 80,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video bài giảng',
                        score: "100",
                        iconType: 'video',
                        videoUrl: "/AICourse/videocanva/5. công việc và công việc mơ ước.mp4"
                    },
                    {
                        id: 2,
                        type: 'game',
                        title: 'Gõ lại từ vựng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'typing', vocabularyItems: VOCAB_DREAM_JOBS }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Chọn từ vựng đúng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'choice', vocabularyItems: VOCAB_DREAM_JOBS }
                    },
                    {
                        id: 4,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "50",
                        iconType: 'game',
                        gameData: { gameType: 'recording', vocabularyItems: VOCAB_DREAM_JOBS }
                    }
                ]
            },

             {
                id: 'g5-w1-l2',
                category_title: 'Unit 1 - Lesson: Từ vựng',
                title: 'Gọi tên sở thích bằng tiếng Anh',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 0,
                lessonDetails: [
                    {
                        id: 1,
                        type: 'video',
                        title: 'Video bài giảng',
                        score: "100",
                        iconType: 'video',
                        videoUrl: "/AICourse/videocanva/L5. Gọi tên sở thích bằng tiếng Anh.mp4"
                    },
                      {
                        id: 2,
                        type: 'game',
                        title: 'Gõ lại từ vựng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'typing', vocabularyItems: VOCAB_DREAM_JOBS }
                    },
                    {
                        id: 3,
                        type: 'game',
                        title: 'Chọn từ vựng đúng',
                        score: "100",
                        iconType: 'game',
                        gameData: { gameType: 'choice', vocabularyItems: VOCAB_DREAM_JOBS }
                    },
                    {
                        id: 4,
                        type: 'game',
                        title: 'Ghi âm phát âm',
                        score: "50",
                        iconType: 'game',
                        gameData: { gameType: 'recording', vocabularyItems: VOCAB_DREAM_JOBS }
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
                lessonDetails: createLessonDetails(VOCAB_ACTIVITIES)
            },
            {
                id: '1402',
                category_title: 'Unit 2 - Lesson: Từ vựng',
                title: 'Các trạng từ chỉ tần suất',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/1.png',
                progress: 50,
                lessonDetails: createLessonDetails(VOCAB_FREQUENCY)
            },
            {
                id: '1403',
                category_title: 'Unit 2 - Lesson: Mẫu câu',
                title: 'Hỏi về tần suất làm việc',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/2.png',
                progress: 30,
                lessonDetails: createLessonDetails(VOCAB_FREQUENCY)
            }
        ]
    },
    3: {
        weekTitle: "Tuần 15: Ôn tập Unit 1 & 2",
        lessons: [
            {
                id: '1501',
                category_title: 'Review',
                title: 'Ôn tập từ vựng tổng hợp',
                image: 'https://static.edupia.vn/uploads/v3/assets/images/classroom/thumb-default/4.png',
                progress: 0,
                lessonDetails: createLessonDetails([...VOCAB_PLACES, ...VOCAB_ACTIVITIES])
            }
        ]
    }
};
