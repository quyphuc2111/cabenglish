# Mock Data Structure Documentation

## Overview
Cấu trúc dữ liệu mock được tổ chức theo **lớp học (grade)** → **tuần học (week)** → **bài học (lessons)** → **chi tiết bài học (lesson details)** bao gồm video và game.

## Data Structure

### 1. LESSONS_BY_GRADE (Main Export)

Cấu trúc chính để quản lý bài học theo lớp và tuần:

```typescript
LESSONS_BY_GRADE = {
  [grade]: {
    [weekNumber]: {
      weekTitle: string,
      lessons: WeeklyLesson[]
    }
  }
}
```

**Ví dụ:**
```typescript
LESSONS_BY_GRADE[5][13] = {
  weekTitle: "Tuần 13: Unit 1 - Địa chỉ và nơi ở",
  lessons: [...]
}
```

### 2. WEEKLY_LESSONS (Backward Compatibility)

Export mặc định cho lớp 5 để tương thích ngược:

```typescript
WEEKLY_LESSONS = GRADE_5_LESSONS
```

### 2. WeeklyLesson

Mỗi bài học trong tuần:

```typescript
type WeeklyLesson = {
  id: string;                    // ID duy nhất của bài học
  category_title: string;        // Tiêu đề danh mục (VD: "Unit 1 - Lesson: Từ vựng")
  title: string;                 // Tiêu đề bài học
  image: string;                 // URL hình ảnh đại diện
  progress?: number;             // Tiến độ hoàn thành (0-100)
  lessonDetails: LessonDetail[]; // Chi tiết các hoạt động trong bài học
}
```

### 3. LessonDetail

Chi tiết hoạt động trong bài học (video hoặc game):

```typescript
type LessonDetail = {
  id: number;
  type: 'video' | 'game';
  title: string;
  score: string;
  iconType: string;
  videoUrl?: string;    // Chỉ có khi type = 'video'
  gameData?: GameData;  // Chỉ có khi type = 'game'
}
```

### 4. GameData

Dữ liệu cho các game học từ vựng:

```typescript
type GameData = {
  gameType: 'typing' | 'choice' | 'recording';
  vocabularyItems: VocabularyItem[];
}
```

**3 loại game:**
- **`typing`**: Gõ lại từ vựng được nghe
- **`choice`**: Lựa chọn từ vựng đúng (trắc nghiệm 4 đáp án)
- **`recording`**: Ghi âm phát âm từ vựng

### 5. VocabularyItem

Dữ liệu từ vựng:

```typescript
type VocabularyItem = {
  id: number;
  word: string;
  meaning?: string;
  image: string;
  audio: string;
  scramble?: boolean;
}
```

## Helper Functions

### NEW: Grade-based Functions

#### getLessonsByGradeAndWeek(grade: number, week: number)
Lấy danh sách bài học của một lớp và tuần cụ thể.

```typescript
const lessons = getLessonsByGradeAndWeek(5, 13);
// Returns: WeeklyLesson[]
```

#### getLessonDetailsByGrade(grade: number, week: number, lessonId: string)
Lấy chi tiết các hoạt động của một bài học theo lớp.

```typescript
const details = getLessonDetailsByGrade(5, 13, '23123');
// Returns: LessonDetail[]
```

#### getAvailableWeeksByGrade(grade: number)
Lấy danh sách tất cả các tuần có sẵn cho một lớp.

```typescript
const weeks = getAvailableWeeksByGrade(5);
// Returns: number[] (VD: [13, 14, 15])
```

#### getWeekTitleByGrade(grade: number, week: number)
Lấy tiêu đề của tuần theo lớp.

```typescript
const title = getWeekTitleByGrade(5, 13);
// Returns: "Tuần 13: Unit 1 - Địa chỉ và nơi ở"
```

#### findLessonByIdInGrade(grade: number, lessonId: string)
Tìm bài học theo ID trong một lớp cụ thể.

```typescript
const result = findLessonByIdInGrade(5, '23123');
// Returns: { week: 13, lesson: WeeklyLesson } | null
```

#### findLessonByIdGlobal(lessonId: string)
Tìm bài học theo ID trong TẤT CẢ các lớp và tuần.

```typescript
const result = findLessonByIdGlobal('23123');
// Returns: { grade: 5, week: 13, lesson: WeeklyLesson } | null
```

### Backward Compatible Functions (Default Grade 5)

#### getLessonsByWeek(week: number, grade?: number)
Lấy danh sách bài học của một tuần (mặc định lớp 5).

```typescript
const lessons = getLessonsByWeek(13);        // Grade 5
const lessons = getLessonsByWeek(13, 3);     // Grade 3
// Returns: WeeklyLesson[]
```

#### getLessonDetails(week: number, lessonId: string, grade?: number)
Lấy chi tiết các hoạt động của một bài học (mặc định lớp 5).

```typescript
const details = getLessonDetails(13, '23123');       // Grade 5
const details = getLessonDetails(13, '23123', 3);    // Grade 3
// Returns: LessonDetail[]
```

#### getAvailableWeeks(grade?: number)
Lấy danh sách tất cả các tuần có sẵn (mặc định lớp 5).

```typescript
const weeks = getAvailableWeeks();      // Grade 5
const weeks = getAvailableWeeks(3);     // Grade 3
// Returns: number[] (VD: [13, 14, 15])
```

