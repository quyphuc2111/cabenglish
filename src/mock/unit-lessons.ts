// Mock data for unit lessons by grade and unit slug

import { LessonDetail, VocabularyItem } from "./data";

export type UnitLesson = {
  title: string;
  content: string;
  image: string;
  link: string;
  point: string | null;
  rate: number;
  lessonInfo: {
    part: Array<{
      type: string;
      score: string;
    }>;
  };
  categoryTitle?: string;
  lessonDetails?: LessonDetail[];
};

// ============================================
// VIDEO URLs - mỗi lesson có link video riêng
// ============================================
const VIDEO_URLS = {
  grade1: {
    "unit-1": {
      lesson1: "/AICourse/videocanva/G1_U1_L1_Greetings_Vocab.mp4",
      lesson2: "/AICourse/videocanva/G1_U1_L2_Greetings_Phrases.mp4",
      lesson3: "/AICourse/videocanva/G1_U1_L3_Greetings_Intro.mp4",
      lesson4: "/AICourse/videocanva/G1_U1_L4_Greetings_Pronunciation.mp4",
      lesson5: "/AICourse/FriendshipKindness.mp4",
    },
    "unit-2": {
      lesson1: "/AICourse/videocanva/G1_U2_L1_Family_Members.mp4",
      lesson2: "/AICourse/videocanva/G1_U2_L2_My_Family.mp4",
    },
    "unit-3": {
      lesson1: "/AICourse/videocanva/G1_U3_L1_Toys_Vocab.mp4",
      lesson2: "/AICourse/videocanva/G1_U3_L2_Favorite_Toy.mp4",
    },
    "unit-4": {
      lesson1: "/AICourse/videocanva/G1_U4_L1_School_Items.mp4",
      lesson2: "/AICourse/videocanva/G1_U4_L2_In_Classroom.mp4",
    },
    "unit-5": {
      lesson1: "/AICourse/videocanva/G1_U5_L1_Body_Parts.mp4",
      lesson2: "/AICourse/videocanva/G1_U5_L2_My_Body.mp4",
    },
    "unit-6": {
      lesson1: "/AICourse/videocanva/G1_U6_L1_Pet_Names.mp4",
      lesson2: "/AICourse/videocanva/G1_U6_L2_My_Pet.mp4",
    },
  },
  grade2: {
    "unit-1": {
      lesson1: "/AICourse/videocanva/G2_U1_L1_Welcome_Back.mp4",
      lesson2: "/AICourse/videocanva/G2_U1_L2_Classroom_Language.mp4",
    },
    "unit-2": {
      lesson1: "/AICourse/videocanva/G2_U2_L1_My_Friends.mp4",
      lesson2: "/AICourse/videocanva/G2_U2_L2_Friend_Activities.mp4",
    },
  },
  grade3: {
    "unit-1": {
      lesson1: "/AICourse/videocanva/G3_U1_L1_Back_To_School.mp4",
      lesson2: "/AICourse/videocanva/G3_U1_L2_School_Subjects.mp4",
    },
    "unit-2": {
      lesson1: "/AICourse/videocanva/G3_U2_L1_Neighborhood.mp4",
      lesson2: "/AICourse/videocanva/G3_U2_L2_Directions.mp4",
    },
  },
  grade4: {
    "unit-1": {
      lesson1: "/AICourse/videocanva/G4_U1_L1_New_School_Year.mp4",
      lesson2: "/AICourse/videocanva/G4_U1_L2_Goals_Plans.mp4",
    },
    "unit-2": {
      lesson1: "/AICourse/videocanva/G4_U2_L1_Community_Helpers.mp4",
      lesson2: "/AICourse/videocanva/G4_U2_L2_Community_Places.mp4",
    },
  },
  grade5: {
    "unit-1": {
      lesson1: "/AICourse/videocanva/G5_U1_L1_My_Hometown.mp4",
      lesson2: "/AICourse/videocanva/G5_U1_L2_Places_In_Town.mp4",
      lesson3: "/AICourse/videocanva/G5_U1_L3_Comparing_Places.mp4",
    },
    "unit-2": {
      lesson1: "/AICourse/videocanva/G5_U2_L1_Daily_Routines.mp4",
      lesson2: "/AICourse/videocanva/G5_U2_L2_Time_Expressions.mp4",
    },
  },
};

