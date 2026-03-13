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

// Helper to create lesson details for unit lessons
const createUnitLessonDetails = (vocabItems: VocabularyItem[], scores?: { video: string; typing: string; choice: string; recording: string }): LessonDetail[] => {
  const s = scores || { video: "0", typing: "0", choice: "0", recording: "0" };
  return [
    { id: 1, type: 'video', title: 'Video bài giảng', score: s.video, iconType: 'video', videoUrl: "/AICourse/🎵 Friendship & Kindness 🎵 (2).mp4" },
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
  { id: 1, word: "hello", meaning: "xin chào", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/hello.mp3" },
  { id: 2, word: "goodbye", meaning: "tạm biệt", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/goodbye.mp3" },
  { id: 3, word: "thank you", meaning: "cảm ơn", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/thanks.mp3" },
  { id: 4, word: "please", meaning: "làm ơn", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/please.mp3" },
  { id: 5, word: "sorry", meaning: "xin lỗi", image: "/grade1_school.png", audio: "https://static.edupia.vn/audio/word/2018/05/07/sorry.mp3" }
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
      title: "Lesson 1: Greetings",
      content: "Learn how to say hello and goodbye",
      image: "/lesson/1.png",
      link: "/unit1",
      point: "100/400",
      rate: 25,
      lessonInfo: { part: [{ type: "video", score: "100" }, { type: "normal", score: "100" }] },
      categoryTitle: "Unit 1 - Lesson: Từ vựng",
      lessonDetails: createUnitLessonDetails(VOCAB_GREETINGS_UNIT, { video: "100", typing: "0", choice: "0", recording: "0" })
    },

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
      lessonDetails: createUnitLessonDetails(VOCAB_FAMILY_UNIT, { video: "100", typing: "50", choice: "0", recording: "0" })
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
      lessonDetails: createUnitLessonDetails(VOCAB_FAMILY_UNIT, { video: "100", typing: "0", choice: "0", recording: "0" })
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
      lessonDetails: createUnitLessonDetails(VOCAB_TOYS)
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
      lessonDetails: createUnitLessonDetails(VOCAB_TOYS)
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
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND, { video: "100", typing: "12", choice: "0", recording: "0" })
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
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND)
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
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND, { video: "100", typing: "100", choice: "48", recording: "0" })
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
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND, { video: "100", typing: "100", choice: "0", recording: "0" })
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
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND, { video: "60", typing: "0", choice: "0", recording: "0" })
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
      lessonDetails: createUnitLessonDetails(VOCAB_PLAYGROUND)
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