#### getWeekTitle(week: number, grade?: number)
Lấy tiêu đề của tuần (mặc định lớp 5).

```typescript
const title = getWeekTitle(13);         // Grade 5
const title = getWeekTitle(13, 3);      // Grade 3
// Returns: "Tuần 13: Unit 1 - Địa chỉ và nơi ở"
```

#### findLessonById(lessonId: string, grade?: number)
Tìm bài học theo ID (mặc định lớp 5).

```typescript
const result = findLessonById('23123');        // Grade 5
const result = findLessonById('23123', 3);     // Grade 3
// Returns: { week: 13, lesson: WeeklyLesson } | null
```

## Usage Examples

### 1. Hiển thị danh sách bài học theo lớp và tuần

```typescript
import { LESSONS_BY_GRADE, getLessonsByGradeAndWeek } from '@/mock/data';

function ClassroomContent() {
  const [currentGrade, setCurrentGrade] = useState(5);
  const [currentWeek, setCurrentWeek] = useState(13);
  
  // Cách 1: Truy cập trực tiếp
  const currentLessons = LESSONS_BY_GRADE[currentGrade]?.[currentWeek]?.lessons || [];
  
  // Cách 2: Sử dụng helper function
  const currentLessons = getLessonsByGradeAndWeek(currentGrade, currentWeek);
  
  return (
    <div>
      {currentLessons.map(lesson => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}
```

### 1b. Backward compatible (mặc định lớp 5)

```typescript
import { WEEKLY_LESSONS } from '@/mock/data';

function ClassroomContent() {
  const [currentWeek, setCurrentWeek] = useState(13);
  const currentLessons = WEEKLY_LESSONS[currentWeek]?.lessons || [];
  
  return (
    <div>
      {currentLessons.map(lesson => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}
```

### 2. Hiển thị chi tiết bài học

```typescript
import { getLessonDetails } from '@/mock/data';

function LessonDetailPage({ week, lessonId }) {
  const details = getLessonDetails(week, lessonId);
  
  return (
    <div>
      {details.map(detail => (
        detail.type === 'video' ? (
          <VideoPlayer url={detail.videoUrl} />
        ) : (
          <VocabularyGame 
            data={detail.gameData.vocabularyItems}
            gameType={detail.gameData.gameType}
          />
        )
      ))}
    </div>
  );
}
```

### 3. Sử dụng VocabularyGame component

```typescript
import VocabularyGame from '@/components/lesson/vocabulary-game';

// Game gõ từ vựng
<VocabularyGame 
  data={vocabularyItems}
  gameType="typing"
/>

// Game chọn từ vựng
<VocabularyGame 
  data={vocabularyItems}
  gameType="choice"
/>

// Game ghi âm
<VocabularyGame 
  data={vocabularyItems}
  gameType="recording"
/>
```

## Migration Notes

### Thay đổi từ cấu trúc cũ

**Trước:**
```typescript
const lessons = WEEKLY_LESSONS[13]; // Array
```

**Sau:**
```typescript
const lessons = WEEKLY_LESSONS[13]?.lessons; // Object with lessons array
```

### Backward Compatibility

Các exports sau vẫn được giữ để tương thích ngược:
- `MAIN_LESSON` - Danh sách bài học từ tuần 13
- `ACCOUNT_INFOMATION` - Thông tin tài khoản
- `AVATAR_SYSTEM` - Danh sách avatar hệ thống
- `LESSON_DETAILS` (trong lesson-detail.ts) - Map lesson ID -> details
- `LESSON_VOCABULARY` (trong vocabulary-data.ts) - Map lesson ID -> vocabulary

## File Structure

```
src/mock/
├── data.ts              # Main data file với WEEKLY_LESSONS
├── lesson-detail.ts     # Legacy exports cho lesson details
├── vocabulary-data.ts   # Legacy exports cho vocabulary
└── README.md           # Documentation này
```

## Adding New Data

### Thêm tuần mới

```typescript
export const WEEKLY_LESSONS: WeeklyLessonConfig = {
  // ... existing weeks
  16: {
    weekTitle: "Tuần 16: Unit 4 - Chủ đề mới",
    lessons: [
      {
        id: '1601',
        category_title: 'Unit 4 - Lesson: Từ vựng',
        title: 'Chủ đề...',
        image: '...',
        progress: 0,
        lessonDetails: [
          // Add lesson details here
        ]
      }
    ]
  }
};
```

### Thêm từ vựng mới

```typescript
const NEW_VOCABULARY: VocabularyItem[] = [
  {
    id: 1,
    word: "example",
    meaning: "ví dụ",
    image: "https://...",
    audio: "https://..."
  }
];
```

### Thêm lesson detail mới

```typescript
lessonDetails: [
  {
    id: 1,
    type: 'video',
    title: 'Video bài giảng',
    score: "100",
    iconType: 'video',
    videoUrl: "https://..."
  },
  {
    id: 2,
    type: 'game',
    title: 'Gõ lại từ vựng',
    score: "100",
    iconType: 'game',
    gameData: {
      gameType: 'typing',
      vocabularyItems: NEW_VOCABULARY
    }
  }
]
```

## Notes

- Mỗi tuần có thể có nhiều bài học
- Mỗi bài học có thể có nhiều hoạt động (video/game)
- Game types: `typing`, `choice`, `recording`
- Progress được tính theo phần trăm (0-100)
- Score được lưu dưới dạng string để linh hoạt hiển thị