// Helper to create lesson details for unit lessons
const createUnitLessonDetails = (
  vocabItems: VocabularyItem[],
  scores?: { video: string; typing: string; choice: string; recording: string },
  videoUrl?: string
): LessonDetail[] => {
  const s = scores || { video: "0", typing: "0", choice: "0", recording: "0" };
  const url = videoUrl || "/AICourse/Dream Big!!.mp4";
  return [
    { id: 1, type: 'video', title: 'Video bài giảng', score: s.video, iconType: 'video', videoUrl: url },
    { id: 2, type: 'game', title: 'Gõ lại từ vựng', score: s.typing, iconType: 'game', gameData: { gameType: 'typing', vocabularyItems: vocabItems } },
    { id: 3, type: 'game', title: 'Chọn từ vựng đúng', score: s.choice, iconType: 'game', gameData: { gameType: 'choice', vocabularyItems: vocabItems } },
    { id: 4, type: 'game', title: 'Ghi âm phát âm', score: s.recording, iconType: 'game', gameData: { gameType: 'recording', vocabularyItems: vocabItems } }
  ];
};

// ============================================
// VOCABULARY DATA FOR UNIT LESSONS
// ============================================

const VOCAB_PLAYGROUND: VocabularyItem[] = [
  { id: 1, word: "playground", meaning: "sân chơi", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 2, word: "swing", meaning: "xích đu", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 3, word: "slide", meaning: "cầu trượt", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 4, word: "friend", meaning: "bạn bè", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 5, word: "play", meaning: "chơi", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" }
];

const VOCAB_GREETINGS_UNIT: VocabularyItem[] = [
  { id: 1, word: "hello", meaning: "xin chào", image: "/vocab_hello.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 2, word: "goodbye", meaning: "tạm biệt", image: "/vocab_goodbye.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/goodbye.mp3" },
  { id: 3, word: "thank you", meaning: "cảm ơn", image: "/vocab_thanks.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/thanks.mp3" },
  { id: 4, word: "please", meaning: "làm ơn", image: "/vocab_please.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/please.mp3" },
  { id: 5, word: "sorry", meaning: "xin lỗi", image: "/vocab_sorry.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/sorry.mp3" }
];

const VOCAB_GREETINGS_PHRASES: VocabularyItem[] = [
  { id: 1, word: "Good morning", meaning: "Chào buổi sáng", image: "/vocab_hello.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 2, word: "Good afternoon", meaning: "Chào buổi chiều", image: "/vocab_greetings_lesson.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 3, word: "Good evening", meaning: "Chào buổi tối", image: "/vocab_greetings_lesson.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 4, word: "Good night", meaning: "Chúc ngủ ngon", image: "/vocab_greetings_lesson.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/goodbye.mp3" },
  { id: 5, word: "See you later", meaning: "Hẹn gặp lại", image: "/vocab_goodbye.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/goodbye.mp3" }
];

const VOCAB_GREETINGS_INTRO: VocabularyItem[] = [
  { id: 1, word: "What is your name?", meaning: "Tên bạn là gì?", image: "/vocab_greetings_lesson.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 2, word: "My name is...", meaning: "Tên tôi là...", image: "/vocab_hello.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 3, word: "Nice to meet you", meaning: "Rất vui được gặp bạn", image: "/vocab_greetings_lesson.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/thanks.mp3" },
  { id: 4, word: "How are you?", meaning: "Bạn có khỏe không?", image: "/vocab_greetings_lesson.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 5, word: "I am fine", meaning: "Tôi khỏe", image: "/vocab_hello.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/thanks.mp3" }
];

const VOCAB_FAMILY_UNIT: VocabularyItem[] = [
  { id: 1, word: "mother", meaning: "mẹ", image: "/grade2_family.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/mother.mp3" },
  { id: 2, word: "father", meaning: "bố", image: "/grade2_family.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/father.mp3" },
  { id: 3, word: "sister", meaning: "chị/em gái", image: "/grade2_family.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/sister.mp3" },
  { id: 4, word: "brother", meaning: "anh/em trai", image: "/grade2_family.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/brother.mp3" },
  { id: 5, word: "baby", meaning: "em bé", image: "/grade2_family.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/grandmother.mp3" }
];

const VOCAB_TOYS: VocabularyItem[] = [
  { id: 1, word: "doll", meaning: "búp bê", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 2, word: "ball", meaning: "quả bóng", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 3, word: "car", meaning: "xe ô tô", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 4, word: "teddy bear", meaning: "gấu bông", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 5, word: "robot", meaning: "người máy", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" }
];

// Grade 1 Unit Lessons
const grade1UnitLessons: Record<string, UnitLesson[]> = {
  "unit-1": [
    {
      title: "Lesson 1: Greetings - Từ vựng chào hỏi",
      content: "Học các từ vựng chào hỏi cơ bản: hello, goodbye, thank you, please, sorry",
      image: "/vocab_greetings_lesson.png",
      link: "/unit1",
      point: "100/400",
      rate: 25,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "0" }, { type: "normal", score: "0" }, { type: "normal", score: "0" }] },
      categoryTitle: "Unit 1 - Lesson 1: Từ vựng",
      lessonDetails: createUnitLessonDetails(VOCAB_GREETINGS_UNIT, { video: "100", typing: "0", choice: "0", recording: "0" }, VIDEO_URLS.grade1["unit-1"].lesson1)
    },
    {
      title: "Lesson 2: Greetings - Mẫu câu chào hỏi theo thời gian",
      content: "Học cách chào hỏi theo buổi sáng, chiều và tối: Good morning, Good afternoon, Good evening",
      image: "/vocab_greetings_lesson.png",
      link: "/unit1",
      point: "0/400",
      rate: 0,
      lessonInfo: { part: [{ type: "video", score: "0" }, { type: "normal", score: "0" }, { type: "normal", score: "0" }, { type: "normal", score: "0" }] },
      categoryTitle: "Unit 1 - Lesson 2: Mẫu câu",
      lessonDetails: createUnitLessonDetails(VOCAB_GREETINGS_PHRASES, undefined, VIDEO_URLS.grade1["unit-1"].lesson2)
    },
    {
      title: "Lesson 3: Greetings - Giới thiệu bản thân",
      content: "Tập hỏi và trả lời: What is your name? - How are you? - Nice to meet you!",
      image: "/vocab_hello.png",
      link: "/unit1",
      point: "0/400",
      rate: 0,
      lessonInfo: { part: [{ type: "video", score: "0" }, { type: "normal", score: "0" }, { type: "normal", score: "0" }, { type: "normal", score: "0" }] },
      categoryTitle: "Unit 1 - Lesson 3: Giao tiếp",
      lessonDetails: createUnitLessonDetails(VOCAB_GREETINGS_INTRO, undefined, VIDEO_URLS.grade1["unit-1"].lesson3)
    },
    {
      title: "Lesson 4: Greetings - Luyện phát âm",
      content: "Luyện phát âm chuẩn các từ chào hỏi qua trò chơi ghi âm và nhận diện giọng nói",
      image: "/vocab_greetings_lesson.png",
      link: "/unit1",
      point: "0/400",
      rate: 0,
      lessonInfo: { part: [{ type: "video", score: "0" }, { type: "normal", score: "0" }, { type: "normal", score: "0" }, { type: "normal", score: "0" }] },
      categoryTitle: "Unit 1 - Lesson 4: Phát âm",
      lessonDetails: [
        { id: 1, type: 'video', title: 'Video phát âm chào hỏi', score: "0", iconType: 'video', videoUrl: VIDEO_URLS.grade1["unit-1"].lesson4 },
        { id: 2, type: 'game', title: 'Gõ lại từ vựng', score: "0", iconType: 'game', gameData: { gameType: 'typing', vocabularyItems: VOCAB_GREETINGS_UNIT } },
        { id: 3, type: 'game', title: 'Phát âm - Ghi âm giọng nói', score: "0", iconType: 'game', gameData: { gameType: 'recording', vocabularyItems: VOCAB_GREETINGS_UNIT } },
        { id: 4, type: 'game', title: 'Phát âm câu chào - Ghi âm giọng nói', score: "0", iconType: 'game', gameData: { gameType: 'recording', vocabularyItems: VOCAB_GREETINGS_PHRASES } }
      ]
    },
    {
      title: "Lesson 5: Greetings - Ôn tập tổng hợp",
      content: "Ôn tập toàn bộ Unit 1: từ vựng, mẫu câu, phát âm và hội thoại chào hỏi",
      image: "/vocab_goodbye.png",
      link: "/unit1",
      point: "0/500",
      rate: 0,
      lessonInfo: { part: [{ type: "video", score: "0" }, { type: "normal", score: "0" }, { type: "normal", score: "0" }, { type: "normal", score: "0" }] },
      categoryTitle: "Unit 1 - Lesson 5: Ôn tập",
      lessonDetails: createUnitLessonDetails([...VOCAB_GREETINGS_UNIT, ...VOCAB_GREETINGS_PHRASES], undefined, VIDEO_URLS.grade1["unit-1"].lesson5)
    }
  ],
  "unit-2": [
    {
      title: "Lesson 1: Family members",
      content: "Learn family vocabulary",
      image: "/lesson/1.png",
      link: "/unit2",
      point: "150/400",
      rate: 38,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] },
      categoryTitle: "Unit 2 - Lesson: Từ vựng",
      lessonDetails: createUnitLessonDetails(VOCAB_FAMILY_UNIT, { video: "100", typing: "50", choice: "0", recording: "0" }, VIDEO_URLS.grade1["unit-2"].lesson1)
    },
    {
      title: "Lesson 2: My family",
      content: "Talk about your family",
      image: "/lesson/3.png",
      link: "/unit2",
      point: "100/500",
      rate: 20,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] },
      categoryTitle: "Unit 2 - Lesson: Mẫu câu",
      lessonDetails: createUnitLessonDetails(VOCAB_FAMILY_UNIT, { video: "100", typing: "0", choice: "0", recording: "0" }, VIDEO_URLS.grade1["unit-2"].lesson2)
    }
  ],
  "unit-3": [
    {
      title: "Lesson 1: Toy vocabulary",
      content: "Learn toy names",
      image: "/lesson/1.png",
      link: "/unit3",
      point: "0/400",
      rate: 0,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] },
      categoryTitle: "Unit 3 - Lesson: Từ vựng",
      lessonDetails: createUnitLessonDetails(VOCAB_TOYS, undefined, VIDEO_URLS.grade1["unit-3"].lesson1)
    },
    {
      title: "Lesson 2: My favorite toy",
      content: "Describe your toys",
      image: "/lesson/3.png",
      link: "/unit3",
      point: "0/500",
      rate: 0,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] },
      categoryTitle: "Unit 3 - Lesson: Mẫu câu",
      lessonDetails: createUnitLessonDetails(VOCAB_TOYS, undefined, VIDEO_URLS.grade1["unit-3"].lesson2)
    }
  ],
  "unit-4": [
    {
      title: "Lesson 1: School items",
      content: "Learn school vocabulary",
      image: "/lesson/1.png",
      link: "/unit4",
      point: "112/400",
      rate: 28,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] },
      categoryTitle: "Unit 4 - Lesson: Từ vựng",
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND, { video: "100", typing: "12", choice: "0", recording: "0" }, VIDEO_URLS.grade1["unit-4"].lesson1)
    },
    {
      title: "Lesson 2: In the classroom",
      content: "Classroom activities",
      image: "/lesson/3.png",
      link: "/unit4",
      point: "0/500",
      rate: 0,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] },
      categoryTitle: "Unit 4 - Lesson: Mẫu câu",
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND, undefined, VIDEO_URLS.grade1["unit-4"].lesson2)
    }
  ],
  "unit-5": [
    {
      title: "Lesson 1: Body parts",
      content: "Learn body vocabulary",
      image: "/lesson/1.png",
      link: "/unit5",
      point: "248/400",
      rate: 62,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] },
      categoryTitle: "Unit 5 - Lesson: Từ vựng",
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND, { video: "100", typing: "100", choice: "48", recording: "0" }, VIDEO_URLS.grade1["unit-5"].lesson1)
    },
    {
      title: "Lesson 2: My body",
      content: "Describe your body",
      image: "/lesson/3.png",
      link: "/unit5",
      point: "200/500",
      rate: 40,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] },
      categoryTitle: "Unit 5 - Lesson: Mẫu câu",
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND, { video: "100", typing: "100", choice: "0", recording: "0" }, VIDEO_URLS.grade1["unit-5"].lesson2)
    }
  ],
  "unit-6": [
    {
      title: "Lesson 1: Pet names",
      content: "Learn pet vocabulary",
      image: "/lesson/1.png",
      link: "/unit6",
      point: "60/400",
      rate: 15,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] },
      categoryTitle: "Unit 6 - Lesson: Từ vựng",
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND, { video: "60", typing: "0", choice: "0", recording: "0" }, VIDEO_URLS.grade1["unit-6"].lesson1)
    },
    {
      title: "Lesson 2: My pet",
      content: "Talk about your pet",
      image: "/lesson/3.png",
      link: "/unit6",
      point: "0/500",
      rate: 0,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] },
      categoryTitle: "Unit 6 - Lesson: Mẫu câu",
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND, undefined, VIDEO_URLS.grade1["unit-6"].lesson2)
    }
  ]
};

// Grade 2 Unit Lessons
const grade2UnitLessons: Record<string, UnitLesson[]> = {
  "unit-1": [
    {
      title: "Lesson 1: Welcome back",
      content: "Greetings and introductions",
      image: "/lesson/1.png",
      link: "/unit1",
      point: "160/400",
      rate: 40,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    },
    {
      title: "Lesson 2: Classroom language",
      content: "Learn classroom phrases",
      image: "/lesson/3.png",
      link: "/unit1",
      point: "200/500",
      rate: 40,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    }
  ],
  "unit-2": [
    {
      title: "Lesson 1: My friends",
      content: "Talk about friends",
      image: "/lesson/1.png",
      link: "/unit2",
      point: "220/400",
      rate: 55,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    },
    {
      title: "Lesson 2: Friend activities",
      content: "What we do with friends",
      image: "/lesson/3.png",
      link: "/unit2",
      point: "250/500",
      rate: 50,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    }
  ]
};

// Grade 3 Unit Lessons
const grade3UnitLessons: Record<string, UnitLesson[]> = {
  "unit-1": [
    {
      title: "Lesson 1: Back to school",
      content: "Welcome back vocabulary",
      image: "/lesson/1.png",
      link: "/unit1",
      point: "200/400",
      rate: 50,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    },
    {
      title: "Lesson 2: School subjects",
      content: "Learn subject names",
      image: "/lesson/3.png",
      link: "/unit1",
      point: "250/500",
      rate: 50,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    }
  ],
  "unit-2": [
    {
      title: "Lesson 1: My neighborhood",
      content: "Places in the neighborhood",
      image: "/lesson/1.png",
      link: "/unit2",
      point: "168/400",
      rate: 42,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    },
    {
      title: "Lesson 2: Directions",
      content: "Giving directions",
      image: "/lesson/3.png",
      link: "/unit2",
      point: "200/500",
      rate: 40,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    }
  ]
};

// Grade 4 Unit Lessons
const grade4UnitLessons: Record<string, UnitLesson[]> = {
  "unit-1": [
    {
      title: "Lesson 1: New school year",
      content: "Starting a new year",
      image: "/lesson/1.png",
      link: "/unit1",
      point: "260/400",
      rate: 65,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    },
    {
      title: "Lesson 2: Goals and plans",
      content: "Talk about your goals",
      image: "/lesson/3.png",
      link: "/unit1",
      point: "300/500",
      rate: 60,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    }
  ],
  "unit-2": [
    {
      title: "Lesson 1: Community helpers",
      content: "People in the community",
      image: "/lesson/1.png",
      link: "/unit2",
      point: "232/400",
      rate: 58,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    },
    {
      title: "Lesson 2: Community places",
      content: "Places in the community",
      image: "/lesson/3.png",
      link: "/unit2",
      point: "280/500",
      rate: 56,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    }
  ]
};

// Grade 5 Unit Lessons
const grade5UnitLessons: Record<string, UnitLesson[]> = {
  "unit-1": [
    {
      title: "Lesson 1: My hometown",
      content: "Describe your hometown",
      image: "/lesson/1.png",
      link: "/unit1",
      point: "320/400",
      rate: 80,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    },
    {
      title: "Lesson 2: Places in town",
      content: "Town vocabulary",
      image: "/lesson/3.png",
      link: "/unit1",
      point: "400/500",
      rate: 80,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    },
    {
      title: "Lesson 3: Comparing places",
      content: "Compare different places",
      image: "/lesson/2.png",
      link: "/unit1",
      point: "300/400",
      rate: 75,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    }
  ],
  "unit-2": [
    {
      title: "Lesson 1: Daily routines",
      content: "Talk about daily activities",
      image: "/lesson/1.png",
      link: "/unit2",
      point: "300/400",
      rate: 75,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    },
    {
      title: "Lesson 2: Time expressions",
      content: "Learn time vocabulary",
      image: "/lesson/3.png",
      link: "/unit2",
      point: "350/500",
      rate: 70,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] }
    }
  ]
};

// Main export: Get unit lessons by grade and slug
export const getUnitLessonsByGradeAndSlug = (grade: number, slug: string): UnitLesson[] => {
  const gradeData: Record<string, UnitLesson[]> = {
    1: grade1UnitLessons,
    2: grade2UnitLessons,
    3: grade3UnitLessons,
    4: grade4UnitLessons,
    5: grade5UnitLessons
  }[grade] || grade1UnitLessons;

  return gradeData[slug] || [];
};

// Get unit title by grade and slug
export const getUnitTitleByGradeAndSlug = (grade: number, slug: string): string => {
  const unitTitles: Record<number, Record<string, string>> = {
    1: {
      "unit-1": "Unit 1: FriendShip & Kindness",
      "unit-2": "Unit 2: My family",
      "unit-3": "Unit 3: My toys",
      "unit-4": "Unit 4: My school",
      "unit-5": "Unit 5: My body",
      "unit-6": "Unit 6: My pets"
    },
    2: {
      "unit-1": "Unit 1: Hello again",
      "unit-2": "Unit 2: My friends",
      "unit-3": "Unit 3: My house",
      "unit-4": "Unit 4: My clothes",
      "unit-5": "Unit 5: My day",
      "unit-6": "Unit 6: My hobbies"
    },
    3: {
      "unit-1": "Unit 1: Welcome back",
      "unit-2": "Unit 2: My neighborhood",
      "unit-3": "Unit 3: My activities",
      "unit-4": "Unit 4: My sports",
      "unit-5": "Unit 5: My world"
    },
    4: {
      "unit-1": "Unit 1: New beginnings",
      "unit-2": "Unit 2: My community",
      "unit-3": "Unit 3: My interests",
      "unit-4": "Unit 4: My future",
      "unit-5": "Unit 5: My planet"
    },
    5: {
      "unit-1": "Unit 1: My hometown",
      "unit-2": "Unit 2: Daily routines",
      "unit-3": "Unit 3: My favorite subject",
      "unit-4": "Unit 4: My weekend",
      "unit-5": "Unit 5: My holiday",
      "unit-6": "Unit 6: My dream job",
      "unit-7": "Unit 7: My country"
    }
  };

  return unitTitles[grade]?.[slug] || `Unit: ${slug}`;
};
